# Evidências do Prompt 11

Capturas reais do aplicativo PixelVault exportado pelo Expo Web e renderizado no Chrome headless por Chrome DevTools Protocol. O lote foi gerado em 14/09/2026 pelo comando `npm run evidence:capture`. O arquivo `capture-results.json` registra data UTC, rota, viewport real, dimensões internas, overflow, campo focado e trecho de texto validado antes de cada PNG ser aceita.

## Como reproduzir

```powershell
npm ci
npm run evidence:capture
```

O script primeiro executa `expo export --platform web --output-dir dist-web`, serve o export apenas em `127.0.0.1:8097`, abre um único Chrome headless via CDP e encerra os processos ao final. O Chrome precisa existir em `C:\Program Files\Google\Chrome\Application\chrome.exe`. A query `?screen=` é um seletor local de evidência web; sem ela, o aplicativo inicia normalmente em `WF-01`.

## Matriz WF/ST

| ID | Arquivo principal | Viewport | Resultado registrado |
|---|---|---:|---|
| WF-01 | `wf-01-login-390x844.png` | 390 × 844 | Login e entradas jogador/admin renderizados. |
| WF-02 | `wf-02-cadastro-390x844.png` | 390 × 844 | Cadastro e confirmação visual renderizados. |
| WF-03 | `wf-03-catalogo-390x844.png` | 390 × 844 | Filtros, contador e catálogo renderizados. |
| WF-04 | `wf-04-detalhes-390x844.png` | 390 × 844 | Compatibilidade e ativação separadas. |
| WF-05 | `wf-05-carrinho-390x844.png` | 390 × 844 | Dois itens e navegação renderizados. |
| WF-06 | `wf-06-checkout-390x844.png` | 390 × 844 | Resumo, campos e aviso de simulação renderizados. |
| WF-07 | `wf-07-resultado-390x844.png` | 390 × 844 | Pedido fictício, quantidade, total e não cobrança. |
| WF-08 | `wf-08-biblioteca-390x844.png` | 390 × 844 | Dois itens, ativação e chaves fictícias. |
| WF-09 | `wf-09-admin-390x844.png` | 390 × 844 | Perfil, lista local e ações administrativas. |
| WF-10 | `wf-10-novo-item-390x844.png`; `wf-10-editar-item-390x844.png` | 390 × 844 | Modos novo/editar e ações textualmente distintos. |
| WF-11 | `wf-11-exclusao-390x844.png` | 390 × 844 | Confirmação nominal, cancelar e excluir. |
| ST-01 | `st-01-login-erro-390x844.png` | 390 × 844 | Erro textual junto ao campo com valores preservados. |
| ST-02 | `st-02-catalogo-vazio-390x844.png` | 390 × 844 | Filtro ativo e ação `Limpar filtro`. |
| ST-03 | `st-03-carrinho-vazio-390x844.png` | 390 × 844 | Quantidade/total zero e checkout indisponível. |
| ST-04 | `st-04-biblioteca-vazia-390x844.png` | 390 × 844 | Estado vazio e ação `Ir ao catálogo`. |
| ST-05 | `st-05-checkout-erro-390x844.png` | 390 × 844 | Resumo preservado e erro junto ao campo. |

## Responsividade e acessibilidade

As capturas adicionais `wf-03-catalogo-360x844.png`, `wf-03-catalogo-320x568.png`, `wf-05-carrinho-320x568.png` e `wf-09-admin-320x568.png` cobrem descoberta, compra e administração em 360 px e no mínimo 320 × 568. O CDP confirmou `innerWidth === scrollWidth` e nenhum elemento com `scrollWidth > clientWidth` nas 27 execuções.

`uxt-03-jogador-abre-catalogo-390x844.png` e `uxt-04-admin-abre-manutencao-390x844.png` foram geradas após clique real nos dois botões do login. O script bloqueia se os destinos `WF-03` e `WF-09`, respectivamente, não aparecerem após a ação.

`wf-02-cadastro-fonte-130-390x844.png` aplica `fontScale=1.3` apenas aos textos/inputs no runtime web de evidência; não é zoom de página. A captura confirma quebra textual e acesso às duas ações sem sobreposição. No runtime nativo, `Text`/`TextInput` mantêm `allowFontScaling`, multiplicador máximo 2 e contêineres sem altura fixa.

`wf-06-checkout-campo-focado-390x844.png` confirma foco real no campo `Número do cartão fictício`, rolagem até o formulário e ações alcançáveis. O Chrome headless não abre teclado virtual móvel; portanto, esta evidência **não** é declarada como teste de teclado aberto. A composição usa `KeyboardAvoidingView`, `automaticallyAdjustKeyboardInsets` e `keyboardShouldPersistTaps`, mas a repetição com teclado nativo aberto permanece pendente para estação com Expo Go/emulador.

## Correções pós-auditoria UX

O lote completo foi regenerado após a auditoria. `st-03-carrinho-vazio-390x844.png` preserva agora margem superior clara antes do eyebrow. `ux-foco-botao-secundario-wf01-390x844.png` e `ux-foco-navegacao-wf03-390x844.png` comprovam foco real no Chrome e anel amarelo textual/visual sobre botão e aba; `capture-results.json` registra os respectivos elementos focados.

Contrastes calculados pela fórmula WCAG e protegidos por teste automatizado:

| Uso | Cores | Razão | Meta |
|---|---|---:|---:|
| Label de botão secundário | `#ffffff` / `#22304d` | 13,14:1 | ≥ 4,5:1 |
| Borda contra fundo | `#7086ad` / `#0b1020` | 5,14:1 | ≥ 3:1 |
| Borda contra superfície/input | `#7086ad` / `#18233a` | 4,25:1 | ≥ 3:1 |
| Label desabilitado | `#ffffff` / `#68748b` | 4,71:1 | ≥ 4,5:1 |
| Foco contra fundo | `#ffd166` / `#0b1020` | 13,13:1 | ≥ 3:1 |
| Foco contra superfície | `#ffd166` / `#18233a` | 10,87:1 | ≥ 3:1 |

Além do contraste, variantes `title` e `heading` de `AppText` assumem `accessibilityRole="header"` por padrão e continuam aceitando override explícito.

## Diferenças entre wireframe e implementação

| Tela | Diferença | Motivo | Impacto | Aprovação/pendência |
|---|---|---|---|---|
| Todas | Cores da Story 1.1 e fonte do sistema, sem identidade final. | A08 não aprova paleta, tipografia ou marca finais. | Identidade coerente, porém provisória. | Permitido pela Story 1.2; revisão visual futura pendente. |
| WF-01/WF-02 | Não há credenciais exatas; existem atalhos locais por perfil. | Os artefatos não aprovam e-mail/senha. | Permite UXT-03/04 sem simular autenticação. | Aprovado para Prompt 11; validação pertence ao Prompt 12. |
| WF-03 a WF-10 | Capas são blocos neutros com iniciais e texto `CAPA ILUSTRATIVA`. | Não existem capas aprovadas em `assets/`; nenhuma imagem externa foi baixada. | Mantém estrutura e acessibilidade sem atribuição indevida. | Ativo final pendente de aprovação do grupo. |
| WF-04/WF-08/WF-10 | Loja de ativação é marcador explicitamente fictício. | O valor exato não foi aprovado. | Conceitos cloud/ativação continuam separados. | Conteúdo final pendente. |
| WF-07/WF-08 | Pedido e chaves usam marcadores explicitamente fictícios. | Identificadores exatos não foram aprovados e não há backend. | Jornada visual é contínua sem alegar dado real. | Aprovado para demonstração local. |
| WF-03/WF-04/WF-09/WF-11 | Feedbacks visuais podem aparecer simultaneamente para inspeção. | Prompt 11 exige estados alcançáveis, não mutações completas. | Facilita evidência; não representa histórico real de ações. | Comportamento completo pendente do Prompt 12. |
| Todas (web) | `?screen=` seleciona WF/ST diretamente. | Captura reproduzível de cada estado sem automatizador de gestos. | Não altera a rota inicial nem adiciona roteador. | Recurso local de evidência; não é navegação de produto. |
| Formulários | Não há captura com teclado virtual aberto. | Sem dispositivo ADB; Chrome headless não apresenta teclado móvel. | Ajustes de teclado estão implementados, mas falta confirmação nativa. | Pendente em dispositivo/emulador real. |

## Problemas reais encontrados

- A primeira instalação restrita falhou com `TypeError: fetch failed`; a repetição com acesso autorizado concluiu.
- O primeiro lote dependia do Metro e perdeu a conexão após WF-03. As PNGs inválidas foram rejeitadas e substituídas; o script passou a usar export estático e validação de marcador WF/ST antes de gravar.
- A primeira tentativa de 130% usou escala de página do CDP, que não equivale a fonte ampliada. A captura foi descartada e substituída por escala tipográfica 1,3× controlada no aplicativo web.
- `adb devices -l` não encontrou dispositivo conectado. Inspeção nativa com teclado aberto segue registrada como limitação, sem resultado presumido.
