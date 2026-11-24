import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createApplication } from '../server/app.mjs';
import { initializeDatabase } from './init-db.mjs';
import { qaScenarios } from './qa-full-scenarios.mjs';
import { createCheckoutEvidenceProvider } from './checkout-evidence-provider.mjs';
import { catalogAdditions } from '../server/catalog-expansion.mjs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.PIXELVAULT_EVIDENCE_URL ?? 'http://127.0.0.1:8097';
const suite = process.env.PIXELVAULT_EVIDENCE_SUITE ?? process.argv[2] ?? 'prompt-11';
const outputDirectory = resolve(`docs/evidence/${suite}`);
const isCatalogSuite = suite.startsWith('qa-catalog-');
const isVisualSuite = suite.startsWith('qa-visual-');
const isQaSuite = suite.startsWith('qa-full-') || isCatalogSuite || isVisualSuite;
const isPaymentSuite = suite.startsWith('qa-full-payment');
const paymentProvider = createCheckoutEvidenceProvider();
const isSyncSuite = suite.startsWith('qa-catalog-api') || isPaymentSuite || suite === 'sprint-2-story-3.2' || suite.startsWith('qa-full-api');
const staticDirectory = resolve(isSyncSuite ? 'tmp/auditoria/dist-web-sync' : 'dist-web');
const apiBaseUrl = 'http://127.0.0.1:3107';
const debugPort = 9223;
// Expo can reuse transforms when exporting different public env configurations.
// Reject the wrong artifact before treating configuration errors as UI failures.
const bundleDirectory = resolve(staticDirectory, '_expo/static/js/web');
const bundleNames = (await readdir(bundleDirectory)).filter(name => name.endsWith('.js'));
const bundleSources = await Promise.all(bundleNames.map(name => readFile(join(bundleDirectory, name), 'utf8')));
if (!bundleSources.length || bundleSources.some(source => source.includes(apiBaseUrl)) !== isSyncSuite) {
  throw new Error('Bundle incompatível com a suíte. Exporte a variante web correta com --clear e EXPO_PUBLIC_API_URL adequado.');
}

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
    actions: [['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'WF-03']],
  }],
  ['uxt-04-admin-abre-manutencao-390x844', 'wf01', 390, 844, {
    actions: [['fill', 'E-mail', 'admin@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'WF-09']],
  }],
  ['ux-foco-botao-secundario-wf01-390x844', 'wf01', 390, 844, {
    focusInteractiveLabel: 'Criar conta',
  }],
  ['ux-foco-navegacao-wf03-390x844', 'wf03', 390, 844, {
    focusInteractiveLabel: 'Carrinho',
  }],
  ['area-acesso-320x568', 'wf01', 320, 568],
  ['area-biblioteca-320x568', 'wf08', 320, 568],
  ['area-acesso-360x844', 'wf01', 360, 844],
  ['area-compra-360x844', 'wf06', 360, 844],
  ['area-administracao-360x844', 'wf09', 360, 844],
  ['area-biblioteca-360x844', 'wf08', 360, 844],
  ['fonte-130-admin-320x568', 'wf10-edit', 320, 568, { fontScale: 1.3, focusField: 'Nome do produto' }],
  ['fonte-130-checkout-320x568', 'wf06', 320, 568, { fontScale: 1.3, focusField: 'Nome impresso no cartão' }],
  ['botao-pressionado-teclado-390x844', 'wf01', 390, 844, { actions: [['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['button-states'], ['expect', 'WF-03']] }],
];

const loginPlayer = [
  ['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'WF-03'],
];
const loginAdmin = [
  ['fill', 'E-mail', 'admin@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['expect', 'WF-09'],
];
const addOrbit = [...loginPlayer, ['click', 'Ver detalhes de Orbit Raiders'], ['click', 'Adicionar ao carrinho']];
const addBoth = [...addOrbit, ['click', 'Voltar ao catálogo'], ['click', 'Ver detalhes de Neon Expansion'], ['click', 'Adicionar ao carrinho'], ['click', 'Ver carrinho (2)'], ['click', 'Continuar para checkout']];
const validCheckout = [...addBoth, ['fill', 'Número do cartão', '0000 DEMO'], ['fill', 'Nome impresso no cartão', 'Pessoa Fictícia'], ['click', 'Confirmar compra'], ['expect', 'WF-07']];

const prompt12Captures = [
  ['uxt-01-cadastro-invalido-390x844', 'wf01', 390, 844, { actions: [['click', 'Criar conta'], ['click', 'Cadastrar conta'], ['expect', 'Erro: Campo obrigatório.']] }],
  ['uxt-02-cadastro-valido-390x844', 'wf01', 390, 844, { actions: [['click', 'Criar conta'], ['fill', 'Nome', 'Pessoa Fictícia'], ['fill', 'E-mail', 'nova@pixelvault.example'], ['fill', 'Senha', 'demo456'], ['click', 'Cadastrar conta'], ['expect', 'Cadastro concluído. Entre com as credenciais de demonstração.']] }],
  ['uxt-03-login-jogador-390x844', 'wf01', 390, 844, { actions: loginPlayer }],
  ['uxt-04-login-admin-390x844', 'wf01', 390, 844, { actions: loginAdmin }],
  ['uxt-05-filtro-vazio-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Excluir Orbit Raiders'], ['click', 'Confirmar exclusão'], ['click', 'Sair'], ['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['click', 'Boosteroid'], ['expect', 'Nenhum resultado']] }],
  ['uxt-05-filtro-limpo-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Excluir Orbit Raiders'], ['click', 'Confirmar exclusão'], ['click', 'Sair'], ['fill', 'E-mail', 'jogador@pixelvault.example'], ['fill', 'Senha', 'demo123'], ['click', 'Entrar'], ['click', 'Boosteroid'], ['click', 'Limpar filtro'], ['expect', 'Neon Expansion']] }],
  ['uxt-06-duplicidade-390x844', 'wf01', 390, 844, { actions: [...addOrbit, ['click', 'Já está no carrinho'], ['expect', 'Este item já está no carrinho.']] }],
  ['uxt-07-carrinho-vazio-390x844', 'wf01', 390, 844, { actions: [...addOrbit, ['click', 'Ver carrinho (1)'], ['click', 'Remover: Orbit Raiders'], ['expect', 'R$ 0,00']] }],
  ['uxt-08-checkout-dois-itens-390x844', 'wf01', 390, 844, { actions: [...addBoth, ['expect', 'R$ 104,80']] }],
  ['uxt-09-checkout-invalido-390x844', 'wf01', 390, 844, { actions: [...addBoth, ['click', 'Confirmar compra'], ['expect', 'Nenhum pedido foi criado.']], scrollToText: 'Número do cartão' }],
  ['uxt-10-checkout-valido-390x844', 'wf01', 390, 844, { actions: validCheckout }],
  ['uxt-11-biblioteca-pos-compra-390x844', 'wf01', 390, 844, { actions: [...validCheckout, ['click', 'Abrir biblioteca'], ['expect', 'PV-NEON-DEMO']] }],
  ['uxt-12-crud-criado-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Novo item'], ['fill', 'Nome do produto', 'Item de teste'], ['click', 'Jogo'], ['fill', 'Preço', '12,50'], ['fill', 'Descrição', 'Descrição fictícia'], ['click', 'Boosteroid'], ['fill', 'Ativação em', 'Loja fictícia'], ['click', 'Cadastrar item'], ['expect', 'Item cadastrado na lista local.']] }],
  ['uxt-12-crud-completo-390x844', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Novo item'], ['fill', 'Nome do produto', 'Item de teste'], ['click', 'Jogo'], ['fill', 'Preço', '12,50'], ['fill', 'Descrição', 'Descrição fictícia'], ['click', 'Boosteroid'], ['fill', 'Ativação em', 'Loja fictícia'], ['click', 'Cadastrar item'], ['click', 'Editar Item de teste'], ['fill', 'Nome do produto', 'Item editado'], ['click', 'Salvar alterações'], ['expect', 'Item editado'], ['click', 'Excluir Item editado'], ['click', 'Cancelar'], ['expect', 'Item editado'], ['click', 'Excluir Item editado'], ['click', 'Confirmar exclusão'], ['expect', 'Item excluído da lista local.']] }],
  ['uxt-13-login-320x568', 'wf01', 320, 568, { actions: loginPlayer }],
  ['uxt-13-duplicidade-320x568', 'wf01', 320, 568, { actions: [...addOrbit, ['click', 'Já está no carrinho']] }],
  ['uxt-13-checkout-320x568', 'wf01', 320, 568, { actions: addBoth }],
  ['uxt-13-checkout-invalido-320x568', 'wf01', 320, 568, { actions: [...addBoth, ['click', 'Confirmar compra']], scrollToText: 'Número do cartão' }],
  ['uxt-13-admin-320x568', 'wf01', 320, 568, { actions: loginAdmin }],
  ['uxt-14-cadastro-fonte-130-390x844', 'wf01', 390, 844, { fontScale: 1.3, actions: [['click', 'Criar conta']], focusField: 'Nome' }],
  ['uxt-14-checkout-fonte-130-360x844', 'wf01', 360, 844, { fontScale: 1.3, actions: addBoth, focusField: 'Número do cartão' }],
];

const persistenceCaptures = [
  ['cart-restored', 'wf01', 390, 844, { actions: [...addOrbit, ['reload', 'WF-01'], ...loginPlayer, ['click', 'Carrinho'], ['expect', 'Orbit Raiders'], ['expect', 'R$ 79,90']] }],
  ['library-restored', 'wf01', 390, 844, { actions: [...validCheckout, ['reload', 'WF-01'], ...loginPlayer, ['click', 'Biblioteca'], ['expect', 'Orbit Raiders'], ['expect', 'Neon Expansion'], ['safe-storage']] }],
  ['admin-crud-restored', 'wf01', 390, 844, { actions: [...loginAdmin, ['click', 'Novo item'], ['fill', 'Nome do produto', 'Item persistente'], ['click', 'Jogo'], ['fill', 'Preço', '12,50'], ['fill', 'Descrição', 'Descrição fictícia'], ['click', 'Boosteroid'], ['fill', 'Ativação em', 'Loja fictícia'], ['click', 'Cadastrar item'], ['expect', 'Item cadastrado na lista local.'], ['reload', 'WF-01'], ...loginAdmin, ['expect', 'Item persistente']], scrollToText: 'Item persistente' }],
  ['user-isolation', 'wf01', 320, 568, { actions: [...addOrbit, ['click', 'Voltar ao catálogo'], ['click', 'Sair'], ['click', 'Criar conta'], ['fill', 'Nome', 'Outro jogador'], ['fill', 'E-mail', 'outro@pixelvault.example'], ['fill', 'Senha', 'demo456'], ['click', 'Cadastrar conta'], ['click', 'Entrar'], ['click', 'Carrinho'], ['expect', 'Nenhum item no carrinho']] }],
];
const createItem = (name) => [['click', 'Novo item'], ['fill', 'Nome do produto', name], ['click', 'Jogo'], ['fill', 'Preço', '12,50'], ['fill', 'Descrição', 'Descrição fictícia'], ['click', 'Boosteroid'], ['fill', 'Ativação em', 'Loja fictícia'], ['click', 'Cadastrar item'], ['expect', 'Item cadastrado na lista local.']];
const syncCatalog = [['click', 'Sincronizar catálogo'], ['expect', 'Catálogo sincronizado com o servidor.']];
const syncCaptures = [
  ['crud-servidor', 'wf01', 390, 844, { actions: [...loginAdmin, ...createItem('CRUD integrado'), ...syncCatalog, ['server-expect', 'CRUD integrado', true], ['click', 'Editar CRUD integrado'], ['fill', 'Nome do produto', 'CRUD alterado'], ['fill', 'Preço', '25,90'], ['click', 'Salvar alterações'], ...syncCatalog, ['server-expect', 'CRUD alterado', true], ['reload', 'WF-01'], ...loginAdmin, ['expect', 'CRUD alterado'], ['click', 'Excluir CRUD alterado'], ['click', 'Confirmar exclusão'], ...syncCatalog, ['server-expect', 'CRUD alterado', false], ['safe-storage']] }],
  ['retomada-offline', 'wf01', 390, 844, { actions: [...loginAdmin, ['api-offline'], ...createItem('Criado offline'), ['click', 'Sincronizar catálogo'], ['expect', 'Sincronização pendente'], ['reload', 'WF-01'], ...loginAdmin, ['expect', '1 alterações pendentes'], ['api-online'], ['click', 'Sair'], ...loginAdmin, ...syncCatalog, ['server-expect', 'Criado offline', true], ['safe-storage']], scrollToText: 'Criado offline' }],
  ['conflito-resolvido', 'wf01', 320, 568, { actions: [...loginAdmin, ...createItem('Item conflito'), ...syncCatalog, ['click', 'Editar Item conflito'], ['fill', 'Nome do produto', 'Versão local'], ['click', 'Salvar alterações'], ['server-edit', 'Item conflito', 'Versão remota'], ['click', 'Sincronizar catálogo'], ['expect', 'O produto mudou no servidor'], ['server-expect', 'Versão remota', true], ['click', 'Recarregar versão do servidor'], ['click', 'Confirmar descarte e recarregar'], ['expect', 'Catálogo do servidor recuperado'], ['expect', '0 alterações pendentes'], ['expect', 'Versão remota']], scrollToText: 'Versão remota' }],
];
const exportCaptures = [
  ['export-catalogo', 'wf01', 390, 844, { actions: [...loginAdmin, ['export-json', { catalogo: 2, carrinho: 0, biblioteca: 0 }], ['expect', 'Download do arquivo JSON solicitado.']] }],
  ['export-conta-atual', 'wf01', 390, 844, { actions: [...validCheckout, ['click', 'Abrir biblioteca'], ['click', 'Catálogo'], ['absent', 'Exportar dados em JSON'], ['click', 'Sair'], ['click', 'Criar conta'], ['fill', 'Nome', 'Outra conta'], ['fill', 'E-mail', 'outra@pixelvault.example'], ['fill', 'Senha', 'demo456'], ['click', 'Cadastrar conta'], ['click', 'Entrar'], ['absent', 'Exportar dados em JSON']] }],
  ['export-admin-offline', 'wf01', 320, 568, { actions: [...loginAdmin, ...createItem('Produto offline'), ['export-json', { catalogo: 3, carrinho: 0, biblioteca: 0, pendentes: 1 }]], scrollToText: 'Download do arquivo JSON solicitado.' }],
  ['export-erro-retentativa', 'wf01', 390, 844, { actions: [...loginAdmin, ['fail-export'], ['click', 'Exportar dados em JSON'], ['expect', 'Não foi possível exportar o JSON.'], ['restore-export'], ['export-json', { catalogo: 2, carrinho: 0, biblioteca: 0 }], ['expect', 'Download do arquivo JSON solicitado.']] }],
];
const qa = qaScenarios({ loginPlayer, loginAdmin, addOrbit, addBoth, validCheckout, createItem, prompt12Captures, persistenceCaptures, exportCaptures, syncCaptures });
const paymentCaptures = [
  ['checkout-resposta-atrasada-logout', 'wf01', 390, 844, { actions: [...addBoth, ['payment-block'], ['click', 'Preparar pedido'], ['click', 'Voltar ao carrinho'], ['click', 'Catálogo'], ['click', 'Sair'], ...loginAdmin, ['payment-release'], ['expect', 'WF-09'], ['no-text', 'Resumo confirmado pelo servidor'], ['no-text', 'Pagamento pendente'], ['safe-storage']] }],
  ['checkout-cache-sem-perfil-oculto', 'wf01', 390, 844, { actions: [...addBoth, ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['payment-state', 'APROVADO'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento confirmado'], ['reload', 'WF-01'], ['open-route', 'wf08'], ['expect', 'Biblioteca vazia'], ['no-text', 'Orbit Raiders'], ['open-route', 'wf07'], ['expect', 'Confirmação pendente']] }],
  ['checkout-retomada-carrinho-vazio', 'wf01', 320, 568, { actions: [...addBoth, ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['click', 'Voltar ao carrinho'], ['click', 'Remover: Orbit Raiders'], ['click', 'Remover: Neon Expansion'], ['click', 'Retomar checkout do pedido'], ['click', 'Retomar pedido'], ['expect', 'R$ 104,80'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento pendente']] }],
  ['checkout-produto-local-corrigido', 'wf01', 390, 844, { actions: [...loginAdmin, ...createItem('Produto só local'), ['click', 'Sair'], ...loginPlayer, ['click', 'Ver detalhes de Produto só local'], ['click', 'Adicionar ao carrinho'], ['click', 'Ver carrinho (1)'], ['click', 'Continuar para checkout'], ['click', 'Preparar pedido'], ['expect', 'Produto indisponível no servidor'], ['click', 'Voltar ao carrinho'], ['click', 'Remover: Produto só local'], ['click', 'Catálogo'], ['click', 'Ver detalhes de Orbit Raiders'], ['click', 'Adicionar ao carrinho'], ['click', 'Ver carrinho (1)'], ['click', 'Continuar para checkout'], ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['expect', 'R$ 79,90'], ['payment-count', 1]] }],
  ['checkout-novo-apos-reabrir', 'wf01', 390, 844, { actions: [...addBoth, ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['payment-state', 'APROVADO'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento confirmado'], ['reload', 'WF-01'], ...loginPlayer, ['click', 'Carrinho'], ['click', 'Retomar checkout do pedido'], ['click', 'Retomar pedido'], ['expect', 'Estado: APROVADO'], ['click', 'Iniciar outro pedido'], ['expect', 'Continuar para checkout']] }],
  ['checkout-pendente', 'wf01', 390, 844, { actions: [...addBoth, ['no-card-fields'], ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['expect', 'R$ 104,80'], ['click', 'Retomar pedido'], ['payment-count', 1], ['payment-popup'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento pendente'], ['safe-storage']] }],
  ['checkout-aprovado-restaurado', 'wf01', 320, 568, { actions: [...addBoth, ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['payment-state', 'APROVADO'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento confirmado'], ['click', 'Abrir biblioteca'], ['expect', 'Orbit Raiders'], ['expect', 'Neon Expansion'], ['click', 'Atualizar biblioteca do servidor'], ['expect', 'Aquisições de teste confirmadas'], ['reload', 'WF-01'], ...loginPlayer, ['click', 'Biblioteca'], ['expect', 'Orbit Raiders'], ['click', 'Catálogo'], ['absent', 'Exportar dados em JSON'], ['safe-storage']] }],
  ['checkout-recusado-cancelado', 'wf01', 390, 844, { actions: [...addBoth, ['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['payment-state', 'RECUSADO'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento recusado'], ['payment-state', 'CANCELADO'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento cancelado'], ['click', 'Voltar ao carrinho'], ['click', 'Biblioteca'], ['expect', 'Biblioteca vazia']] }],
  ['checkout-offline-retomada', 'wf01', 320, 568, { actions: [...addBoth, ['api-offline'], ['click', 'Preparar pedido'], ['api-online'], ['click', 'Retomar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['safe-storage']] }],
  ['checkout-conta-local-bloqueada', 'wf01', 390, 844, { actions: [['click', 'Criar conta'], ['fill', 'Nome', 'Conta local'], ['fill', 'E-mail', 'checkoutlocal@pixelvault.example'], ['fill', 'Senha', 'demo456'], ['click', 'Cadastrar conta'], ['click', 'Entrar'], ['expect', 'WF-03'], ['click', 'Ver detalhes de Orbit Raiders'], ['click', 'Adicionar ao carrinho'], ['click', 'Ver carrinho (1)'], ['click', 'Continuar para checkout'], ['click', 'Preparar pedido'], ['expect', 'Entre novamente com uma conta do servidor'], ['no-card-fields'], ['absent', 'Abrir Mercado Pago']] }],
];
const fullCatalog = [{id:'orbit-raiders',name:'Orbit Raiders',priceCents:7990,description:'Descrição demonstrativa. O conteúdo final ainda não foi aprovado.',compatibleWith:['GeForce NOW','Boosteroid']},{id:'neon-expansion',name:'Neon Expansion',priceCents:2490,description:'Expansão demonstrativa para a jornada visual do PixelVault.',compatibleWith:['GeForce NOW']},...catalogAdditions];
const canonicalCatalog = fullCatalog.map(p=>({id:p.id,name:p.name,type:p.id==='neon-expansion'?'DLC':'Jogo',priceCents:p.priceCents,description:p.description,activationStore:'Loja de demonstração (fictícia)',compatibleWith:[...p.compatibleWith].sort()})).sort((a,b)=>a.id.localeCompare(b.id));
const catalogCaptures = [
  ['catalogo-lista-inicio-390', 'wf01', 390, 844, {actions:[...loginPlayer,['expect','32 itens encontrados']]}],
  ['catalogo-lista-final-320', 'wf01', 320, 568, {actions:[...loginPlayer,['catalog-scan','Todos']]}],
  ['catalogo-32-imagens-390', 'wf01', 390, 844, { actions: [...loginPlayer,['catalog-scan','Todos'],['click','GeForce NOW'],['catalog-scan','GeForce NOW'],['click','Boosteroid'],['catalog-scan','Boosteroid'],['click','Todos'],['catalog-scan','Todos'],['click','Ver detalhes de Zenith Frontier'],['expect','Zenith Frontier'],['click','Adicionar ao carrinho'],['click','Ver carrinho (1)'],['expect','R$ 54,90']] }],
  ['catalogo-32-imagens-320', 'wf01', 320, 568, { actions: [...loginPlayer,['catalog-scan','Todos'],['click','Ver detalhes de Zenith Frontier'],['expect','Zenith Frontier'],['click','Voltar ao catálogo'],['catalog-top'],['click','Ver detalhes de Aurora Quest'],['expect','Explore florestas luminosas'],['click','Adicionar ao carrinho'],['click','Ver carrinho (1)'],['expect','R$ 19,90']] }],
  ['catalogo-fallback-erro-e-recuperacao', 'wf01', 390, 844, { actions: [['images-offline'],['reload','WF-01'],...loginPlayer,['expect','Imagem indisponível'],['images-online'],['reload','WF-01'],...loginPlayer,['catalog-scan','Todos']] }],
  ['catalogo-capa-generica-id-herdado', 'wf01', 320, 568, { actions: [['seed-custom-cover'],['reload','WF-01'],...loginPlayer,['catalog-bottom'],['click','Ver detalhes de Produto sem capa própria'],['expect','Produto sem capa própria'],['generic-cover-loaded']] }],
  ...(!isSyncSuite ? [['catalogo-cache-antigo-atualizado','wf01',390,844,{actions:[['seed-legacy-catalog'],['reload','WF-01'],...loginPlayer,['catalog-scan','Todos'],['click','Carrinho'],['expect','Orbit Raiders'],['expect','R$ 79,90'],['safe-storage']]}]] : []),
];
const captures = isVisualSuite ? prompt11Captures : isCatalogSuite ? catalogCaptures : isPaymentSuite ? paymentCaptures : isQaSuite ? (isSyncSuite ? qa.api : qa.local) : suite === 'sprint-2-story-3.3' ? exportCaptures : isSyncSuite ? syncCaptures : suite === 'sprint-2-story-3.1' ? persistenceCaptures : ['prompt-12', 'sprint-2-regression', 'sprint-2-regression-3.2', 'sprint-2-regression-3.3'].includes(suite) ? prompt12Captures : prompt11Captures;
const purchaseInterfaceCaptures = [
  ['jogador-compra-sem-avisos', 'wf01', 390, 844, { actions: [...loginPlayer, ['absent', 'Atualizar catálogo da API'], ['absent', 'Exportar dados em JSON'], ['click', 'Ver detalhes de Orbit Raiders'], ['click', 'Adicionar ao carrinho'], ['click', 'Ver carrinho (1)'], ['click', 'Continuar para checkout'], ['expect', 'Finalizar compra'], ['no-text', 'ambiente de teste'], ['no-text', 'Uso acadêmico'], ['no-text', 'simulad'], ...(isSyncSuite ? [['click', 'Preparar pedido'], ['expect', 'Resumo confirmado pelo servidor'], ['expect', 'Abrir Mercado Pago'], ['expect', 'Consultar pagamento'], ['no-text', 'de teste'], ['payment-state', 'APROVADO'], ['click', 'Consultar pagamento'], ['expect', 'Pagamento confirmado']] : [['fill', 'Número do cartão', '0000 DEMO'], ['fill', 'Nome impresso no cartão', 'Pessoa Fictícia'], ['click', 'Confirmar compra'], ['expect', 'Compra concluída']]), ['no-text', 'de teste'], ['safe-storage']] }],
  ['admin-acoes-preservadas', 'wf01', 320, 568, { actions: [...loginAdmin, ['expect', 'Atualizar catálogo da API'], ['click', 'Atualizar catálogo da API'], ['expect', isSyncSuite ? 'Catálogo sincronizado com o servidor.' : 'Configure EXPO_PUBLIC_API_URL'], ['export-json', { catalogo: 2, carrinho: 0, biblioteca: 0 }], ['expect', 'Download do arquivo JSON solicitado.'], ['click', 'Sair'], ...loginPlayer, ['absent', 'Atualizar catálogo da API'], ['absent', 'Exportar dados em JSON']] }],
];
const currentCaptures = suite.endsWith('ui-3.11') ? purchaseInterfaceCaptures : captures;
const selectedCaptures = process.env.PIXELVAULT_EVIDENCE_CASE ? currentCaptures.filter(([name]) => name === process.env.PIXELVAULT_EVIDENCE_CASE) : currentCaptures;
if (!selectedCaptures.length) throw new Error('Cenário solicitado não existe.');

// Documentary route IDs remain test metadata, never text or accessible labels.
function expectationExpression(label) {
  const emptyStates = { 'ST-02': 'Nenhum resultado', 'ST-03': 'Nenhum item no carrinho', 'ST-04': 'Biblioteca vazia' };
  if (emptyStates[label]) return `(document.body?.innerText ?? '').includes(${JSON.stringify(emptyStates[label])})`;
  if (/^(WF|ST)-\d{2}$/.test(label)) {
    const route = label.toLowerCase().replace('-', '');
    return `Boolean(document.querySelector('[data-testid^="pixelvault-route-${route}"]'))`;
  }
  const text = label === 'ARMAZENAMENTO LOCAL' ? 'Preparando seus dados' : label;
  return `(document.body?.innerText ?? '').includes(${JSON.stringify(text)})`;
}

function trimLegacyFixture(application) {
  application.database.exec("DELETE FROM compatibilidade_produto WHERE produto_id NOT IN ('orbit-raiders','neon-expansion'); DELETE FROM produto WHERE id NOT IN ('orbit-raiders','neon-expansion');");
}

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
  if (isPaymentSuite) {
    await apiApplication.close();
    initializeDatabase(apiDatabasePath);
    paymentProvider.state.status = 'PENDENTE'; paymentProvider.state.creates = 0; paymentProvider.state.preferences.clear(); paymentProvider.state.pauseCreation = false;
    apiApplication = createApplication({ databasePath: apiDatabasePath, paymentMode: 'mercadopago', checkoutGateway: paymentProvider.gateway, logger: {} });
    trimLegacyFixture(apiApplication);
    await apiApplication.listen({ port: 3107 });
  }
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
  const downloadedFiles = [];
  const controls = new Map();
  const catalogChecks = [];
  const interactionChecks = [];
  let catalogSnapshot;
  const downloadDirectory = resolve(outputDirectory, 'downloads', name);

  try {
    await client.call('Page.enable');
    await client.call('Network.enable');
    if (options.actions?.some(([action]) => action === 'export-json')) {
      await mkdir(downloadDirectory, { recursive: true });
      await client.call('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDirectory });
    }
    // Every scenario starts clean; reload actions within it preserve the same storage.
    await client.call('Storage.clearDataForOrigin', { origin: url.origin, storageTypes: 'local_storage' });
    await client.call('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: true,
      screenWidth: width,
      screenHeight: height,
    });
    await client.call('Page.navigate', { url: pageUrl });
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const state = await client.call('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('[data-testid="pixelvault-route-${route}"]'))`,
        returnByValue: true,
      });
      ready = state.result.value;
      if (ready) break;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }
    if (!ready) {
      throw new Error(`Rota ${route} não ficou pronta.`);
    }
    if (!isCatalogSuite) {
      await client.call('Runtime.evaluate',{expression:`(()=>{const key='pixelvault.mobile.v1',v=JSON.parse(localStorage.getItem(key));v.catalog=v.catalog.filter(p=>['orbit-raiders','neon-expansion'].includes(p.id));v.catalogEdition=2;localStorage.setItem(key,JSON.stringify(v));})()`});
      await client.call('Page.reload');
      await new Promise((resolveDelay)=>setTimeout(resolveDelay,700));
    }
    for (const [action, label, value] of options.actions ?? []) {
      if (action === 'button-states') {
        const point = await client.call('Runtime.evaluate', { expression: `(() => {const e=[...document.querySelectorAll('[role="button"]')].find(e=>e.getAttribute('aria-label')==='Entrar');const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`, returnByValue:true });
        await client.call('Input.dispatchMouseEvent', { type:'mouseMoved', ...point.result.value });
        await client.call('Input.dispatchMouseEvent', { type:'mousePressed', ...point.result.value, button:'left', clickCount:1 });
        await new Promise(resolveDelay=>setTimeout(resolveDelay,100));
        const pressed = await client.call('Runtime.evaluate', { expression: `(() => {const e=[...document.querySelectorAll('[role="button"]')].find(e=>e.getAttribute('aria-label')==='Entrar');const s=getComputedStyle(e);return {background:s.backgroundColor,border:s.borderTopColor};})()`,returnByValue:true });
        if (pressed.result.value.background!=='rgb(174, 132, 38)' || !['rgb(116, 87, 19)','rgb(90, 67, 16)'].includes(pressed.result.value.border)) throw new Error(`Estado pressionado do botão ouro não foi aplicado: ${JSON.stringify(pressed.result.value)}`);
        await client.call('Input.dispatchMouseEvent', { type:'mouseMoved', x:1,y:1,button:'left',buttons:1 });
        await client.call('Input.dispatchMouseEvent', { type:'mouseReleased', x:1,y:1,button:'left',clickCount:1 });
        await client.call('Runtime.evaluate',{expression:`[...document.querySelectorAll('input')].find(e=>e.getAttribute('aria-label')==='E-mail').focus()`});
        for (let step=0;step<2;step++) {
          await client.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
          await client.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
        }
        const focus = await client.call('Runtime.evaluate',{expression:`(() => {const e=document.activeElement,s=getComputedStyle(e);return {label:e.getAttribute('aria-label'),border:s.borderTopColor,width:s.borderTopWidth};})()`,returnByValue:true});
        if (focus.result.value.label!=='Entrar' || focus.result.value.border!=='rgb(90, 67, 16)' || focus.result.value.width!=='3px') throw new Error('Tab não alcançou botão com foco visível.');
        await new Promise(resolveDelay=>setTimeout(resolveDelay,100));
        await client.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
        await client.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
        interactionChecks.push({primaryPressed:pressed.result.value,keyboardFocus:focus.result.value,activation:'Enter; rota de destino verificada pela próxima asserção'});
      }
      if (action === 'images-offline' || action === 'images-online') {
        await client.call('Network.setCacheDisabled',{cacheDisabled:true});
        await client.call('Network.setBlockedURLs',{urls:action==='images-offline'?['*.png']:[]});
      }
      if (action === 'seed-legacy-catalog' || action === 'seed-custom-cover') {
        await client.call('Runtime.evaluate',{expression:`(()=>{const key='pixelvault.mobile.v1',v=JSON.parse(localStorage.getItem(key));if(${JSON.stringify(action)}==='seed-legacy-catalog'){v.catalog=v.catalog.filter(p=>['orbit-raiders','neon-expansion'].includes(p.id));delete v.catalogEdition;v.users['player-demo']={cart:[v.catalog.find(p=>p.id==='orbit-raiders')],library:[],order:null};}else{v.catalog.push({...v.catalog[0],id:'constructor',name:'Produto sem capa própria'});v.catalogDirty=true;}localStorage.setItem(key,JSON.stringify(v));})()`});
      }
      if (action === 'catalog-top' || action === 'catalog-bottom') {
        await client.call('Runtime.evaluate',{expression:`(()=>{const e=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+100&&/auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a,b)=>b.scrollHeight-a.scrollHeight)[0];if(e)e.scrollTop=${action==='catalog-top'?'0':'e.scrollHeight'};})()`});
        await new Promise((resolveDelay)=>setTimeout(resolveDelay,600));
      }
      if (action === 'generic-cover-loaded') {
        const r=await client.call('Runtime.evaluate',{expression:`(()=>{const e=[...document.querySelectorAll('[aria-label^="Capa de "]')].find(e=>e.getAttribute('aria-label').includes('Produto sem capa própria'));const i=e?.querySelector('img')??(e?.tagName==='IMG'?e:null);return Boolean(i?.complete&&i.naturalWidth===768&&i.naturalHeight===432);})()`,returnByValue:true});
        if(!r.result.value)throw new Error('Capa genérica não carregou para ID constructor.');
      }
      if (action === 'catalog-scan') {
        const expected=fullCatalog.filter(p=>label==='Todos'||p.compatibleWith.includes(label));const seen=new Map();let atBottom=0;
        await client.call('Runtime.evaluate',{expression:`(()=>{const e=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+100&&/auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a,b)=>b.scrollHeight-a.scrollHeight)[0];if(e)e.scrollTop=0;})()`});
        for(let step=0;step<100;step++){
          await new Promise((resolveDelay)=>setTimeout(resolveDelay,120));
          const observed=await client.call('Runtime.evaluate',{expression:`(()=>{const imgs=[...document.querySelectorAll('[aria-label^="Capa de "]')].map(e=>{const i=e.querySelector('img')??(e.tagName==='IMG'?e:null),r=e.getBoundingClientRect();return{label:e.getAttribute('aria-label'),loaded:Boolean(i?.complete&&i.naturalWidth===768&&i.naturalHeight===432&&Math.abs(r.width/r.height-16/9)<0.03),src:i?.currentSrc??i?.src};});const buttons=[...document.querySelectorAll('[role="button"]')].map(e=>e.getAttribute('aria-label'));const e=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+100&&/auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a,b)=>b.scrollHeight-a.scrollHeight)[0];const bottom=!e||e.scrollTop+e.clientHeight>=e.scrollHeight-2;if(e)e.scrollTop+=Math.max(200,e.clientHeight*0.8);return{imgs,buttons,bottom};})()`,returnByValue:true});
          const o=observed.result.value;
          for(const product of expected){const img=o.imgs.find(i=>i.label===`Capa de ${product.name}`);if(img?.loaded&&o.buttons.includes(`Ver detalhes de ${product.name}`))seen.set(product.id,{id:product.id,name:product.name,loaded:true,src:img.src});}
          atBottom=o.bottom?atBottom+1:0;if(atBottom>=4&&seen.size===expected.length)break;
        }
        const missing=expected.filter(p=>!seen.has(p.id)).map(p=>p.id);
        if(missing.length)throw new Error(`Capas ou títulos ausentes em ${label}: ${missing.join(', ')}`);
        const stored=await client.call('Runtime.evaluate',{expression:`JSON.parse(localStorage.getItem('pixelvault.mobile.v1')).catalogEdition`,returnByValue:true});
        if(stored.result.value!==2)throw new Error('Migração do catálogo não foi persistida.');
        const domain=await client.call('Runtime.evaluate',{expression:`JSON.stringify(JSON.parse(localStorage.getItem('pixelvault.mobile.v1')).catalog.map(p=>({id:p.id,name:p.name,type:p.type,priceCents:Math.round(p.price*100),description:p.description,activationStore:p.activationStore,compatibleWith:[...p.compatibleWith].sort()})).sort((a,b)=>a.id.localeCompare(b.id)))`,returnByValue:true});
        catalogSnapshot=JSON.parse(domain.result.value);
        if(JSON.stringify(catalogSnapshot)!==JSON.stringify(canonicalCatalog))throw new Error('Campos do catálogo local/API divergem do manifesto canônico.');
        catalogChecks.push({filter:label,count:seen.size,imagesLoaded:seen.size,uniqueImageUrls:new Set([...seen.values()].map(i=>i.src)).size,items:[...seen.values()]});
      }
      if (action === 'payment-block') paymentProvider.state.pauseCreation = true;
      if (action === 'payment-release') {
        if (!paymentProvider.state.release) throw new Error('Criação não ficou pendente para o teste de logout.');
        paymentProvider.state.release();
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 700));
      }
      if (action === 'open-route') {
        const destination = new URL(baseUrl); destination.searchParams.set('screen', label);
        await client.call('Page.navigate', { url: destination.toString() });
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 1000));
      }
      if (action === 'no-text') {
        const text = await client.call('Runtime.evaluate', { expression: 'document.body?.innerText ?? ""', returnByValue: true });
        if (text.result.value.includes(label)) throw new Error(`Texto privado apareceu sem perfil: ${label}`);
      }
      if (action === 'payment-state') paymentProvider.state.status = label;
      if (action === 'payment-count' && paymentProvider.state.creates !== label) throw new Error('Checkout externo duplicado.');
      if (action === 'no-card-fields') {
        const result = await client.call('Runtime.evaluate', { expression: `![...document.querySelectorAll('input')].some(el=>/cartão|impresso|CVV/i.test(el.getAttribute('aria-label')??''))`, returnByValue: true });
        if (!result.result.value) throw new Error('Checkout conectado coletou dados de cartão.');
      }
      if (action === 'payment-popup') {
        const before = new Set((await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()).map((p) => p.id));
        const opened = await client.call('Runtime.evaluate', { expression: `(() => {const el=[...document.querySelectorAll('[role="button"]')].find(el=>el.getAttribute('aria-label')==='Abrir Mercado Pago'); el?.click(); return Boolean(el);})()`, returnByValue: true });
        if (!opened.result.value) throw new Error('Botão de abertura ausente.');
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 700));
        const pages = (await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()).filter((p) => p.type === 'page' && !before.has(p.id));
        if (!pages.some((p) => p.url.startsWith('https://www.mercadopago.com.br/'))) throw new Error('Página de pagamento não foi aberta no domínio esperado.');
        for (const p of pages) await fetch(`http://127.0.0.1:${debugPort}/json/close/${p.id}`);
      }
      if (isQaSuite) {
        const inventory = await client.call('Runtime.evaluate', { expression: `JSON.stringify([...document.querySelectorAll('[role="button"], [role="tab"], input, textarea')].map(el => ({kind: el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? 'field' : 'button', label: el.getAttribute('aria-label'), disabled: el.getAttribute('aria-disabled') === 'true', type: el.getAttribute('type')})))`, returnByValue: true });
        for (const control of JSON.parse(inventory.result.value)) controls.set(`${control.kind}:${control.label}`, control);
      }
      if (action === 'slow-api' || action === 'fast-api') await client.call('Network.emulateNetworkConditions', { offline: false, latency: action === 'slow-api' ? 600 : 0, downloadThroughput: -1, uploadThroughput: -1 });
      if (action === 'corrupt-storage') await client.call('Runtime.evaluate', { expression: 'localStorage.setItem("pixelvault.mobile.v1", "{")' });
      if (action === 'clear-test-storage') await client.call('Runtime.evaluate', { expression: 'localStorage.removeItem("pixelvault.mobile.v1")' });
      if (action === 'assert-corrupt-storage') {
        const result = await client.call('Runtime.evaluate', { expression: 'localStorage.getItem("pixelvault.mobile.v1") === "{"', returnByValue: true });
        if (!result.result.value) throw new Error('Dados corrompidos foram apagados silenciosamente.');
      }
      if (action === 'fail-storage') await client.call('Runtime.evaluate', { expression: 'window.__originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new Error("Quota teste"); }' });
      if (action === 'restore-storage') await client.call('Runtime.evaluate', { expression: 'Storage.prototype.setItem = window.__originalSetItem; delete window.__originalSetItem' });
      if (action === 'enter') {
        const focused = await client.call('Runtime.evaluate', { expression: `(() => { const input=[...document.querySelectorAll('input,textarea')].find(el=>el.getAttribute('aria-label')===${JSON.stringify(label)}); input?.focus(); return document.activeElement===input; })()`, returnByValue: true });
        if (!focused.result.value) throw new Error(`Campo sem foco: ${label}`);
        await client.call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
        await client.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      }
      if (['password-type', 'disabled', 'product-count', 'field-errors', 'absent'].includes(action)) {
        const assertion = await client.call('Runtime.evaluate', { expression: `(() => {
          const action=${JSON.stringify(action)}, label=${JSON.stringify(label)};
          const find=(text)=>[...document.querySelectorAll('[aria-label]')].find(el=>el.getAttribute('aria-label')===text);
          if(action==='password-type') return find(label)?.type==='password';
          if(action==='disabled') return find(label)?.getAttribute('aria-disabled')==='true';
          if(action==='product-count') return [...document.querySelectorAll('[role="button"]')].filter(el=>el.getAttribute('aria-label')?.startsWith('Ver detalhes de ')).length===label;
          if(action==='absent') return ![...document.querySelectorAll('[role="button"]')].some(el=>el.getAttribute('aria-label')===label);
          return label.every(text=>find(text)?.parentElement?.textContent.includes('Erro:'));
        })()`, returnByValue: true });
        if (!assertion.result.value) throw new Error(`Asserção falhou: ${action} ${JSON.stringify(label)}`);
      }
      if (action === 'fail-export') await client.call('Runtime.evaluate', { expression: 'window.__originalBlobUrl = URL.createObjectURL; URL.createObjectURL = () => { throw new Error("Falha de teste"); }' });
      if (action === 'restore-export') await client.call('Runtime.evaluate', { expression: 'URL.createObjectURL = window.__originalBlobUrl; delete window.__originalBlobUrl' });
      if (action === 'export-json') {
        const previous = new Set(await readdir(downloadDirectory));
        const clicked = await client.call('Runtime.evaluate', { expression: `(() => {
          const button = [...document.querySelectorAll('[role="button"]')].find(element => element.getAttribute('aria-label') === 'Exportar dados em JSON');
          button?.click(); button?.click(); return Boolean(button);
        })()`, returnByValue: true });
        if (!clicked.result.value) throw new Error('Botão de exportação ausente.');
        let files = [];
        for (let attempt = 0; attempt < 60; attempt += 1) {
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
          files = (await readdir(downloadDirectory)).filter((file) => !previous.has(file) && file.endsWith('.json'));
          if (files.length) break;
        }
        if (files.length !== 1) throw new Error('Exportação ausente ou duplicada após clique repetido.');
        const content = await readFile(join(downloadDirectory, files[0]), 'utf8');
        const data = JSON.parse(content);
        if (data.formato !== 'pixelvault-dados' || data.versao !== 1 || !data.demonstrativo || data.origem !== 'cache-local'
          || data.catalogo.length !== label.catalogo || data.carrinho.length !== label.carrinho || data.biblioteca.length !== label.biblioteca
          || (label.totalPedido !== undefined ? data.pedido?.totalCentavos !== label.totalPedido : data.pedido !== null)
          || (label.pendentes !== undefined && data.sincronizacao.alteracoesPendentes !== label.pendentes)
          || data.catalogo.some((product) => !Number.isSafeInteger(product.precoCentavos))) throw new Error('Conteúdo JSON exportado incorreto.');
        if (/password|cardNumber|printedName|activationKey|demo123|demo456|0000 DEMO|Pessoa Fictícia|actorId|"token"/u.test(content)) throw new Error('Exportação incluiu dado proibido.');
        downloadedFiles.push({ name: files[0], bytes: Buffer.byteLength(content), catalogo: data.catalogo.length, carrinho: data.carrinho.length, biblioteca: data.biblioteca.length, pendentes: data.sincronizacao.alteracoesPendentes });
      }
      if (action === 'api-offline' || action === 'api-online') {
        await client.call('Network.setBlockedURLs', { urls: action === 'api-offline' ? [`${apiBaseUrl}/*`] : [] });
      }
      if (action === 'server-expect' || action === 'server-edit' || action === 'server-fields') {
        const body = await (await fetch(`${apiBaseUrl}/api/products`)).json();
        const found = body.products.find((item) => item.name === label);
        if (action === 'server-fields' && (!found || found.type !== value.type || found.priceCents !== value.priceCents || found.description !== value.description || found.activationStore.name !== value.store || JSON.stringify(found.cloudPlatforms.map((platform) => platform.name)) !== JSON.stringify(value.platforms))) throw new Error('Campos do formulário divergiram no servidor.');
        if (action === 'server-expect' && Boolean(found) !== value) throw new Error(`Estado do servidor incorreto: ${label}`);
        if (action === 'server-edit') {
          if (!found) throw new Error(`Produto remoto ausente: ${label}`);
          const session = await (await fetch(`${apiBaseUrl}/api/sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@pixelvault.example', password: 'demo123' }) })).json();
          const response = await fetch(`${apiBaseUrl}/api/products/${found.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ operationId: `evidence-${Date.now()}`, baseRevision: found.revision,
            product: { id: found.id, name: value, type: found.type, priceCents: found.priceCents, description: found.description, activationStore: found.activationStore.name, cloudPlatforms: found.cloudPlatforms.map((platform) => platform.name) } }) });
          if (!response.ok) throw new Error('Falha ao simular edição em outro dispositivo.');
        }
      }
      if (action === 'reload') {
        await client.call('Page.reload');
        let ready = false;
        for (let attempt = 0; attempt < 50; attempt += 1) {
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
          const state = await client.call('Runtime.evaluate', { expression: expectationExpression(label), returnByValue: true });
          if (state.result.value) { ready = true; break; }
        }
        if (!ready) throw new Error(`Reabertura não alcançou ${label}`);
      }
      if (action === 'safe-storage') {
        const stored = await client.call('Runtime.evaluate', { expression: 'localStorage.getItem("pixelvault.mobile.v1")', returnByValue: true });
        if (!stored.result.value || /cardNumber|printedName|password|demo123|0000 DEMO|Pessoa Fictícia/u.test(stored.result.value)) throw new Error('Armazenamento contém dados sensíveis ou não foi criado.');
      }
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
      if ((action === 'click' || action === 'click-disabled') && isQaSuite) {
        const point = await client.call('Runtime.evaluate', { expression: `(() => { const el=[...document.querySelectorAll('[role="button"],[role="tab"]')].find(el=>el.getAttribute('aria-label')===${JSON.stringify(label)}); if(!el)return null; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`, returnByValue: true });
        if (!point.result.value) throw new Error(`Botão ausente: ${label}`);
        await client.call('Input.dispatchMouseEvent', { type: 'mousePressed', ...point.result.value, button: 'left', clickCount: 1 });
        await client.call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point.result.value, button: 'left', clickCount: 1 });
      } else if (action === 'click') {
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
        let found = false;
        for (let attempt = 0; attempt < 60; attempt += 1) {
          const observed = await client.call('Runtime.evaluate', { expression: expectationExpression(label), returnByValue: true });
          if (observed.result.value) { found = true; break; }
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
        }
        if (!found) throw new Error(`Texto esperado não encontrado: ${label}`);
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
        expression: `([...document.querySelectorAll('input, textarea, [role="alert"], [role="heading"]')]
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
          expression: expectationExpression(options.expectedAfterClick),
          returnByValue: true,
        });
        if (body.result.value) break;
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
        if (attempt === 19) throw new Error(`Navegação não alcançou ${options.expectedAfterClick}`);
      }
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
        focusedBorderColor: document.activeElement ? getComputedStyle(document.activeElement).borderTopColor : null,
        focusedBorderWidth: document.activeElement ? getComputedStyle(document.activeElement).borderTopWidth : null,
        interfaceMarkers: /\\b(?:WF|ST)-\\d{2}\\b/.test(document.body.innerText + [...document.querySelectorAll('[aria-label],[placeholder]')].map(e=>(e.getAttribute('aria-label')??'')+(e.getAttribute('placeholder')??'')).join(' ')),
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
    if (measured.interfaceMarkers) throw new Error(`Marcador documental apareceu na interface: ${name}`);
    if ((options.focusField || options.focusFirstField || options.focusInteractiveLabel) && (measured.focusedBorderWidth !== '3px' || measured.focusedBorderColor !== 'rgb(90, 67, 16)')) throw new Error(`Foco não recebeu o contorno ouro acessível: ${name}`);
    if (measured.scrollWidth > measured.innerWidth + 1) throw new Error(`Overflow horizontal em ${name}: ${measured.scrollWidth} > ${measured.innerWidth}`);
    await writeFile(resolve(outputDirectory, `${name}.png`), Buffer.from(screenshot.data, 'base64'));
    return { name, route, width, height, options, ...measured, ...(interactionChecks.length ? {interactionChecks} : {}), ...(isCatalogSuite ? {catalogChecks, catalogSnapshot} : {}), ...(isQaSuite ? { controls: [...controls.values()] } : {}), ...(downloadedFiles.length ? { downloadedFiles } : {}) };
  } catch (error) {
    if (isQaSuite) {
      const screenshot = await client.call('Page.captureScreenshot', { format: 'png' });
      await writeFile(resolve(outputDirectory, `${name}-failed.png`), Buffer.from(screenshot.data, 'base64'));
    }
    throw error;
  } finally {
    if (isPaymentSuite) paymentProvider.state.release?.();
    client.close();
    await fetch(`http://127.0.0.1:${debugPort}/json/close/${target.id}`);
  }
}

await mkdir(outputDirectory, { recursive: true });
let fixtureDirectory;
let apiApplication;
let apiDatabasePath;
if (isSyncSuite) {
  fixtureDirectory = await mkdtemp(join(tmpdir(), 'pixelvault-sync-evidence-'));
  const databasePath = join(fixtureDirectory, 'server.sqlite');
  apiDatabasePath = databasePath;
  initializeDatabase(databasePath);
  apiApplication = createApplication({ databasePath, logger: {}, ...(isPaymentSuite ? { paymentMode: 'mercadopago', checkoutGateway: paymentProvider.gateway } : {}) });
  if (!isCatalogSuite) trimLegacyFixture(apiApplication);
  await apiApplication.listen({ port: 3107 });
}
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
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${resolve('.expo/chrome-evidence')}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

try {
  await waitForDebugger();
  const results = [];
  const failures = [];
  for (const definition of selectedCaptures) {
    try { results.push(await capture(...definition)); }
    catch (error) { if (!isQaSuite) throw error; failures.push({ name: definition[0], error: error.message }); }
  }
  await writeFile(
    resolve(outputDirectory, 'capture-results.json'),
    `${JSON.stringify({ capturedAt: new Date().toISOString(), runtime: 'Expo Web + Chrome headless CDP', catalogFixture: isCatalogSuite ? 'expanded-default-32' : 'original-two-items', results, failures }, null, 2)}\n`,
  );
  if (failures.length) { process.exitCode = 1; console.error(JSON.stringify(failures)); }
} finally {
  chrome.kill();
  server.close();
  await apiApplication?.close();
  if (fixtureDirectory) await rm(fixtureDirectory, { recursive: true, force: true });
}
