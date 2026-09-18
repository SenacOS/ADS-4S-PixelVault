# Evidências visuais — Story 3.1

Capturas geradas em 18/09/2026 no aplicativo real exportado pelo Expo Web e operado no Chrome headless via CDP. O fluxo reproduzível é `npm run build:web:evidence` seguido de `node scripts/capture-evidence.mjs story-3.1`. O arquivo `capture-results.json` registra viewport, overflow, foco, ações e asserções de cada cenário.

## Cobertura

- `WF-01..WF-11` e `ST-01..ST-05`: 17/17 capturados em `390 × 844`.
- Cinco áreas (acesso, catálogo, compra, biblioteca e administração): 5/5 em `360 × 844` e 5/5 em `320 × 568`.
- Fonte a `130%`: cadastro em `390 × 844`, com foco real no campo Nome.
- Foco visível: campo de checkout, botão secundário e aba de navegação em `390 × 844`.
- Resultado objetivo: 31/31 capturas sem overflow horizontal (`scrollWidth === innerWidth`) e sem perda das ações por rolagem vertical.
- Carrinho, checkout, resultado e biblioteca preenchidos foram alcançados por interações reais de login, seleção de produtos e checkout simulado; não foi injetado estado interno.

## Paleta final e contraste

Não houve ajuste em relação ao handoff UX. A base permanece branca, o conteúdo preto/cinza muito escuro e o destaque ouro fosco. O ouro claro é reservado a preenchimentos; ouro textual, indicadores e bordas destacadas usam `accentDark`.

| Combinação efetivamente usada | Razão |
|---|---:|
| `text` / `background` | `17,93:1` |
| `text` / `surface` | `17,03:1` |
| `textMuted` / `background` | `7,56:1` |
| `textMuted` / `surface` | `7,18:1` |
| `textSubtle` / `background` | `4,83:1` |
| `border` / `background` | `3,82:1` |
| `border` / `surface` | `3,63:1` |
| `text` / `accent` | `6,84:1` |
| `text` / `accentPressed` | `5,23:1` |
| `accentDark` / `background` | `6,74:1` |
| `accentDark` / `accentSurface` | `6,08:1` |
| `focus` / `background` | `9,35:1` |
| `focus` / `accent` | `3,57:1` |
| `success` / `successSurface` | `6,81:1` |
| `warning` / `warningSurface` | `6,86:1` |
| `danger` / `dangerSurface` | `6,05:1` |
| `background` / `danger` | `6,57:1` |
| `disabledText` / `disabled` | `6,08:1` |
| `disabledBorder` / `background` | `4,80:1` |

As razões são recalculadas automaticamente por `tests/project-structure.test.cjs`, que também verifica o vínculo dos tokens com botões, campos, banners e navegação, além da ausência das cores legadas `#70d6ff`, `#12324a`, `#123c2c` e `#4a1f2a` na interface ativa.

## Decisões e diferenças observadas

- `assets/icon.png` foi inspecionado e confirmado como placeholder cinza-claro. O ativo foi preservado porque a story não autoriza redesenho; sua apresentação recebeu `accentSurface`, borda funcional e moldura `accentDark` para manter legibilidade.
- O resumo do pedido, a seleção da navegação e o painel de marca deixaram de usar superfícies escuras extensas.
- Feedbacks usam pares semânticos claros; botões primários usam ouro com texto escuro; perigo mantém fundo vermelho com texto branco.
- Foco usa contorno de `3 dp`; os alvos interativos continuam com mínimo preferencial de `48 dp`.
- Cartões e navegação usam sombra preta a `8%`, limitada a elevação `2`, sempre acompanhada por borda.

## Limitações reais

- As capturas validam o comportamento responsivo do build Expo Web em Chrome headless. Não havia sessão de emulador/dispositivo móvel conectada para repetir a inspeção visual nativa.
- O foco real dos campos foi exercitado, assim como o `KeyboardAvoidingView` e os contratos estáticos. Chrome headless não exibe teclado virtual; portanto a abertura e o reposicionamento com teclado nativo permanecem para inspeção manual em dispositivo/emulador.
- Não foi executado leitor de tela nativo. Rótulos, roles, estados, regiões vivas e texto complementar foram preservados e cobertos estaticamente.

