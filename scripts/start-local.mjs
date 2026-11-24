import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createConnection, createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const children = new Set();
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode !== null || !child.pid) continue;
    if (process.platform === 'win32') {
      // Encerra somente as arvores de processos criadas por esta execucao.
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  }
  process.exitCode = code;
}

function launch(args, env = process.env) {
  if (stopping) throw new Error('Inicializacao cancelada.');
  const child = spawn(process.execPath, args, { cwd: root, env, stdio: 'inherit', windowsHide: true });
  children.add(child);
  child.once('error', (error) => {
    console.error(`Falha ao iniciar processo: ${error.message}`);
    stop(1);
  });
  child.once('exit', (code) => {
    children.delete(child);
    if (!stopping) {
      if (code) console.error('Um dos servicos encerrou com erro. Confira as mensagens acima.');
      stop(code ?? 1);
    }
  });
  return child;
}

async function assertPortFree(port) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Porta invalida.');
  for (const host of ['127.0.0.1', '::1']) {
    const occupied = await new Promise((accept) => {
      const socket = createConnection({ port, host });
      socket.setTimeout(1000);
      socket.once('connect', () => { socket.destroy(); accept(true); });
      socket.once('error', () => { socket.destroy(); accept(false); });
      socket.once('timeout', () => { socket.destroy(); accept(false); });
    });
    if (occupied) throw new Error(`Porta ${port} ocupada. Encerre a execucao anterior e tente novamente.`);
  }
  await new Promise((accept, reject) => {
    const probe = createServer();
    probe.once('error', () => reject(new Error(`Porta ${port} ocupada. Encerre a execucao anterior e tente novamente.`)));
    probe.listen({ port, host: '127.0.0.1', exclusive: true }, () => probe.close(accept));
  });
}

async function waitForApi(url, child) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (stopping || child.exitCode !== null) throw new Error('A API nao iniciou. Confira a configuracao e o banco.');
    try {
      const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1000) });
      if (response.ok && (await response.json()).status === 'ok') return;
    } catch { /* Aguarda o backend ficar disponivel. */ }
    await delay(500);
  }
  throw new Error('A API demorou para responder. Confira a janela e tente novamente.');
}

process.once('SIGINT', () => stop());
process.once('SIGTERM', () => stop());

try {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 13)) throw new Error('Instale Node.js 22.13 ou superior com npm.');
  const expo = resolve(root, 'node_modules/expo/bin/cli');
  if (!existsSync(expo)) throw new Error('Dependencias ausentes. Execute npm ci ou use Iniciar-PixelVault.cmd.');

  const apiPort = Number(process.env.API_PORT || 3000);
  const webPort = Number(process.env.PIXELVAULT_WEB_PORT || 8081);
  if (apiPort === webPort) throw new Error('API e web precisam de portas diferentes.');
  await assertPortFree(apiPort);
  await assertPortFree(webPort);
  if (stopping) throw new Error('Inicializacao cancelada.');

  const databasePath = resolve(process.env.PIXELVAULT_DB_PATH || 'database/pixelvault.sqlite');
  if (!existsSync(databasePath)) {
    console.log('Criando o banco inicial...');
    const { initializeDatabase } = await import('./init-db.mjs');
    initializeDatabase(databasePath);
  } else {
    console.log('Banco existente preservado.');
  }

  const mercadoPago = existsSync(resolve(root, '.env.mercadopago')) && !process.argv.includes('--local');
  const apiUrl = `http://127.0.0.1:${apiPort}`;
  console.log(`Pagamento: ${mercadoPago ? 'Mercado Pago de teste' : 'demonstracao local'}.`);
  const backend = launch([
    ...(mercadoPago ? ['--env-file=.env.mercadopago'] : []), 'server/index.mjs',
  ], {
    ...process.env, API_HOST: '127.0.0.1', API_PORT: String(apiPort),
    PIXELVAULT_DB_PATH: databasePath, PAYMENT_MODE: mercadoPago ? 'mercadopago' : 'simulated',
  });
  await waitForApi(apiUrl, backend);
  if (!stopping) {
    console.log(`API pronta: ${apiUrl}\nAplicativo: http://localhost:${webPort}\nMantenha esta janela aberta. Para encerrar, pressione Ctrl+C.`);
    // O arquivo privado e carregado somente pelo processo backend.
    const frontendEnv = { ...process.env, EXPO_PUBLIC_API_URL: apiUrl };
    for (const name of Object.keys(frontendEnv)) {
      if (name.startsWith('MERCADO_PAGO_')) delete frontendEnv[name];
    }
    launch([expo, 'start', '--localhost', '--port', String(webPort), '--clear',
      ...(process.argv.includes('--no-open') ? [] : ['--web'])], frontendEnv);
  }
} catch (error) {
  if (!stopping) console.error(`PixelVault: ${error.message}`);
  stop(1);
}
