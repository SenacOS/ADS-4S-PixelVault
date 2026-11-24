# Evidências do Prompt 15 — API Node e fronteira do Mercado Pago

**Story:** `2.3`  
**Data da verificação:** 15/09/2026  
**Ambiente:** Windows, Node.js `22.18.0`, npm `11.5.2`, Expo SDK 54 preservado

## Pesquisa oficial e decisão

Fontes oficiais consultadas em 15/09/2026:

1. [Criar order — Checkout API](https://www.mercadopago.com.br/developers/en/reference/online-payments/checkout-api/create-order/post): candidata futura `POST /v1/orders`, Bearer Access Token, `X-Idempotency-Key`, sucesso `201` e erros.
2. [Possíveis erros — Checkout API Orders](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-management/integration-errors): validação, credenciais, idempotência e limites.
3. [Credenciais](https://www.mercadopago.com.br/developers/pt/docs/qr-code-ca/resources/credentials): distinção entre teste e produção; token restrito ao backend.
4. [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/test-accounts): papéis e dados específicos de teste.
5. [Segurança de credenciais](https://www.mercadopago.com.br/developers/pt/docs/yampi/best-practices/credentials-best-practices/secure-credentials): token no backend e fora do repositório.

Não foram fornecidas nem autorizadas credenciais de teste, e a modalidade do Mercado Pago ainda não foi escolhida. Nenhum SDK, payload, chamada externa ou adaptador parcial foi implementado. `PAYMENT_MODE=mercadopago` responde `503 PAYMENT_MODE_NOT_IMPLEMENTED`, sem fallback. A [referência do Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) foi conferida; o SDK e suas dependências não foram alterados.

## Execução e configuração

O backend separa configuração, SQLite, repositórios, gateway, serviço transacional, HTTP e CLI em `server/`. Usa somente módulos nativos do Node.

```powershell
npm ci
npm run db:init
npm run api:start
```

| Variável | Padrão | Finalidade |
|---|---|---|
| `API_HOST` | `127.0.0.1` | Bind local. |
| `API_PORT` | `3000` | Porta do servidor. |
| `PIXELVAULT_DB_PATH` | `database/pixelvault.sqlite` | Banco do Prompt 14. |
| `PAYMENT_MODE` | `simulated` | Simulador ou modo externo indisponível. |
| `MERCADO_PAGO_ACCESS_TOKEN` | vazio | Reservado; não é lido nesta versão. |

Configuração inválida, banco ausente ou schema incompatível impedem a inicialização com mensagem sanitizada e código não zero.

## Contratos

Todas as respostas usam JSON. Erros seguem `{ "error": { "code": "...", "message": "..." } }`.

- `GET /health`: retorna `status`, `paymentMode` e `paymentAvailable`.
- `GET /api/products`: retorna catálogo determinístico, sem duplicar produtos, com loja e plataformas cloud separadas (`UX-10`).
- `GET /api/users/:userId/library`: retorna itens ou lista vazia; diferencia identificador inválido e usuário inexistente. Não há autenticação/autorização.
- `POST /api/payments`: aceita somente `{ "pedidoId": "..." }`; criação retorna `201` e reutilização idempotente `200`.

O pagamento deriva o valor de `pedido.total_centavos`, valida a soma dos itens e grava pagamento aprovado, biblioteca e chaves fictícias em uma transação `BEGIN IMMEDIATE`/`COMMIT`, com `ROLLBACK` em falha. O corpo é limitado a 16 KiB. Campos adicionais são rejeitados; dados financeiros e credenciais usam `FORBIDDEN_PAYMENT_DATA`. Bodies, headers, caminhos, chaves e segredos não entram nos logs.

Exemplo de resposta simulada:

```json
{
  "mode": "simulated",
  "pedidoId": "pedido-demo-001",
  "paymentId": "identificador-persistido",
  "status": "APROVADO",
  "valorCentavos": 10480,
  "referencia": "FICTICIA-SIMULADA-identificador"
}
```

## Testes reais

`tests/api.test.mjs` inicia HTTP em porta efêmera e recria um SQLite temporário pelos scripts reais do Prompt 14. Cobre saúde, catálogo, biblioteca existente/vazia/inexistente, criação, idempotência, pedido ausente/vazio/inconsistente, rollback, contrato estrito, dados proibidos, limite, rota/método, modo externo e falhas de inicialização.

| Comando | Resultado em 15/09/2026 |
|---|---|
| `npm run api:test` | PASS — 12/12 |
| `npm run db:init` | PASS — banco recriado |
| `npm run db:test` | PASS — 4/4 |
| `npm run lint` | PASS — zero erros/avisos |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 33/33 |
| `npm run build` | PASS — export Android concluído |

Aviso esperado: `node:sqlite` é experimental no Node 22. Nenhuma dependência foi adicionada.

A inicialização CLI com um caminho de banco inexistente também foi executada e terminou com código `1` e mensagem sanitizada, sem expor o caminho ou stack trace.

## Limitações da Sprint 2

Permanecem pendentes: autenticação/autorização (`HU-12`), CRUD persistente (`HU-13`), escolha e integração Mercado Pago em teste (`HU-14`), app Expo consumindo a API, webhooks, retentativas, reconciliação, reembolso/estorno, liberação ponta a ponta (`HU-15`) e política comercial/proteção de chaves.
