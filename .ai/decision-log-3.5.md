# Story 3.5 — Checkout Pro exclusivamente de teste

20/11/2026. Autorização do usuário: configurar credenciais de teste no backend e implementar checkout com gates, mantendo finalidade acadêmica. Auxiliares sequenciais: @sm, @architect, @qa; nunca mais de um ativo.

- Credenciais obtidas pela aplicação principal; seção Test identificou o vendedor automatizado. Consulta direta ao seller app negou ownership. Segredo salvo somente em `.env.mercadopago`, ignorado pelo Git; nenhum token em evidências.
- Identidade real consultada: seller3860552857, MLB, test_user. Consulta pública do buyer3860552859 retorna ID/MLB mas omite tags; validar tag quando disponível, mantendo ID do comprador criado pelo MCP.
- Preferences API com snapshot imutável e claim persistido antes da rede. Recuperação usa search/GET e nunca repete criação incerta.
- Consulta de pagamento autenticada valida valor, moeda, metadados, vendedor e comprador. Browser/redirect não confirma aquisição. Reembolso parcial é recusado; concessão de chaves fictícias é atômica e idempotente.
- QA encontrou bypass na biblioteca legada e possibilidade de pagamento simulado em pedido remoto ao alternar modo; corrigidos com regressões. Retomada de carrinho vazio, limpeza só após404 autenticado e cache sem perfil corrigidos.
- Smoke externo criou preferência de teste e recuperou a mesma após simulação de perda de registro local; estado PENDENTE. Não foi submetido pagamento.
- Sem novas dependências, webhook público, ativação de produção, commit ou push. Compra hospedada aprovada e dispositivo continuam pendentes; não apresentar mocks como homologação real.

Atualização21/11/2026: usuário concluiu compra hospedada de teste; backend confirmou APROVADO, pagamento 190842627252. Gateway reconsultado independentemente com os mesmos controles; repetição, isolamento e reinício/login preservaram aquisição sem duplicação. Expo Web+API/banco reais também restauraram os dois produtos após reinício da API/reload/relogin, sem mock. Evidências `mercadopago-approved*` na pasta da story. A seed isolada já tinha os itens/chaves: validar reutilização, sem afirmar inserção nova neste caso. Nenhuma fonte de produto mudou. TEST-001 encaminhado para resolução QA; teste nativo segue pendente.

QA final em 21/11/2026: TEST-001 resolvido, gate CONCERNS90/100 e story Done. Somente TEST-002 nativo permanece aberto.
