# Evidências do Prompt 12

Fluxos executados em 14/09/2026 no aplicativo real exportado pelo Expo Web e operado no Chrome headless via CDP. O comando reproduzível é `npm run evidence:capture:prompt12`; cada cenário inicia uma sessão limpa, preenche campos e aciona botões reais. `capture-results.json` registra ações, asserções, viewport, foco e métricas.

## Matriz UXT

| Caso | Execução e resultado observado | Status | Evidência |
|---|---|---|---|
| UXT-01 | Cadastro vazio manteve WF-02 e associou erro aos três campos. | PASS | `uxt-01-cadastro-invalido-390x844.png` |
| UXT-02 | Dados fictícios válidos criaram conta em memória, retornaram a WF-01 e exibiram FB-01; os campos de login receberam a nova conta. | PASS | `uxt-02-cadastro-valido-390x844.png` |
| UXT-03 | Preenchimento do jogador + submissão abriu WF-03. | PASS | `uxt-03-login-jogador-390x844.png` |
| UXT-04 | Preenchimento administrativo + submissão abriu WF-09. | PASS | `uxt-04-login-admin-390x844.png` |
| UXT-05 | Exclusão de Orbit no admin foi refletida no catálogo; Boosteroid gerou ST-02 e Limpar filtro restaurou Neon. | PASS | `uxt-05-filtro-vazio-390x844.png`; `uxt-05-filtro-limpo-390x844.png` |
| UXT-06 | Segunda adição de Orbit manteve contador 1 e exibiu FB-03. | PASS | `uxt-06-duplicidade-390x844.png` |
| UXT-07 | Remoção do último item gerou ST-03, total zero e checkout indisponível. | PASS | `uxt-07-carrinho-vazio-390x844.png` |
| UXT-08 | Dois itens chegaram ao checkout com quantidade 2 e R$ 104,80. | PASS | `uxt-08-checkout-dois-itens-390x844.png` |
| UXT-09 | Submissão vazia marcou ambos os campos e não criou pedido. | PASS | `uxt-09-checkout-invalido-390x844.png` |
| UXT-10 | Dois campos preenchidos criaram pedido fictício, WF-07 e aviso de não cobrança. | PASS | `uxt-10-checkout-valido-390x844.png` |
| UXT-11 | Biblioteca pós-compra mostrou os dois itens e as duas chaves fictícias, sem duplicidade. | PASS | `uxt-11-biblioteca-pos-compra-390x844.png` |
| UXT-12 | Criação, edição, cancelamento de exclusão e exclusão confirmada atualizaram a mesma lista e emitiram FB-04..06. | PASS | `uxt-12-crud-criado-390x844.png`; `uxt-12-crud-completo-390x844.png` |
| UXT-13 | Login, duplicidade, checkout, erro e admin repetidos em 320×568; 5/5 com `scrollWidth=innerWidth=320`. | PASS | `uxt-13-*.png` |
| UXT-14 | Cadastro em 390×844 e checkout em 360×844, fonte 130% e foco real nos campos, sem overflow. Não havia dispositivo ADB, portanto teclado virtual/leitor de tela nativos não foram executados. | PARTIAL | `uxt-14-*.png` |

## Resultado técnico

- 21/21 capturas geradas; nenhuma apresentou overflow horizontal.
- Viewports: 390×844, 360×844 e 320×568; escala tipográfica web 1,3 nos dois casos UXT-14.
- `npm run lint`, `npm run typecheck`, `npm test` (17/17), `npm run build`, `npx expo install --check` e `npx expo-doctor` (18/18) passaram.
- Metro offline alcançou `Metro waiting` em `exp://192.168.1.5:8099` e encerrou normalmente.
- Primeira inicialização do Chrome dentro do sandbox falhou com `ECONNRESET`; a repetição autorizada fora dele concluiu. O ADB iniciou, mas retornou lista vazia.

