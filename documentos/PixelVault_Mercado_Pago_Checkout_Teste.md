# PixelVault — Checkout Pro em ambiente de teste

**Data:** 20/11/2026. **Story:** 3.5. **Finalidade:** exclusivamente aprendizado e testes, sem pagamentos reais.

**Atualização:** 21/11/2026. **Status:** Done; QA CONCERNS, 90/100, somente pela validação nativa pendente. Compra externa de teste APROVADA e reconciliada; biblioteca confirmada por API e Expo Web reais e restaurada após reiniciar API/app e reautenticar. Gates locais anteriores: lint, typecheck, 82 testes, build Android 633 módulos e 61 jornadas web, além da jornada web real da aquisição aprovada.

## Configuração privada

As credenciais foram obtidas pelo MCP a partir da aplicação principal `224474865761541`, cuja resposta identificou explicitamente a seção de teste e o vendedor automatizado. A tentativa de obter diretamente as credenciais da aplicação do vendedor foi recusada por validação de propriedade OAuth; a consulta da aplicação principal forneceu as credenciais corretas do cenário de teste.

O arquivo `.env.mercadopago`, ignorado pelo Git e separado dos arquivos carregados automaticamente pelo Expo, contém apenas a configuração do backend. O Access Token não é exibido neste documento, nos logs ou no aplicativo. Mantenha esse arquivo privado.

| Variável | Uso |
| --- | --- |
| `PAYMENT_MODE=mercadopago` | Seleciona o checkout externo de teste. |
| `MERCADO_PAGO_ENVIRONMENT=test` | Ambiente obrigatório; produção é recusada. |
| `MERCADO_PAGO_ACCESS_TOKEN` | Segredo do vendedor de teste; somente backend. |
| `MERCADO_PAGO_TEST_SELLER_ID` | Vendedor de teste esperado: `3860552857`. |
| `MERCADO_PAGO_TEST_BUYER_ID` | Comprador de teste esperado: `3860552859`, criado automaticamente pelo MCP. |
| `MERCADO_PAGO_RETURN_URL` | Opcional: destino HTTPS controlado pela equipe. Sem configuração, retorno manual ao app. |

O backend consulta `/users/me` e exige vendedor esperado, país MLB e tag `test_user`. Consulta também o comprador esperado e seu país; a API pública de usuário omitiu `tags` no teste real, portanto o backend valida a tag quando presente. A origem do ID do comprador é o recurso de teste criado pelo MCP, e não entrada enviada pelo cliente. Prefixo da credencial e `live_mode` não são usados isoladamente como prova de teste.

## Contratos implementados

| Método e rota | Comportamento |
| --- | --- |
| `POST /api/checkouts` | Exige sessão; aceita somente `{requestId, productIds}`. Cria pedido com preços do catálogo servidor, antes de solicitar a preferência. |
| `GET /api/checkouts/:id` | Consulta do dono: resumo congelado, estado e URL validada quando disponível. |
| `POST /api/checkouts/:id/reconcile` | Exige sessão do dono e corpo `{}`. Consulta pagamentos no Mercado Pago e confirma os candidatos por ID no servidor. |
| `GET /api/me/library` | Aquisições associadas a checkouts remotos aprovados do usuário autenticado. Não usa a seed demonstrativa como prova de pagamento. |
| `GET /api/users/:userId/library` | Rota legada agora exige sessão do próprio dono em todos os modos; sem sessão retorna401, outro dono403. |
| `POST /api/payments` | Continua exclusivamente demonstrativo. Não aceita confirmar pedidos de `checkout_operation`, inclusive ao reiniciar o servidor no modo simulado. |

A migração aditiva `002_checkout.sql` cria a tabela operacional `checkout_operation`. Pedido, itens, assinatura e snapshot são persistidos atomicamente; não há transação SQLite aberta durante a rede. O snapshot mantém os preços originais mesmo após editar o catálogo.

O gateway usa a Preferences API (`/checkout/preferences`) e mantém a referência externa do pedido. Antes de enviar a criação, reivindica a operação com transição condicional persistida para `REQUESTING`. Clique repetido, perda de resposta ou reinício não repetem esse POST: a recuperação busca a preferência por referência e confirma o recurso completo, vendedor e itens. Busca vazia preserva incerteza; ambiguidade é recusada.

Na reconciliação, referência, vendedor, comprador esperado, moeda BRL, valor integral e metadados de pedido/teste precisam corresponder. Estado desconhecido, divergência, reembolso parcial ou múltiplas aprovações são recusados. Apenas aprovação confirmada gera pagamento e concessão de biblioteca na mesma transação. Repetições não duplicam itens; chaves continuam fictícias.

## Aplicativo

Com `EXPO_PUBLIC_API_URL` configurada, o checkout não coleta cartão nem executa simulação offline. Exige login online de conta reconhecida pelo backend; cadastro efêmero local não autoriza pagamento remoto. Sem API configurada, a demonstração anterior é preservada.

O jogador prepara o pedido, confere o **resumo confirmado pelo servidor** e aciona **Abrir Mercado Pago de teste**. O botão de abertura usa o gesto explícito do usuário e valida HTTPS/domínio oficial antes de chamar `Linking.openURL`, sem dependência nova. Ao voltar, **Consultar pagamento de teste** solicita reconciliação; fechar o navegador ou receber parâmetros de retorno não aprova compra.

A referência é salva por conta antes da rede, sem token ou URL de pagamento no vault. Ela permite retomar após recarregar e mesmo com carrinho vazio. Uma solicitação rejeitada antes de criar pedido só é limpa após consulta autenticada404 comprovar sua inexistência. Outro pedido só é iniciado após consultar aprovação do anterior no servidor. Troca/logout invalida respostas atrasadas; rotas diretas sem perfil não exibem o cache remoto do jogador padrão.

A biblioteca remota é restaurada após login e possui atualização explícita. O JSON exclui a referência interna e URL de checkout; aquisições remotas de teste usam `simulado=false` e `ambiente=teste` no pedido, preservando a origem de cache local e o contexto acadêmico.

## Como executar e concluir a validação externa

Não recrie um banco que contenha dados que deseja preservar. Se ainda não existir banco local, execute `npm run db:init` uma única vez. Em um terminal, inicie:

```powershell
npm run api:start:mercadopago
```

Em outro terminal, para o navegador no mesmo computador:

```powershell
$env:EXPO_PUBLIC_API_URL='http://127.0.0.1:3000'
npm run web
```

Entre como jogador demonstrativo do backend, adicione produtos e prepare o pedido. Abra o checkout em contexto de navegador separado da conta pessoal. Utilize somente o **comprador de teste `3860552859`** criado para esta integração e os dados de cartão da documentação de testes; dados de acesso da conta de teste devem ser consultados privadamente no painel do Mercado Pago. Não envie senha ou credencial pelo chat e não utilize cartão real.

Conclua uma compra aprovada de teste, volte ao PixelVault e consulte o pagamento. Confirmar aprovação no servidor, inclusão única na biblioteca, nova consulta e restauração após reabrir/login. Esse fluxo externo foi executado e validado em 21/11/2026, conforme registro abaixo. Divergências futuras devem ser investigadas no backend, sem relaxar a validação para aceitar pagamento real.

Para repetir a preparação externa sem pagar:

```powershell
npm run checkout:smoke
npm run checkout:smoke -- --recover
```

O smoke usa banco isolado em `tmp/auditoria/mercadopago-live`, conserva o pedido e nunca envia pagamento. `--recover` exige smoke anterior pendente/pronto e simula perda do registro da preferência apenas nesse banco para exercitar busca/GET sem novo POST de preferência. Não executar a recuperação sobre aquisição aprovada.

## Qualidade e limites

### Compra externa validada em 21/11/2026

O usuário concluiu a compra no checkout hospedado; o backend consultou novamente a API oficial e confirmou **APROVADO**, pagamento `190842627252`, pedido `a30a0a1b-88b6-4927-99a2-dc6c2d78e330`, total 10480 centavos. A validação do gateway exigiu vendedor/comprador esperados, referência, moeda, metadados e ausência de reembolso parcial; não houve mudança para aceitar o resultado.

Três consultas repetidas mantiveram um pagamento, dois itens de biblioteca e duas chaves fictícias. O perfil diferente recebeu404 para o pedido e biblioteca remota vazia. Após reiniciar o servidor e autenticar novamente, o estado e os produtos permaneceram. Um teste adicional com Expo Web, Chrome e API/banco da compra real, sem adaptador simulado, abriu a biblioteca, reiniciou a API, recarregou o app, reautenticou e atualizou a biblioteca: Neon Expansion e Orbit Raiders restaurados, sem overflow ou segredo no cache.

A base isolada já continha os itens demonstrativos da seed. A aprovação remota passou a fundamentar sua exposição na biblioteca remota, reutilizando itens/chaves sem duplicação; essa execução não é apresentada como inserção nova de item. O caminho de inserção nova e seu rollback foram exercitados pelos testes de contrato. Nenhum código de produto foi alterado nesta rodada.

Evidências sanitizadas: `mercadopago-approved.json`, `mercadopago-approved-app-restore.json` e `mercadopago-approved-library-web.png`, na pasta de evidências da story3.5. Os resultados PENDENTE anteriores foram preservados como histórico da preparação.

Evidências, resultados finais e DoD ficam em `docs/evidence/sprint-2-story-3.5/README.md`; decisão técnica em `docs/architecture/project-decisions/3.5-checkout-mercado-pago-teste.md`. Em21/11/2026, o QA resolveu TEST-001 e atualizou o gate para **CONCERNS, 90/100**, com story **Done**. A única ressalva aberta é TEST-002 nativa. O parecer anterior FAIL 70/100 fica preservado no histórico; os findings locais identificados foram corrigidos.

Webhook público e retorno automático não foram configurados: não há URL HTTPS/chave de assinatura fornecidas. Consulta autenticada e retorno manual atendem ao incremento local escolhido. Validação em dispositivo permanece separada dos builds e do E2E web. Reembolso, chargeback e revogação posterior não estão implementados neste incremento acadêmico. Nenhuma produção foi ativada.
