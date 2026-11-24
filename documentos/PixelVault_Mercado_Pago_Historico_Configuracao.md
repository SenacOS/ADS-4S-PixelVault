# PixelVault — histórico de configuração do Mercado Pago

**Data:** 20/11/2026. **Contexto:** Sprint 2, após a rodada de QA da story 3.4.

**Status ao finalizar a configuração externa:** MCP conectado e autenticado; aplicação criada. A implementação posterior está registrada em [Checkout Pro de teste](PixelVault_Mercado_Pago_Checkout_Teste.md), story 3.5. Os limites abaixo descrevem o marco anterior à implementação.

## Finalidade e decisões autorizadas

O usuário definiu uso exclusivamente acadêmico, para aprendizado e testes, sem pagamentos reais. Escolheu configurar a aplicação a partir do contexto do projeto e utilizar **Checkout Pro**, com pagamento na página hospedada pelo Mercado Pago. Após revisar os dados propostos, autorizou a criação condicionada à adequação ao cenário de testes.

A documentação consultada orienta usar as credenciais do ambiente de Teste para validar a integração sem processar pagamentos reais. A ferramenta de criação não possui campo específico para uso acadêmico; essa finalidade foi registrada na descrição da aplicação. O ambiente de teste será mantido durante toda a implementação e validação.

## Sequência executada

1. Tentativa de instalar o plugin pelos comandos fornecidos pelo usuário:

   ```powershell
   codex plugin marketplace add mercadopago/mercadopago-codex-marketplace
   codex plugin add mercadopago@mercadopago-codex-marketplace
   ```

   O primeiro comando falhou com `Repository not found` ao clonar o repositório do GitHub; a consulta à URL também retornou HTTP 404. O segundo informou que o plugin não foi encontrado no marketplace. Não foi possível determinar se o repositório estava privado, removido ou renomeado. O plugin não foi instalado e o comando `/mp-connect` não ficou disponível.

2. Configuração direta do MCP oficial, autorizada pelo usuário:

   ```powershell
   codex mcp add mercadopago --url https://mcp.mercadopago.com/mcp
   ```

   O comando cadastrou o servidor globalmente no perfil local do Codex e iniciou automaticamente o fluxo OAuth. O usuário concluiu a autorização no navegador; o CLI retornou `Successfully logged in.`. Não foi necessário executar `codex mcp login mercadopago` separadamente.

3. Verificação com `codex mcp get mercadopago`: servidor habilitado, transporte `streamable_http` e endpoint oficial. Após reiniciar o Codex, as ferramentas do Mercado Pago ficaram disponíveis no chat.

4. Validação funcional: consultas às ferramentas `application_list` e `search_documentation` concluídas. A primeira listagem não encontrou aplicações. A busca retornou documentação sobre integração, credenciais e testes.

5. Escolha do Checkout Pro e confirmação dos dados pelo usuário. Criação pela ferramenta `create_application`, que retornou `Application Created Successfully` e informou automação de contas de teste ativa.

## Aplicação e recursos criados

| Campo | Valor confirmado |
| --- | --- |
| Nome | PixelVault |
| ID da aplicação principal | `224474865761541` |
| Solução | `online_payments` |
| Plataforma | `self_developed` |
| Produto | `checkout_pro` |
| País retornado pela conta OAuth | Brasil (`MLB`) |
| Descrição | Projeto academico para aprendizado e testes de integracao. Uso exclusivo em ambiente de teste. |
| ID do vendedor de teste | `3860552857` |
| ID da aplicação do vendedor de teste | `4781073900783352` |
| ID do comprador de teste | `3860552859` |

Os recursos de teste foram criados automaticamente pelo Mercado Pago durante a criação da aplicação; não foi executada criação manual adicional de contas. Os identificadores acima servem para localizar os recursos e não são credenciais de acesso.

## Estado técnico e limites ao concluir a configuração externa

- A configuração do MCP pertence ao perfil local do Codex; não configura o gateway do PixelVault nem se aplica automaticamente às máquinas de outros colaboradores.
- Não foram copiadas credenciais para o projeto ou alterados `.env`, API, banco, dependências ou fluxo de checkout nesta etapa.
- Não foram criados pagamentos, preferências ou pedidos externos; não houve compra de teste nem transação real.
- Não foram configurados webhook, URL pública de retorno ou reconciliação de status.
- Não foi executada ativação do ambiente de produção.
- O gateway existente continua simulado; `PAYMENT_MODE=mercadopago` permanece sem implementação e retorna `503 PAYMENT_MODE_NOT_IMPLEMENTED`.
- A conexão OAuth do MCP permite usar ferramentas de desenvolvimento; ela não substitui as credenciais de teste que o backend precisará utilizar.

Este histórico não contém Access Token, Public Key, Client Secret, senhas de contas de teste ou URLs temporárias de autorização OAuth.

## Próximos passos

1. Preparar a story da integração e revisar o contrato de checkout, criação de pedido no servidor, autorização e confirmação do pagamento, conforme os artefatos do projeto.
2. Confirmar a API/fluxo do Checkout Pro aplicável à aplicação criada e consultar somente suas credenciais de teste, mantendo segredos no backend e fora do Git, logs e respostas ao aplicativo.
3. Implementar criação do checkout e abertura da página de pagamento pelo app; definir URLs de retorno e mecanismo de confirmação confiável no servidor.
4. Implementar tratamento de aprovado, pendente, rejeitado, cancelamento, repetição e falhas de comunicação, com atualização coerente de pedido e biblioteca.
5. Executar testes automatizados e compra de teste; atualizar story, File List, evidências e parecer de QA. A integração só poderá ser considerada concluída após essas verificações.

## Verificação deste registro

Alterações limitadas a este documento, ao índice do `README.md` e ao histórico de desenvolvimento. `npm run lint` e `npm run typecheck` passaram; `npm test` passou com 68/68 testes. A primeira execução dos testes foi bloqueada por `EPERM` ao renomear bancos SQLite temporários no sandbox; a repetição autorizada fora dele passou. Não foi repetido o build, pois esta alteração é exclusivamente documental. Esses resultados verificam a regressão do projeto e não representam testes da integração Mercado Pago, ainda pendente.

## Referências

- [Conexão com o MCP oficial](https://www.mercadopago.com.br/developers/pt/docs/mcp-server/connection).
- [Credenciais e ambientes](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/credentials).
- [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/test/accounts).
- [Painel de integrações](https://www.mercadopago.com.br/developers/panel/app).
- [Rodada de QA anterior à integração](PixelVault_Rodada_QA_Pre_Mercado_Pago.md).

As informações operacionais registradas derivam dos resultados dos comandos e ferramentas executados nesta sessão. A criação dos recursos externos não equivale à implementação nem à aprovação de qualidade do fluxo de pagamentos.
