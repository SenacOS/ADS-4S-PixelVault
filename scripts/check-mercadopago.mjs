// Explicit opt-in smoke: creates/reuses a TEST preference, never submits a payment.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApplication } from '../server/app.mjs';
import { loadConfig } from '../server/config.mjs';
import { initializeDatabase } from './init-db.mjs';

if (process.env.MERCADO_PAGO_ENVIRONMENT !== 'test') throw new Error('Este comando exige configuração de teste.');
const directory = resolve('tmp/auditoria/mercadopago-live');
mkdirSync(directory, { recursive: true });
const databasePath = resolve(directory, 'test.sqlite');
if (!existsSync(databasePath)) initializeDatabase(databasePath);
const app = createApplication({ ...loadConfig(), databasePath, logger: {} });
try {
  const recoveryCheck = process.argv.includes('--recover');
  if (recoveryCheck) {
    // Isolated smoke database only: mimic a crash after the provider created the preference.
    const prior = app.database.prepare('SELECT status, phase FROM checkout_operation WHERE id = ?').get('pixelvault-test-smoke-20261120');
    if (!prior || prior.status !== 'PENDENTE' || prior.phase !== 'READY') throw new Error('Execute o smoke inicial antes da recuperação, sem pagamento aprovado.');
    app.database.prepare("UPDATE checkout_operation SET phase = 'REQUESTING', preference_id = NULL, checkout_url = NULL WHERE id = ?").run('pixelvault-test-smoke-20261120');
  }
  const address = await app.listen();
  const base = `http://127.0.0.1:${address.port}`;
  const auth = await (await fetch(`${base}/api/sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'jogador@pixelvault.example', password: 'demo123' }) })).json();
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` };
  const response = await fetch(`${base}/api/checkouts`, { method: 'POST', headers, body: JSON.stringify({ requestId: 'pixelvault-test-smoke-20261120', productIds: ['orbit-raiders', 'neon-expansion'] }) });
  const checkout = await response.json();
  if (!response.ok) throw new Error(`${response.status} ${checkout.error?.code}: ${checkout.error?.message}`);
  const checked = await fetch(`${base}/api/checkouts/${checkout.id}/reconcile`, { method: 'POST', headers, body: '{}' });
  const status = await checked.json();
  if (!checked.ok) throw new Error(`${checked.status} ${status.error?.code}: ${status.error?.message}`);
  const evidence = { checkedAt: new Date().toISOString(), environment: 'test', sellerId: process.env.MERCADO_PAGO_TEST_SELLER_ID,
    buyerId: process.env.MERCADO_PAGO_TEST_BUYER_ID, checkoutId: checkout.id, orderId: checkout.orderId, totalCents: checkout.totalCents,
    checkoutCreated: Boolean(checkout.checkoutUrl), checkoutHostname: checkout.checkoutUrl ? new URL(checkout.checkoutUrl).hostname : null,
    status: status.status, submittedPayment: false, recoveryCheck, note: 'Preferência real de teste e consulta; compra não realizada por este script.' };
  writeFileSync(resolve(directory, recoveryCheck ? 'recovery-result.json' : 'result.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence));
} finally { await app.close(); }
