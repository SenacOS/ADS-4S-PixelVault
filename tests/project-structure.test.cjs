const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');

const projectRoot = resolve(__dirname, '..');

function readProjectFile(path) {
  return readFileSync(resolve(projectRoot, path), 'utf8');
}

function relativeLuminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function token(source, name) {
  const match = source.match(new RegExp(`${name}: '(#[a-f\\d]{6})'`, 'i'));
  assert.ok(match, `token ${name} deve existir`);
  return match[1];
}

test('mantém a entrada Expo e aplica área segura dinâmica na raiz', () => {
  const packageJson = JSON.parse(readProjectFile('package.json'));
  const appSource = readProjectFile('App.js');
  const indexSource = readProjectFile('index.js');

  assert.equal(packageJson.main, 'index.js');
  assert.match(indexSource, /registerRootComponent\(App\)/);
  assert.match(appSource, /SafeAreaProvider/);
  assert.match(appSource, /StatusBar style="dark"/);
  assert.match(appSource, /src\/screens\/PixelVaultApp/);
  assert.equal(packageJson.dependencies['react-native-safe-area-context'], '~5.6.0');
});

test('expõe todo o inventário WF-01 a WF-11 e ST-01 a ST-05', () => {
  const routeSource = readProjectFile('src/data/demoRoutes.js');
  const source = [
    readProjectFile('src/screens/AccessScreens.js'),
    readProjectFile('src/screens/StorefrontScreens.js'),
    readProjectFile('src/screens/AdminScreens.js'),
  ].join('\n');

  for (let index = 1; index <= 11; index += 1) {
    const id = `WF-${String(index).padStart(2, '0')}`;
    assert.match(source, new RegExp(id), `${id} deve estar renderizado`);
  }

  for (let index = 1; index <= 5; index += 1) {
    const id = `ST-${String(index).padStart(2, '0')}`;
    assert.match(source, new RegExp(id), `${id} deve estar renderizado`);
    assert.match(routeSource, new RegExp(`st0${index}`));
  }
});

test('centraliza os dois produtos e preserva quantidade e total', () => {
  const dataSource = readProjectFile('src/data/pixelVaultData.js');

  for (const expected of [
    'Orbit Raiders',
    'R$ 79,90',
    'Neon Expansion',
    'R$ 24,90',
    'quantity: 2',
    'R$ 104,80',
  ]) {
    assert.ok(dataSource.includes(expected), `dados devem conter ${expected}`);
  }

  const productSection = dataSource.split('export const CART_SUMMARY')[0];
  assert.equal((productSection.match(/name: '/g) || []).length, 2);
  assert.match(dataSource, /activationStore/);
  assert.match(dataSource, /compatibleWith/);
});

test('mantém a ordem textual da navegação do jogador', () => {
  const dataSource = readProjectFile('src/data/pixelVaultData.js');
  const catalog = dataSource.indexOf("label: 'Catálogo'");
  const cart = dataSource.indexOf("label: 'Carrinho'");
  const library = dataSource.indexOf("label: 'Biblioteca'");

  assert.ok(catalog >= 0 && catalog < cart && cart < library);
});

test('mantém textos críticos e feedbacks distintos aprovados', () => {
  const dataSource = readProjectFile('src/data/pixelVaultData.js');
  const screenSource = readProjectFile('src/screens/StorefrontScreens.js');

  for (const expected of [
    'Pagamento simulado — nenhuma cobrança será realizada',
    'Cadastro concluído. Entre com as credenciais de demonstração.',
    'Item adicionado ao carrinho.',
    'Este item já está no carrinho.',
    'Item cadastrado na lista local.',
    'Alterações salvas na lista local.',
    'Item excluído da lista local.',
  ]) {
    assert.ok(dataSource.includes(expected), `texto aprovado ausente: ${expected}`);
  }

  assert.match(screenSource, /Nenhum pedido foi criado/);
});

test('mantém integrações externas em modo simulado e sem segredos', () => {
  const integrationSource = readProjectFile('src/integrations/paymentGateway.js');
  const allSources = [
    integrationSource,
    readProjectFile('src/data/pixelVaultData.js'),
    readProjectFile('src/screens/PixelVaultApp.js'),
  ].join('\n');

  assert.match(integrationSource, /mode: 'simulated'/);
  assert.match(integrationSource, /Sem pagamento real/);
  assert.doesNotMatch(allSources, /access[_-]?token|client[_-]?secret|fetch\(|axios|supabase/i);
});

test('expõe contratos estáticos de acessibilidade e responsividade', () => {
  const buttonSource = readProjectFile('src/components/AppButton.js');
  const fieldSource = readProjectFile('src/components/LabeledField.js');
  const shellSource = readProjectFile('src/components/ScreenShell.js');
  const tokenSource = readProjectFile('src/theme/tokens.js');
  const navigationSource = readProjectFile('src/components/BottomNavigation.js');

  assert.match(buttonSource, /accessibilityRole="button"/);
  assert.match(buttonSource, /accessibilityState=\{\{ disabled \}\}/);
  assert.match(fieldSource, /allowFontScaling/);
  assert.match(shellSource, /KeyboardAvoidingView/);
  assert.match(shellSource, /SafeAreaView/);
  assert.match(shellSource, /ScrollView/);
  assert.match(tokenSource, /secondary: 14/);
  assert.match(tokenSource, /minTouchTarget: 48/);
  assert.match(navigationSource, /Ativo:/);
  assert.match(buttonSource, /onFocus/);
  assert.match(buttonSource, /styles\.focused/);
  assert.match(navigationSource, /onFocus/);
  assert.match(navigationSource, /styles\.focused/);
  assert.match(readProjectFile('src/components/AppText.js'), /accessibilityRole=\{semanticRole\}/);
  assert.match(readProjectFile('src/components/AppText.js'), /variant === 'title' \|\| variant === 'heading'/);
});

test('mantém contrastes mínimos para superfícies, bordas, foco e desabilitado', () => {
  const source = readProjectFile('src/theme/tokens.js');
  const background = token(source, 'background');
  const surface = token(source, 'surface');
  const surfaceRaised = token(source, 'surfaceRaised');
  const border = token(source, 'border');
  const disabled = token(source, 'disabled');
  const focus = token(source, 'focus');
  const text = token(source, 'text');
  const disabledText = token(source, 'disabledText');

  assert.ok(contrastRatio(text, surfaceRaised) >= 4.5, 'texto secondary deve atender WCAG AA');
  assert.ok(contrastRatio(border, background) >= 3, 'borda ghost deve contrastar com o fundo');
  assert.ok(contrastRatio(border, surface) >= 3, 'borda de input/cartão deve contrastar com superfície');
  assert.ok(contrastRatio(disabledText, disabled) >= 4.5, 'label desabilitado deve atender WCAG AA');
  assert.ok(contrastRatio(focus, background) >= 3, 'foco deve contrastar com o fundo');
  assert.ok(contrastRatio(focus, surface) >= 3, 'foco deve contrastar com superfície');
});

test('expõe todos os comandos de qualidade obrigatórios', () => {
  const { scripts } = JSON.parse(readProjectFile('package.json'));

  for (const command of ['lint', 'typecheck', 'test', 'build']) {
    assert.equal(typeof scripts[command], 'string');
    assert.ok(scripts[command].length > 0);
  }
});

test('aplica a paleta clara final aos papéis aprovados', () => {
  const source = readProjectFile('src/theme/tokens.js');
  const expectedTokens = {
    background: '#FFFFFF', surface: '#FAF9F6', surfaceRaised: '#F3F1EA', text: '#171717',
    textMuted: '#4B5563', textSubtle: '#6B7280', border: '#8A8178', accent: '#C49A32',
    accentPressed: '#AE8426', accentDark: '#745713', accentSurface: '#FBF3DC', focus: '#5A4310',
    success: '#166534', successSurface: '#F0FDF4', warning: '#7A4D00', warningSurface: '#FFF8E6',
    danger: '#B42318', dangerSurface: '#FEF3F2', disabled: '#E7E5E4', disabledText: '#57534E',
    disabledBorder: '#78716C', shadow: '#171717',
  };

  for (const [name, value] of Object.entries(expectedTokens)) {
    assert.equal(token(source, name).toUpperCase(), value.toUpperCase(), `${name} deve manter o papel aprovado`);
  }
});

test('valida contrastes das combinações reais da interface clara', () => {
  const source = readProjectFile('src/theme/tokens.js');
  const pairs = [
    ['text', 'background', 4.5], ['text', 'surface', 4.5],
    ['textMuted', 'background', 4.5], ['textMuted', 'surface', 4.5],
    ['textSubtle', 'background', 4.5], ['border', 'background', 3], ['border', 'surface', 3],
    ['text', 'accent', 4.5], ['text', 'accentPressed', 4.5],
    ['accentDark', 'background', 4.5], ['accentDark', 'accentSurface', 4.5],
    ['focus', 'background', 3], ['focus', 'accent', 3],
    ['success', 'successSurface', 4.5], ['warning', 'warningSurface', 4.5],
    ['danger', 'dangerSurface', 4.5], ['background', 'danger', 4.5],
    ['disabledText', 'disabled', 4.5], ['disabledBorder', 'background', 3],
  ];

  for (const [foreground, background, minimum] of pairs) {
    assert.ok(
      contrastRatio(token(source, foreground), token(source, background)) >= minimum,
      `${foreground}/${background} deve atingir ${minimum}:1`,
    );
  }
});

test('usa papéis semânticos e remove destaques azuis e fundos escuros legados', () => {
  const paths = [
    'App.js', 'src/theme/tokens.js', 'src/components/AppText.js', 'src/components/AppButton.js',
    'src/components/LabeledField.js', 'src/components/ProductCard.js', 'src/components/FeedbackBanner.js',
    'src/components/EmptyState.js', 'src/components/BottomNavigation.js', 'src/components/ScreenShell.js',
    'src/screens/AccessScreens.js', 'src/screens/StorefrontScreens.js', 'src/screens/AdminScreens.js',
  ];
  const sources = paths.map(readProjectFile).join('\n');
  const buttonSource = readProjectFile('src/components/AppButton.js');
  const fieldSource = readProjectFile('src/components/LabeledField.js');
  const bannerSource = readProjectFile('src/components/FeedbackBanner.js');
  const navigationSource = readProjectFile('src/components/BottomNavigation.js');

  assert.doesNotMatch(sources, /#70d6ff|#12324a|#123c2c|#4a1f2a/i);
  assert.match(buttonSource, /colors\.accentPressed/);
  assert.match(buttonSource, /colors\.disabledText/);
  assert.match(buttonSource, /colors\.focus/);
  assert.match(fieldSource, /inputFocused/);
  assert.match(fieldSource, /colors\.focus/);
  assert.match(fieldSource, /error && styles\.inputError, focused && styles\.inputFocused/);
  assert.match(bannerSource, /colors\.successSurface/);
  assert.match(bannerSource, /colors\.dangerSurface/);
  assert.match(navigationSource, /colors\.accentSurface/);
  assert.match(navigationSource, /colors\.accentDark/);
});
