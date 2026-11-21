# QA completa antes do Mercado Pago — Story 3.4

**Data:** 20/11/2026. Escopo: funcionalidades atuais, botões, campos, negativos, teclado e integração app/API. Pagamento externo não implementado nesta rodada. A matriz abaixo agrupa botões com rótulos dinâmicos pelo mesmo callback (ex.: editar/remover diferentes produtos); não afirma testar todas as combinações possíveis.

**Gate final:** CONCERNS, 90/100; Story 3.4 Done. Única ressalva TEST-001: execução em aparelho/emulador. Parecer em `docs/qa/gates/3.4-regressao-completa-pre-pagamento.yml`.

## Linha de base e correções

| Achado | Evidência anterior | Correção |
| --- | --- | --- |
| Cadastro confirmava e-mail repetido e não normalizava espaços/maiúsculas | `qa-full-local/cadastro-duplicado-failed.png` e JSON da execução | E-mail normalizado, duplicidade rejeitada, senha continua exata. |
| Subcentavos e limites divergentes podiam ser salvos antes da rejeição/silêncio na API | `qa-full-local/admin-campos-tipos-precos-failed.png`; `tmp/auditoria/qa-full-before-fixes.log` | Validação local alinhada ao contrato existente; cliente REST recusa valores inválidos de cache/fila antigos sem arredondar silenciosamente. |
| Textarea permitia descrição multilinha que a API recusava | Teste HTTP real falhou na linha de base (`qa-full-before-fixes.log`) | Descrição admite LF/CR/tab; controles inválidos, inclusive NUL, continuam rejeitados. |
| Conta efêmera recém-criada não era reconhecida no login online | Divergência constatada em revisão de fluxo; cobertura E2E online acrescentada | Entrada explicitamente local apenas para `registered-*`/player da sessão, com senha exata; sem credencial ou permissão de servidor. |
| Texto administrativo dizia que dados duravam só a sessão | Inspeção do formulário | Texto ajustado à persistência e sincronização já existentes. |

A linha de base teve 38/40 jornadas locais aprovadas e duas falhas de UI. Os 63 testes anteriores passavam; dois testes novos reproduziram falhas adicionais de contrato antes das correções. A rodada final está em pastas separadas, preservando os registros anteriores.

## Matriz de controles e campos

| Área | Botões/estados e campos verificados | Casos de referência |
| --- | --- | --- |
| Acesso | Entrar, preencher jogador/admin, abrir/voltar cadastro, cadastrar, sair; e-mail/senha/nome, obrigatórios/espaços, senha mascarada/exata, Enter, duplicidade e normalização | `login-campos-teclado`, `cadastro-espacos-voltar`, `cadastro-duplicado`, `cadastro-email-normalizado`, `api-cadastro-local-explicito` |
| Catálogo | Filtros e filtros já selecionados, limpar filtro, detalhes dos dois itens, atualizar API, exportar; estados vazio/normal | UXT-05, `filtros-selecionados-idempotentes`, `api-jogador-atualiza-catalogo` |
| Detalhes/carrinho | Adicionar, já adicionado, ver carrinho zero/um/dois, voltar, remover cada produto, checkout habilitado/desabilitado, explorar catálogo, navegação inferior | UXT-06/07/08, `detalhes-carrinho-zero`, `remocao-cada-produto`, `navegacao-desabilitado` |
| Checkout/biblioteca | Dois campos fictícios, vazios/parciais, Enter, confirmar simulação, voltar ao carrinho/catálogo, abrir biblioteca e estado vazio | UXT-09/10/11, `checkout-campos-voltar-teclado` |
| Administração | Novo/editar/salvar/cancelar, excluir/confirmar/cancelar, Jogo/DLC e seleções ativas, duas plataformas e desmarcação, nome/preço/descrição/loja | UXT-12, `admin-campos-tipos-precos`, `admin-cancelamentos` |
| Contrato dos campos | Preço textual/zero/negativo/subcentavo/limite, nomes/loja até 200 e descrição até 2000, descrição multilinha real no servidor | `admin-limites-contrato`, `api-campos-multilinha-ocupado`, testes de domínio/HTTP |
| Sincronização | Login backend, CRUD real, fila/reload, offline/retomada, conflito, recarregar/cancelar/confirmar, botão ocupado/desabilitado sob latência | `crud-servidor`, `retomada-offline`, `conflito-resolvido`, `admin-sincronizacao-sem-api`, `api-campos-multilinha-ocupado` |
| Armazenamento | Falha de leitura preserva dados; tentar abrir novamente; falha de escrita não confirma alteração; recuperação | `armazenamento-leitura-retentativa`, `armazenamento-escrita-retentativa`, `cart-restored`, `library-restored` |
| JSON | Exportar catálogo/admin/conta/vazio, clique repetido, arquivo real, isolamento, erro/retentativa e pendência offline | `export-*`, `user-isolation` |
| Layout e teclado | 320/360/390 px, fonte 130%, foco e acionamento real de Enter/eventos de mouse via CDP | UXT-13/14 e casos ampliados |

O inventário `controls` em cada resultado registra rótulo/tipo/estado observado, sem valores de campos. A execução é comprovada por `options.actions` e suas asserções, não pelo simples fato de um controle ter sido observado. São 9 rótulos textuais distintos em 11 posições de formulário (login, cadastro, produto e checkout).

## Reprodução

```powershell
npm run lint
npm run typecheck
npm test
$env:EXPO_PUBLIC_API_URL = 'http://127.0.0.1:3107'
npx expo export --platform web --clear --output-dir tmp/auditoria/dist-web-sync
Remove-Item Env:EXPO_PUBLIC_API_URL
npm run build:web:evidence -- --clear
npm run build -- --clear
node scripts/capture-evidence.mjs qa-full-local-final
node scripts/capture-evidence.mjs qa-full-api-final
```

O executor isola armazenamento entre casos, inicia banco/API temporários somente na suíte online e encerra os processos próprios. Cliques normais usam eventos de mouse por coordenadas via CDP; submits por Enter são eventos de teclado. Os JSONs são baixados e lidos do disco. A falha de um cenário QA é registrada com screenshot, os demais continuam e o processo retorna falha se houver caso reprovado.

Resultados finais: `docs/evidence/qa-full-local-final/capture-results.json` e `docs/evidence/qa-full-api-final/capture-results.json`. Logs: `tmp/auditoria/qa-full-{tests,build,web,web-api}.log`. Achados corrigidos são cobertos por testes permanentes de domínio e HTTP.

## Resultado final

| Verificação | Resultado |
| --- | --- |
| `npm run lint` / `npm run typecheck` | PASS, exit 0. |
| `npm test` | 68/68 PASS, incluindo regressões das correções. |
| Exports web local / web API / Android | PASS; Android 632 módulos. |
| Jornadas locais | 45/45 PASS. |
| Jornadas API real | 6/6 PASS, incluindo campos multilinha, botão ocupado e cadastro local explícito. |
| Downloads JSON reais | 6 arquivos conferidos. |
| Botões | 49 modelos observados, todos com ação no conjunto; normalização agrupa nomes de produtos e contador do carrinho. |
| Campos | 9 rótulos distintos / 11 posições nos quatro formulários. |
| Overflow horizontal | Zero nos 51 cenários. |
| `adb devices` | Lista vazia; execução nativa pendente. |

Resumo consolidado: `coverage-summary.json`. Os estados são observados e acionados via CDP no navegador; isso não representa teste de hardware nem todas as combinações possíveis. Nenhum código do Mercado Pago foi implementado nesta rodada.

## Limites antes do pagamento

- Cadastro novo continua local/efêmero, não cadastra usuário no backend. O modo local não cria sessão de servidor; conta seed inválida e HTTP 401 nunca usam esse caminho como fallback. Sessão persistente de HU-12 permanece separada.
- Checkout e biblioteca continuam demonstrativos; o Mercado Pago externo ainda retorna indisponível. Não houve chamada financeira, criação de aplicativo no provedor ou uso de credenciais reais.
- Preços inválidos de cache/fila antigos permanecem preservados e são recusados antes do envio; precisam de revisão explícita, sem conversão destrutiva automática.
- ADB sem aparelho/emulador. Teclado/leitor de tela nativos, driver SQLite e compartilhamento real não foram executados. Testes web e build não comprovam esses passos.
- A aprovação se aplica aos cenários e requisitos atuais; não é garantia de ausência de todo defeito nem de prontidão para pagamentos reais.
