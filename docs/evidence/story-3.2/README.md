# Evidências visuais — Story 3.2

Capturas geradas em 18/09/2026 a partir do aplicativo exportado pelo Expo Web e operado no Chrome headless via CDP. O fluxo reproduzível é `npm run build:web:evidence` seguido de `node scripts/capture-evidence.mjs story-3.2`. O arquivo `capture-results.json` registra viewport, overflow, foco, ações e asserções de cada cenário.

Os códigos `WF/ST` aparecem somente nos nomes dos arquivos e neste inventário documental. Eles não são renderizados nem anunciados dentro do aplicativo.

## Cobertura

- Onze fluxos `WF-01..WF-11`, incluindo as duas variações de formulário do `WF-10`, e cinco estados `ST-01..ST-05`: 17/17 cenários capturados em `390 × 844`.
- Cinco áreas — acesso, catálogo, compra, biblioteca e administração — capturadas em `360 × 844` e `320 × 568`.
- Fonte a `130%`: cadastro em `390 × 844`, com foco real no campo Nome.
- Foco visível: campo do checkout, botão secundário e navegação em `390 × 844`.
- Resultado: 31/31 capturas sem overflow horizontal (`scrollWidth === innerWidth`).
- Login de `player` e `admin`, cadastro, catálogo, carrinho, checkout, resultado, biblioteca e CRUD foram alcançados por interação com campos e controles da UI; nenhum atalho visível por papel ou estado interno injetado foi usado.

## Auditoria de conteúdo

Antes de cada captura, o script reúne `innerText`, `aria-label`, `aria-description`, `placeholder` e `alt` da página. A captura falha se a superfície perceptível contiver:

- marcadores `WF-*` ou `ST-*`;
- linguagem de protótipo, acadêmica, fictícia, demonstrativa ou de simulação;
- referências a perfil/curador, arte pendente, fonte local ou temporalidade de sessão.

As 31 capturas passaram nessa auditoria. Rotas, query string `screen`, nomes de cenários e arquivos continuam usando seus identificadores técnicos para rastreabilidade.

## Inspeção

- As imagens de acesso, checkout, resultado, administração, exclusão, viewport compacto e fonte ampliada foram inspecionadas visualmente.
- Títulos, labels, placeholders, feedbacks e ações usam linguagem funcional e neutra.
- A saída permanece disponível como `Sair`, sem anunciar o papel da conta.
- Pedido, loja e chaves apresentados não usam qualificadores demonstrativos.
- A paleta, a hierarquia, os alvos interativos e os indicadores de foco entregues na Story 3.1 foram preservados.

## Limitações reais

- As capturas validam o build Expo Web no Chrome headless. Não havia emulador ou dispositivo móvel conectado para inspeção visual nativa.
- O foco real dos campos e controles foi exercitado, mas o Chrome headless não apresenta teclado virtual; o reposicionamento com teclado nativo permanece para verificação manual.
- Não foi executado leitor de tela nativo. A auditoria cobriu o texto e os atributos acessíveis expostos no DOM do build web, além dos contratos estáticos existentes.
