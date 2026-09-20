import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.PIXELVAULT_EVIDENCE_URL ?? 'http://127.0.0.1:8097';
const suite = process.env.PIXELVAULT_EVIDENCE_SUITE ?? process.argv[2] ?? 'prompt-11';
const outputDirectory = resolve(`docs/evidence/${suite}`);
const staticDirectory = resolve('dist-web');
const debugPort = 9223;
const routeExpectations = Object.freeze({
  wf01: 'PixelVault', wf02: 'Criar conta', wf03: 'Descobrir jogos', wf04: 'Orbit Raiders',
  wf05: 'Seu carrinho', wf06: 'Finalizar pedido', wf07: 'Pedido concluído', wf08: 'Minha biblioteca',
  wf09: 'Manutenção do catálogo', 'wf10-new': 'Novo item', 'wf10-edit': 'Editar item',
  wf11: 'Confirmar exclusão', st01: 'PixelVault', st02: 'Descobrir jogos',
  st03: 'Seu carrinho', st04: 'Minha biblioteca', st05: 'Finalizar pedido',
});

const prompt11Captures = [
  ['wf-01-login-390x844', 'wf01', 390, 844],
  ['wf-02-cadastro-390x844', 'wf02', 390, 844],
  ['wf-03-catalogo-390x844', 'wf03', 390, 844],
  ['wf-04-detalhes-390x844', 'wf04', 390, 844],
  ['wf-05-carrinho-390x844', 'wf05', 390, 844],
  ['wf-06-checkout-390x844', 'wf06', 390, 844],
  ['wf-07-resultado-390x844', 'wf07', 390, 844],
  ['wf-08-biblioteca-390x844', 'wf08', 390, 844],
  ['wf-09-admin-390x844', 'wf09', 390, 844],
  ['wf-10-novo-item-390x844', 'wf10-new', 390, 844],
  ['wf-10-editar-item-390x844', 'wf10-edit', 390, 844],
  ['wf-11-exclusao-390x844', 'wf11', 390, 844],
  ['st-01-login-erro-390x844', 'st01', 390, 844],
  ['st-02-catalogo-vazio-390x844', 'st02', 390, 844],
  ['st-03-carrinho-vazio-390x844', 'st03', 390, 844],
  ['st-04-biblioteca-vazia-390x844', 'st04', 390, 844],
  ['st-05-checkout-erro-390x844', 'st05', 390, 844],
  ['wf-03-catalogo-360x844', 'wf03', 360, 844],
  ['wf-03-catalogo-320x568', 'wf03', 320, 568],
  ['wf-05-carrinho-320x568', 'wf05', 320, 568],
  ['wf-09-admin-320x568', 'wf09', 320, 568],
  ['wf-02-cadastro-fonte-130-390x844', 'wf02', 390, 844, { fontScale: 1.3 }],
  ['wf-06-checkout-campo-focado-390x844', 'wf06', 390, 844, { focusFirstField: true }],
  ['uxt-03-jogador-abre-catalogo-390x844', 'wf01', 390, 844, {
    actions: [['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'Descobrir jogos']],
  }],
  ['uxt-04-admin-abre-manutencao-390x844', 'wf01', 390, 844, {
    actions: [['fill', 'E-mail', 'admin@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'Manutenção do catálogo']],
  }],
  ['ux-foco-botao-secundario-wf01-390x844', 'wf01', 390, 844, {
    focusInteractiveLabel: 'Criar conta',
  }],
  ['ux-foco-navegacao-wf03-390x844', 'wf03', 390, 844, {
    focusInteractiveLabel: 'Carrinho',
  }],
];

const loginPlayer = [
  ['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'Descobrir jogos'],
];
const loginAdmin = [
  ['fill', 'E-mail', 'admin@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'Manutenção do catálogo'],
];
const addOrbit = [...loginPlayer, ['click', 'Ver detalhes de Orbit Raiders'], ['click', 'Adicionar ao carrinho']];
const addBoth = [...addOrbit, ['click', 'Voltar ao catálogo'], ['click', 'Ver detalhes de Neon Expansion'], ['click', 'Adicionar ao carrinho'], ['click', 'Ver carrinho (2)'], ['click', 'Continuar para checkout']];
const validCheckout = [...addBoth, ['fill', 'Número do cartão', '0000 0000 0000 0000'], ['fill', 'Nome impresso', 'Pessoa Compradora'], ['click', 'Confirmar pedido'], ['expect', 'Pedido concluído']];

const prompt12Captures = [
  ['uxt-01-cadastro-invalido-390x844', 'wf01', 390, 844, { actions: [['click', 'Criar conta'], ['click', 'Cadastrar conta'], ['expect', 'Erro: Campo obrigatório.']] }],
  ['uxt-02-cadastro-valido-390x844', 'wf01', 390, 844, { actions: [['click', 'Criar conta'], ['fill', 'Nome', 'Pessoa Compradora'], ['fill', 'E-mail', 'nova@pixelvault.example'], ['fill', 'Senha', 'senha456'], ['click', 'Cadastrar conta'], ['expect', 'Cadastro concluído. Entre com suas credenciais.']] }],
  ['uxt-03-login-jogador-390x844', 'wf01', 390, 844, { actions: loginPlayer }],
  ['uxt-04-login-admin-390x844', 'wf01', 390, 844, { actions: loginAdmin }],
  ['uxt-05-filtro-vazio-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Excluir Orbit Raiders'], ['click', 'Confirmar exclusão'], ['click', 'Sair'], ...loginPlayer, ['click', 'Boosteroid'], ['expect', 'Nenhum resultado']] }],
  ['uxt-05-filtro-limpo-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Excluir Orbit Raiders'], ['click', 'Confirmar exclusão'], ['click', 'Sair'], ...loginPlayer, ['click', 'Boosteroid'], ['click', 'Limpar filtro'], ['expect', 'Neon Expansion']] }],
  ['uxt-06-duplicidade-390x844', 'wf01', 390, 844, { actions: [...addOrbit, ['click', 'Já está no carrinho'], ['expect', 'Este item já está no carrinho.']] }],
  ['uxt-07-carrinho-vazio-390x844', 'wf01', 390, 844, { actions: [...addOrbit, ['click', 'Ver carrinho (1)'], ['click', 'Remover: Orbit Raiders'], ['expect', 'R$ 0,00']] }],
  ['uxt-08-checkout-dois-itens-390x844', 'wf01', 390, 844, { actions: [...addBoth, ['expect', 'R$ 104,80']] }],
  ['uxt-09-checkout-invalido-390x844', 'wf01', 390, 844, { actions: [...addBoth, ['click', 'Confirmar pedido'], ['expect', 'Nenhum pedido foi criado.']], scrollToText: 'Número do cartão' }],
  ['uxt-10-checkout-valido-390x844', 'wf01', 390, 844, { actions: validCheckout }],
  ['uxt-11-biblioteca-pos-compra-390x844', 'wf01', 390, 844, { actions: [...validCheckout, ['click', 'Abrir biblioteca'], ['expect', 'PV-NEON-4P8R']] }],
  ['uxt-12-crud-criado-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Novo item'], ['fill', 'Nome do produto', 'Item de teste'], ['click', 'Jogo'], ['fill', 'Preço', '12,50'], ['fill', 'Descrição', 'Descrição do item'], ['click', 'Boosteroid'], ['fill', 'Ativação em', 'PixelVault'], ['click', 'Cadastrar item'], ['expect', 'Item cadastrado com sucesso.']] }],
  ['uxt-12-crud-completo-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Novo item'], ['fill', 'Nome do produto', 'Item de teste'], ['click', 'Jogo'], ['fill', 'Preço', '12,50'], ['fill', 'Descrição', 'Descrição do item'], ['click', 'Boosteroid'], ['fill', 'Ativação em', 'PixelVault'], ['click', 'Cadastrar item'], ['click', 'Editar Item de teste'], ['fill', 'Nome do produto', 'Item editado'], ['click', 'Salvar alterações'], ['expect', 'Item editado'], ['click', 'Excluir Item editado'], ['click', 'Cancelar'], ['expect', 'Item editado'], ['click', 'Excluir Item editado'], ['click', 'Confirmar exclusão'], ['expect', 'Item excluído com sucesso.']] }],
  ['uxt-13-login-320x568', 'wf01', 320, 568, { actions: loginPlayer }],
  ['uxt-13-duplicidade-320x568', 'wf01', 320, 568, { actions: [...addOrbit, ['click', 'Já está no carrinho']] }],
  ['uxt-13-checkout-320x568', 'wf01', 320, 568, { actions: addBoth }],
  ['uxt-13-checkout-invalido-320x568', 'wf01', 320, 568, { actions: [...addBoth, ['click', 'Confirmar pedido']], scrollToText: 'Número do cartão' }],
  ['uxt-13-admin-320x568', 'wf01', 320, 568, { actions: loginAdmin }],
  ['uxt-14-cadastro-fonte-130-390x844', 'wf01', 390, 844, { fontScale: 1.3, actions: [['click', 'Criar conta']], focusField: 'Nome' }],
  ['uxt-14-checkout-fonte-130-360x844', 'wf01', 360, 844, { fontScale: 1.3, actions: addBoth, focusField: 'Número do cartão' }],
];

const story31Captures = [
  ...prompt11Captures.slice(0, 4),
  ['wf-05-carrinho-390x844', 'wf01', 390, 844, { actions: [...addOrbit, ['click', 'Ver carrinho (1)'], ['expect', 'Seu carrinho']] }],
  ['wf-06-checkout-390x844', 'wf01', 390, 844, { actions: addBoth }],
  ['wf-07-resultado-390x844', 'wf01', 390, 844, { actions: validCheckout }],
  ['wf-08-biblioteca-390x844', 'wf01', 390, 844, { actions: [...validCheckout, ['click', 'Abrir biblioteca'], ['expect', 'Minha biblioteca']] }],
  ...prompt11Captures.slice(8, 17),
  ['area-acesso-360x844', 'wf01', 360, 844],
  ['area-catalogo-360x844', 'wf03', 360, 844],
  ['area-compra-360x844', 'wf01', 360, 844, { actions: addBoth }],
  ['area-biblioteca-360x844', 'wf01', 360, 844, { actions: [...validCheckout, ['click', 'Abrir biblioteca'], ['expect', 'Minha biblioteca']] }],
  ['area-administracao-360x844', 'wf09', 360, 844],
  ['area-acesso-320x568', 'wf01', 320, 568],
  ['area-catalogo-320x568', 'wf03', 320, 568],
  ['area-compra-320x568', 'wf01', 320, 568, { actions: addBoth }],
  ['area-biblioteca-320x568', 'wf01', 320, 568, { actions: [...validCheckout, ['click', 'Abrir biblioteca'], ['expect', 'Minha biblioteca']] }],
  ['area-administracao-320x568', 'wf09', 320, 568],
  ['fonte-130-cadastro-390x844', 'wf02', 390, 844, { fontScale: 1.3, focusField: 'Nome' }],
  ['foco-campo-checkout-390x844', 'wf01', 390, 844, { actions: addBoth, focusField: 'Número do cartão' }],
  ['foco-botao-secundario-390x844', 'wf01', 390, 844, { focusInteractiveLabel: 'Criar conta' }],
  ['foco-navegacao-390x844', 'wf03', 390, 844, { focusInteractiveLabel: 'Carrinho' }],
];

const captures = suite === 'prompt-12'
  ? prompt12Captures
  : suite === 'story-3.1' || suite === 'story-3.2'
    ? story31Captures
    : prompt11Captures;

async function waitForDebugger() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return;
    } catch {
      // Chrome ainda está inicializando.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }
  throw new Error('Chrome DevTools Protocol não iniciou a tempo.');
}

function createClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let sequence = 0;

  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(String(data));
    if (!message.id) return;
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    if (message.error) handler.reject(new Error(message.error.message));
    else handler.resolve(message.result);
  });

  const opened = new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', rejectOpen, { once: true });
  });

  return {
    async call(method, params = {}) {
      await opened;
      const id = ++sequence;
      const result = new Promise((resolveCall, rejectCall) => {
        pending.set(id, { resolve: resolveCall, reject: rejectCall });
      });
      socket.send(JSON.stringify({ id, method, params }));
      return result;
    },
    close() {
      socket.close();
    },
  };
}

async function capture(name, route, width, height, options = {}) {
  const url = new URL(baseUrl);
  url.searchParams.set('screen', route);
  if (options.fontScale) url.searchParams.set('fontScale', String(options.fontScale));
  const pageUrl = url.toString();
  const targetResponse = await fetch(
    `http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(pageUrl)}`,
    { method: 'PUT' },
  );
  const target = await targetResponse.json();
  const client = createClient(target.webSocketDebuggerUrl);

  try {
    await client.call('Page.enable');
    await client.call('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: true,
      screenWidth: width,
      screenHeight: height,
    });
    await client.call('Page.navigate', { url: pageUrl });
    const expectedText = routeExpectations[route];
    let bodyText = '';
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const body = await client.call('Runtime.evaluate', {
        expression: 'document.body?.innerText ?? ""',
        returnByValue: true,
      });
      bodyText = body.result.value;
      if (bodyText.includes(expectedText)) break;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }
    if (!bodyText.includes(expectedText)) {
      throw new Error(`Rota ${route} não renderizou ${expectedText}: ${bodyText.slice(0, 80)}`);
    }
    for (const [action, label, value] of options.actions ?? []) {
      if (action === 'fill') {
        const filled = await client.call('Runtime.evaluate', {
          expression: `(() => {
            const input = [...document.querySelectorAll('input, textarea')]
              .find(element => element.getAttribute('aria-label') === ${JSON.stringify(label)});
            if (!input) return false;
            const prototype = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, ${JSON.stringify(value)});
            input.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          })()`,
          returnByValue: true,
        });
        if (!filled.result.value) throw new Error(`Campo não encontrado: ${label}`);
      }
      if (action === 'click') {
        const clicked = await client.call('Runtime.evaluate', {
          expression: `(() => {
            const target = [...document.querySelectorAll('[role="button"], [role="tab"]')]
              .find(element => element.getAttribute('aria-label') === ${JSON.stringify(label)});
            target?.click();
            return Boolean(target);
          })()`,
          returnByValue: true,
        });
        if (!clicked.result.value) throw new Error(`Ação não encontrada: ${label}`);
      }
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 180));
      if (action === 'expect') {
        const observed = await client.call('Runtime.evaluate', { expression: 'document.body?.innerText ?? ""', returnByValue: true });
        if (!observed.result.value.includes(label)) throw new Error(`Texto esperado não encontrado: ${label}`);
      }
    }
    if (options.focusFirstField) {
      await client.call('Runtime.evaluate', { expression: 'document.querySelector("input")?.focus()' });
    }
    if (options.focusField) {
      const focused = await client.call('Runtime.evaluate', {
        expression: `(() => {
          const target = [...document.querySelectorAll('input, textarea')]
            .find(element => element.getAttribute('aria-label') === ${JSON.stringify(options.focusField)});
          target?.focus();
          return document.activeElement === target;
        })()`,
        returnByValue: true,
      });
      if (!focused.result.value) throw new Error(`Foco não aplicado ao campo: ${options.focusField}`);
    }
    if (options.scrollToText) {
      await client.call('Runtime.evaluate', {
        expression: `([...document.querySelectorAll('input, textarea, [role="alert"]')]
          .find(element => element.getAttribute('aria-label') === ${JSON.stringify(options.scrollToText)} || element.textContent.includes(${JSON.stringify(options.scrollToText)})))?.scrollIntoView({ block: 'center' })`,
      });
    }
    if (options.focusInteractiveLabel) {
      const focused = await client.call('Runtime.evaluate', {
        expression: `(() => {
          const target = [...document.querySelectorAll('[role="button"], [role="tab"]')]
            .find(element => element.getAttribute('aria-label') === ${JSON.stringify(options.focusInteractiveLabel)});
          target?.focus();
          return document.activeElement === target;
        })()`,
        returnByValue: true,
      });
      if (!focused.result.value) throw new Error(`Foco não aplicado: ${options.focusInteractiveLabel}`);
    }
    if (options.clickLabel) {
      const clicked = await client.call('Runtime.evaluate', {
        expression: `(() => {
          const target = [...document.querySelectorAll('[role="button"]')]
            .find(element => element.textContent.includes(${JSON.stringify(options.clickLabel)}));
          target?.click();
          return Boolean(target);
        })()`,
        returnByValue: true,
      });
      if (!clicked.result.value) throw new Error(`Ação não encontrada: ${options.clickLabel}`);
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const body = await client.call('Runtime.evaluate', {
          expression: 'document.body?.innerText ?? ""',
          returnByValue: true,
        });
        if (body.result.value.includes(options.expectedAfterClick)) break;
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
        if (attempt === 19) throw new Error(`Navegação não alcançou ${options.expectedAfterClick}`);
      }
    }
    const perceptibleContent = await client.call('Runtime.evaluate', {
      expression: `JSON.stringify([
        document.body?.innerText ?? '',
        ...[...document.querySelectorAll('[aria-label], [aria-description], [placeholder], [alt]')]
          .flatMap(element => ['aria-label', 'aria-description', 'placeholder', 'alt']
            .map(attribute => element.getAttribute(attribute))
            .filter(Boolean))
      ])`,
      returnByValue: true,
    });
    const normalizedContent = JSON.parse(perceptibleContent.result.value)
      .join('\n')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const forbiddenContent = /(?:wf|st)-\d+|prototip|academic|fictici|demonstr|simul|\bdemo\b|capa ilustrativa|arte final|fonte:\s*lista local|(?:somente|apenas).*(?:sessao|lista local)|\bperfil\b|curador/;
    if (forbiddenContent.test(normalizedContent)) {
      throw new Error(`Conteúdo interno exposto na rota ${route}.`);
    }
    await client.call('Runtime.evaluate', {
      expression: 'document.fonts.ready.then(() => new Promise(resolve => setTimeout(resolve, 400)))',
      awaitPromise: true,
    });
    const metrics = await client.call('Runtime.evaluate', {
      expression: `JSON.stringify({
        innerWidth,
        innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        horizontalOverflowElements: [...document.querySelectorAll('*')]
          .filter(element => element.scrollWidth > element.clientWidth + 1)
          .map(element => element.tagName)
          .slice(0, 10),
        focusedElement: document.activeElement?.getAttribute('aria-label') ?? null,
        title: document.body.innerText.slice(0, 120)
      })`,
      returnByValue: true,
    });
    const screenshot = await client.call('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const measured = JSON.parse(metrics.result.value);
    if (measured.scrollWidth > measured.innerWidth + 1) throw new Error(`Overflow horizontal em ${name}: ${measured.scrollWidth} > ${measured.innerWidth}`);
    await writeFile(resolve(outputDirectory, `${name}.png`), Buffer.from(screenshot.data, 'base64'));
    return { name, route, width, height, options, ...measured };
  } finally {
    client.close();
    await fetch(`http://127.0.0.1:${debugPort}/json/close/${target.id}`);
  }
}

await mkdir(outputDirectory, { recursive: true });
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? '/', baseUrl).pathname;
    const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
    const body = await readFile(resolve(staticDirectory, relativePath));
    const contentType = relativePath.endsWith('.js')
      ? 'application/javascript'
      : relativePath.endsWith('.png')
        ? 'image/png'
        : relativePath.endsWith('.json')
          ? 'application/json'
          : 'text/html; charset=utf-8';
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});
await new Promise((resolveListen) => server.listen(8097, '127.0.0.1', resolveListen));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${resolve(`.expo/chrome-evidence-${suite}-${process.pid}`)}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

try {
  await waitForDebugger();
  const results = [];
  for (const definition of captures) {
    results.push(await capture(...definition));
  }
  await writeFile(
    resolve(outputDirectory, 'capture-results.json'),
    `${JSON.stringify({ capturedAt: new Date().toISOString(), runtime: 'Expo Web + Chrome headless CDP', results }, null, 2)}\n`,
  );
} finally {
  chrome.kill();
  server.close();
}
