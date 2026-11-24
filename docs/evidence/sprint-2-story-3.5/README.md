# Story 3.5 — evidências do Checkout Pro de teste

**Data local inicial:** 20/11/2026; **atualização:** 21/11/2026 (America/Sao_Paulo). Horários ISO dos resultados estão em UTC. **Status:** Done; QA CONCERNS, 90/100. Validação local e aprovação externa de teste comprovadas; única ressalva é a execução nativa pendente.

## Resultados executados

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | PASS, sem erros/avisos. |
| `npm run typecheck` | PASS. |
| `npm test` | PASS, 82/82; incluindo 14 testes novos de checkout/cliente e regressão de isolamento. |
| `npm run build -- --clear` | PASS, Android, 633 módulos. |
| Export web com e sem API, usando `--clear` | PASS. |
| `node scripts/capture-evidence.mjs qa-full-payment` | PASS, 10/10 jornadas, zero overflow horizontal. |
| Regressão local/API anterior | PASS, 45/45 locais e 6/6 API. Total final:61 jornadas web. |
| Credencial real de teste, `/users/me` | HTTP200, seller3860552857, MLB, tag test_user. Token omitido. |
| `npm run checkout:smoke` | Preferência real criada e consulta PENDENTE; nenhum pagamento enviado pelo script. |
| `npm run checkout:smoke -- --recover` | Mesmo pedido recuperado por busca/GET na API oficial após simulação de perda do registro local da preferência. |
| Compra hospedada aprovada de teste | PASS em 21/11/2026: usuário concluiu; gateway real confirmou APROVADO, comprador/metadados/valor e biblioteca. |
| Restauração da aquisição real no app web | PASS: sem mock; reinício da API, reload do app, reautenticação e atualização da biblioteca. |
| Dispositivo Android/iOS | NOT RUN; bundle não comprova navegador/SQLite/teclado em dispositivo. |
| CodeRabbit | NOT RUN, desabilitado no escopo da story; revisão especializada @qa executada. |

Logs locais ignorados pelo Git: `tmp/auditoria/checkout-all-tests.log`, `checkout-build-android.log`, `checkout-web-api.log`, `checkout-web-local.log`, `checkout-e2e.log`, `checkout-e2e-local.log` e `checkout-e2e-api.log`.

## Matriz do novo fluxo web

Todos os cenários utilizam API HTTP e SQLite reais do PixelVault em banco temporário isolado por cenário, e **adaptador Mercado Pago simulado**, identificado em `scripts/checkout-evidence-provider.mjs`. A aprovação nesses cenários não representa aprovação externa pelo Mercado Pago.

| Cenário | Evidência/asserções |
| --- | --- |
| `checkout-pendente` | Resumo/totais servidor; ausência de campos de cartão; replay com uma criação externa; botão abre aba no domínio oficial; consulta pendente e armazenamento permitido. |
| `checkout-aprovado-restaurado` | Aprovação do adaptador, resultado, biblioteca, consulta repetida, reload/login e exportação JSON real. |
| `checkout-recusado-cancelado` | Feedbacks distintos e ausência de nova aquisição. |
| `checkout-offline-retomada` | Referência salva antes da rede e retomada sem simulação offline. |
| `checkout-conta-local-bloqueada` | Cadastro efêmero não recebe checkout remoto ou campo de cartão. |
| `checkout-retomada-carrinho-vazio` | Remover todos os itens não impede consultar o pedido anterior; total congelado. |
| `checkout-produto-local-corrigido` | Produto não sincronizado é recusado; após404 autenticado/correção, outro carrinho pode ser preparado. |
| `checkout-novo-apos-reabrir` | Pedido aprovado retomado após reload/login e caminho para novo pedido funciona. |
| `checkout-cache-sem-perfil-oculto` | Rotas diretas de biblioteca/resultado após reload não exibem aquisição do perfil anterior. |
| `checkout-resposta-atrasada-logout` | Gateway bloqueado durante criação, logout/troca para ADMIN e liberação controlada da resposta: não publica resumo, feedback ou rota no novo perfil. |

Manifest e capturas: [qa-full-payment](../qa-full-payment/capture-results.json). Inspeção visual realizada nas capturas de checkout pendente e retomada em 320px. Cliques usam eventos de mouse via CDP; campos usam eventos DOM; não são testes nativos ou cliques de hardware.

Regressões: [local](../qa-full-local-checkout-regression/capture-results.json) e [API](../qa-full-api-checkout-regression/capture-results.json).

## Contratos, falhas e correções

### Aprovação externa e restauração reais — 21/11/2026

[`mercadopago-approved.json`](mercadopago-approved.json) registra consulta independente da API oficial: pagamento 190842627252 APROVADO, pedido a30a0a1b-88b6-4927-99a2-dc6c2d78e330,10480 centavos. As validações existentes de vendedor/comprador, BRL, valor, referência, metadados e reembolso passaram sem alterar código. Três reconciliações mantiveram as contagens 1 pagamento/2 itens/2 chaves; outro perfil não acessou o pedido nem a biblioteca. Reinício/login restauraram estado e itens.

[`mercadopago-approved-app-restore.json`](mercadopago-approved-app-restore.json) e [captura](mercadopago-approved-library-web.png) comprovam uma jornada adicional real de Expo Web+Chrome+API/SQLite da compra, sem mock de provedor. Login/biblioteca, reinício da API/reload/relogin e atualização explícita retornaram Neon Expansion e Orbit Raiders; três leituras autenticadas da biblioteca, zero overflow e ausência de segredos no cache. Script temporário executado: `node --env-file=.env.mercadopago tmp/auditoria/check-approved-ui.mjs`, usando o export web previamente validado. Inspeção visual da captura concluída.

A seed isolada já possuía os dois itens/chaves demonstrativos. Esta execução prova validação da aprovação, vínculo remoto e reutilização sem duplicação; não prova inserção nova de item naquela base. Inserção nova/rollback têm testes HTTP transacionais. Os resultados iniciais PENDENTE e a recuperação pré-compra permanecem preservados. Não houve alteração de fonte, nova compra pelo script, produção ou reexecução desnecessária dos gates locais já aprovados.

Os testes HTTP/gateway cobrem dono/sessão, campos extras/total adulterado, produtos inválidos, replay concorrente e após reinício, snapshot de preço, criação perdida e recuperação, busca vazia/ambígua, estados de pagamento, moeda/valor/vendedor/comprador/metadados divergentes, reembolso parcial, múltiplas aprovações, rollback da concessão e repetição. Testes do cliente cobrem payload/URL inválidos, persistência por conta, exclusão de segredos/URL da exportação e invalidação de sessão antiga.

Na primeira execução, uma fixture usou `player@...` em vez do e-mail demonstrativo `jogador@...`; corrigida antes da suíte aprovada. No primeiro E2E, um cenário assumiu biblioteca vazia depois de outro cenário aprová-la no mesmo banco; o harness passou a isolar a base por cenário de pagamento.

A captura com sufixo `-failed.png` desse cenário anterior foi preservada; o resultado atual é o manifest final com10 aprovados e zero falhas. A varredura usando o valor efetivo do token não encontrou ocorrências em fontes, documentos ou bundles fora do arquivo privado; nenhum valor foi impresso.

Findings da revisão @qa corrigidos antes do fechamento:

- Rota legada de biblioteca sem sessão/dono: passou a exigir autenticação e propriedade, em todos os modos, com regressão401/403.
- Alternar para modo simulado permitia atingir pedido remoto pela rota legada de pagamentos: bloqueado por vínculo à operação remota, com teste de reinício no mesmo banco.
- Referência local podia prender um carrinho rejeitado antes da criação: limpeza somente após404 autenticado confirmar que nenhum pedido existe.
- Caminho para outro pedido após reload e retomada com carrinho vazio: passaram a consultar o estado servidor e preservar acesso à operação anterior.
- Perfil ausente podia selecionar o cache remoto do jogador padrão por rota direta: dados remotos agora exigem perfil ativo na interface.

## Reproduzir

```powershell
npm run checkout:test
npm run lint
npm run typecheck
npm test
$env:TEMP=(Resolve-Path tmp/auditoria).Path
$env:TMP=$env:TEMP
$env:EXPO_PUBLIC_API_URL='http://127.0.0.1:3107'
npx expo export --platform web --clear --output-dir tmp/auditoria/dist-web-sync
node scripts/capture-evidence.mjs qa-full-payment
node scripts/capture-evidence.mjs qa-full-api-checkout-regression
$env:EXPO_PUBLIC_API_URL=''
npm run build:web:evidence -- --clear
node scripts/capture-evidence.mjs qa-full-local-checkout-regression
npm run build -- --clear
```

O harness usa portas8097/3107/9223 e encerra os próprios processos/bancos; executar as suítes de navegador sequencialmente. A execução no sandbox Windows exige permissão para rede local/Chrome e operações SQLite temporárias. Não confundir falha `EPERM` de infraestrutura com resultado de regressão funcional.

O smoke externo exige `.env.mercadopago` privado autorizado. Mantém estado em `tmp/auditoria/mercadopago-live`; arquivos sanitizados de resultado estão copiados nesta pasta. A recuperação altera apenas a operação desse banco isolado. Não usa o banco de trabalho nem envia compra.

## DoD e pendências

- [x] Decisão @architect, fontes oficiais de Mercado Pago e SDK54 conferidas; nenhuma dependência nova.
- [x] Contratos, organização, validação de entrada, segredos no backend, revisão pós-código/pós-testes e regressões dos findings.
- [x] Lint/typecheck/testes/build e validação HTTP/gateway; resumo, estados e retomada exercitados no app web.
- [x] Configuração, README, histórico, comandos e File List atualizados; sem commit/push/publicação.
- [x] Compra externa de teste aprovada/reconciliada, vínculo à biblioteca, repetição, isolamento e restauração no app web real comprovados para HU14/HU15. Ressalva nativa segue separada.
- [ ] Validação nativa em dispositivo, mantida como limitação explícita.
- [N/A] Webhook/retorno automático sem URL HTTPS/chave; confirmação deste incremento usa consulta autenticada explícita e retorno manual.
- [N/A] Dependências novas, atualização de SDK, produção e CodeRabbit.

O [gate formal do QA](../../qa/gates/3.5-checkout-mercado-pago-teste.yml) foi atualizado em 21/11/2026 para **CONCERNS, 90/100**, com story **Done**. TEST-001 foi resolvido pelas evidências externas; os findings de código identificados foram corrigidos. Somente TEST-002 permanece aberto, conservando o limite do runtime web. O FAIL 70/100 anterior está preservado no histórico do QA.
