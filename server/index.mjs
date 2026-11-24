import { createApplication } from './app.mjs';
import { loadConfig } from './config.mjs';

let application;
let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  await application?.close();
}

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error(`Configuração inválida da API PixelVault: ${error.message}`);
  process.exitCode = 1;
}

if (config) {
  try {
    application = createApplication(config);
    const address = await application.listen({ host: config.host, port: config.port });
    console.log(`PixelVault API disponível em http://${address.address}:${address.port}`);

    process.once('SIGINT', async () => {
      await shutdown();
      process.exitCode = 0;
    });
    process.once('SIGTERM', async () => {
      await shutdown();
      process.exitCode = 0;
    });
  } catch {
    await shutdown();
    console.error('Falha ao iniciar a API PixelVault. Verifique o banco local e a porta configurada.');
    process.exitCode = 1;
  }
}
