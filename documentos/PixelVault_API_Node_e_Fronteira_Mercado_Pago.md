# PixelVault - API Node e Fronteira do Mercado Pago

**Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis**  
**Item atendido:** 1.5 - Modelagem, Estrutura do Banco de Dados e Node  
**Responsável:** Integrante 3  
**Prompt:** 15 - API Node e fronteira do Mercado Pago  
**Story associada:** 2.3 - API Node mínima e fronteira simulada de pagamento  
**Versão:** 1.0  
**Data:** 15/09/2026  
**Status:** concluído  
**Gate de qualidade:** PASS - 100/100

## 1. Objetivo

Disponibilizar uma API Node mínima e executável para consultar o banco SQLite local do PixelVault e demonstrar o fluxo de pagamento por meio de uma fronteira segura e substituível.

O incremento mantém o modo `simulated` como padrão, funciona sem credenciais ou serviços externos e deixa a futura integração de teste com o Mercado Pago explicitamente delimitada para a Sprint 2.

## 2. Entradas utilizadas

- histórias e critérios de aceitação dos Prompts 4 e 12;
- modelo relacional e regras de integridade aprovados no Prompt 13;
- schema, seed e inicializador SQLite entregues no Prompt 14;
- dados realmente usados pelo protótipo;
- decisão `UX-10`, que separa produto, loja de ativação, plataforma cloud e compatibilidade;
- Story 2.3 e seus 14 critérios de aceitação;
- documentação oficial do Mercado Pago consultada em 15/09/2026.

## 3. Artefatos produzidos

| Artefato | Finalidade |
|---|---|
| `server/app.mjs` | Composição HTTP, roteamento, validação e serialização JSON. |
| `server/config.mjs` | Leitura e validação das configurações locais. |
| `server/database.mjs` | Abertura do SQLite, verificação do schema e ativação de FKs. |
| `server/repositories.mjs` | Consultas e escritas parametrizadas. |
| `server/payment-gateway.mjs` | Contrato substituível, simulador e modo externo indisponível. |
| `server/payment-service.mjs` | Regras de pagamento, transação, rollback, idempotência e biblioteca. |
| `server/errors.mjs` | Erros tipados e respostas sanitizadas. |
| `server/index.mjs` | Entrada CLI e encerramento controlado do processo. |
| `tests/api.test.mjs` | Testes HTTP reais com porta efêmera e SQLite temporário. |
| `.env.example` | Variáveis permitidas, sem valores secretos. |
| `docs/evidence/prompt-15/README.md` | Fontes oficiais, contratos, comandos e resultados observados. |
| `docs/qa/gates/2.3-api-node-fronteira-mercado-pago.yml` | Parecer formal de qualidade. |

## 4. Arquitetura mínima

A solução usa somente módulos nativos do Node.js:

- `node:http` para o servidor;
- `node:sqlite` para o banco local;
- `node:crypto` para IDs e referências fictícias;
- `node:test` para os testes automatizados.

Não foram adicionados framework HTTP, ORM, SDK do Mercado Pago ou dependências de conveniência.

```text
Cliente HTTP
    |
    v
server/app.mjs
    |-- consultas --> repositories.mjs --> SQLite
    |
    `-- pagamento --> payment-service.mjs
                         |-- repositories.mjs --> SQLite
                         `-- payment-gateway.mjs --> simulated
```

O aplicativo Expo não consome esta API nesta fase. A API e o protótipo continuam como incrementos demonstráveis separados.

## 5. Configuração e execução

Pré-requisitos:

- Node.js `>=22.5`, por causa de `node:sqlite`;
- npm;
- banco do Prompt 14 inicializado.

Na raiz do projeto:

```powershell
npm ci
npm run db:init
npm run api:start
```

O endereço padrão é `http://127.0.0.1:3000`.

| Variável | Padrão | Finalidade |
|---|---|---|
| `API_HOST` | `127.0.0.1` | Endereço local de bind. |
| `API_PORT` | `3000` | Porta HTTP. |
| `PIXELVAULT_DB_PATH` | `database/pixelvault.sqlite` | Caminho do banco local. |
| `PAYMENT_MODE` | `simulated` | Seleciona o simulador ou o modo externo indisponível. |
| `MERCADO_PAGO_ACCESS_TOKEN` | vazio | Reservado para trabalho futuro; não é lido nesta versão. |

O projeto não carrega `.env` automaticamente. Configuração inválida, banco ausente ou schema incompatível encerram o processo com código diferente de zero e mensagem sanitizada.

## 6. Endpoints essenciais

Todas as respostas usam `application/json; charset=utf-8`. Erros seguem o envelope:

```json
{
  "error": {
    "code": "CODIGO_ESTAVEL",
    "message": "Mensagem segura."
  }
}
```

### 6.1 Saúde

```http
GET /health
```

Resposta `200` no modo padrão:

```json
{
  "status": "ok",
  "paymentMode": "simulated",
  "paymentAvailable": true
}
```

A rota não depende de rede externa e não revela caminho do banco, segredo ou stack trace.

### 6.2 Catálogo

```http
GET /api/products
```

Retorna os produtos em ordem determinística, com preço em centavos, descrição, loja de ativação e plataformas cloud. O agrupamento por ID impede duplicação de produtos por plataforma e preserva `UX-10`.

```json
{
  "products": [
    {
      "id": "orbit-raiders",
      "name": "Orbit Raiders",
      "type": "JOGO",
      "priceCents": 7990,
      "description": "Descrição demonstrativa. O conteúdo final ainda não foi aprovado.",
      "activationStore": {
        "id": "loja-demo",
        "name": "Loja de demonstração (fictícia)"
      },
      "cloudPlatforms": [
        { "id": "boosteroid", "name": "Boosteroid" },
        { "id": "geforce-now", "name": "GeForce NOW" }
      ]
    }
  ]
}
```

### 6.3 Biblioteca

```http
GET /api/users/:userId/library
```

Retorna `200` com itens ou lista vazia para usuário existente. Um usuário inexistente recebe `404 USER_NOT_FOUND`; identificador inválido recebe `400 INVALID_USER_ID`.

```json
{
  "userId": "player-demo",
  "items": [
    {
      "id": "item-biblioteca-orbit-001",
      "product": {
        "id": "orbit-raiders",
        "name": "Orbit Raiders",
        "type": "JOGO"
      },
      "activationStore": {
        "id": "loja-demo",
        "name": "Loja de demonstração (fictícia)"
      },
      "activationKey": {
        "code": "PV-ORBIT-DEMO-CHAVE-FICTICIA",
        "fictional": true
      }
    }
  ]
}
```

Esta rota não possui autenticação ou autorização e deve permanecer restrita ao ambiente local de demonstração.

### 6.4 Pagamento

```http
POST /api/payments
Content-Type: application/json
```

Único corpo aceito:

```json
{ "pedidoId": "pedido-demo-001" }
```

Uma criação retorna `201`; uma repetição idempotente retorna `200` com os mesmos dados persistidos:

```json
{
  "mode": "simulated",
  "pedidoId": "pedido-demo-001",
  "paymentId": "pagamento-demo-001",
  "status": "APROVADO",
  "valorCentavos": 10480,
  "referencia": "REFERENCIA-TESTE-SEM-VALOR-COMERCIAL"
}
```

O servidor deriva o valor exclusivamente de `pedido.total_centavos`. Total informado pelo cliente, número de cartão, nome impresso, CVV, validade, token e credenciais são rejeitados.

| HTTP | Código principal | Condição |
|---:|---|---|
| `400` | `INVALID_JSON` ou `INVALID_BODY` | JSON ou corpo inválido. |
| `400` | `FORBIDDEN_PAYMENT_DATA` | Dado financeiro ou credencial recebido. |
| `404` | `PEDIDO_NOT_FOUND` | Pedido inexistente. |
| `409` | `EMPTY_ORDER` | Pedido sem itens. |
| `409` | `ORDER_TOTAL_MISMATCH` | Soma dos itens diferente do total. |
| `413` | `BODY_TOO_LARGE` | Corpo maior que 16 KiB. |
| `415` | `UNSUPPORTED_MEDIA_TYPE` | Conteúdo diferente de JSON. |
| `503` | `PAYMENT_MODE_NOT_IMPLEMENTED` | Modo Mercado Pago solicitado. |
| `500` | `INTERNAL_ERROR` | Falha inesperada sanitizada. |

## 7. Fluxo transacional e idempotência

O pagamento simulado segue este fluxo:

1. inicia `BEGIN IMMEDIATE`;
2. consulta pedido e itens;
3. rejeita pedido vazio;
4. confere a soma dos snapshots com `pedido.total_centavos`;
5. procura pagamento existente pelo pedido;
6. reutiliza o pagamento quando já existe;
7. caso contrário, executa o gateway simulado e persiste um único pagamento;
8. somente o estado `APROVADO` materializa biblioteca, itens e chaves fictícias;
9. conclui com `COMMIT`;
10. qualquer falha provoca `ROLLBACK`.

As constraints únicas do schema complementam o serviço e impedem pagamento, aquisição ou chave duplicados. A idempotência é comprovada no estado persistido, não por cache em memória.

Os estados aceitos permanecem limitados a `PENDENTE`, `APROVADO`, `RECUSADO` e `ERRO`.

## 8. Fronteira segura do Mercado Pago

O código depende de um contrato interno substituível:

```text
createPayment({ pedidoId, valorCentavos, idempotencyKey })
  -> { status, externalReference }
```

Foram implementados dois comportamentos:

- `SimulatedPaymentGateway`: local, síncrono, sem segredo e sem rede;
- `UnavailableMercadoPagoGateway`: retorna erro controlado `503`, sem fallback silencioso.

Nenhuma credencial de teste foi fornecida ou autorizada. Também não havia decisão aprovada sobre modalidade, meio de pagamento e fluxo assíncrono. Portanto, não foram criados SDK, payload externo, webhook ou chamada para `api.mercadopago.com`.

### 8.1 Documentação oficial consultada

Consulta realizada em 15/09/2026:

1. [Criar order - Checkout API](https://www.mercadopago.com.br/developers/en/reference/online-payments/checkout-api/create-order/post);
2. [Possíveis erros - Checkout API Orders](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-management/integration-errors);
3. [Credenciais](https://www.mercadopago.com.br/developers/pt/docs/qr-code-ca/resources/credentials);
4. [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/test-accounts);
5. [Segurança de credenciais](https://www.mercadopago.com.br/developers/pt/docs/yampi/best-practices/credentials-best-practices/secure-credentials).

A API de Orders foi registrada apenas como candidata futura. A documentação específica do produto escolhido deverá ser consultada novamente antes de qualquer integração externa.

## 9. Segurança e integridade

- bind padrão restrito a `127.0.0.1`;
- chaves estrangeiras habilitadas em toda conexão;
- consultas com entrada usam parâmetros;
- corpo de pagamento limitado a 16 KiB;
- contrato rejeita campos adicionais e dados financeiros;
- respostas de erro não incluem SQL, caminho local, stack trace ou corpo recebido;
- logs contêm somente ID local da requisição, método, rota normalizada, status e duração;
- bodies, headers, chaves de ativação e segredos não são registrados;
- nenhuma configuração de CORS aberto foi adicionada;
- nenhuma credencial real foi adicionada ao repositório ou ao banco.

## 10. Testes executados

`tests/api.test.mjs` inicia a aplicação em porta efêmera e usa um SQLite temporário criado a partir dos scripts reais do Prompt 14.

Resultado específico:

```powershell
npm run api:test
```

**12/12 testes aprovados.**

| Cobertura | Evidência |
|---|---|
| Saúde | Estado, modo e ausência de detalhes locais. |
| Catálogo | Ordem, agrupamento, preços e separação `UX-10`. |
| Biblioteca | Populada, vazia, usuário inexistente e ID inválido. |
| Pagamento | Criação aprovada e valor derivado do banco. |
| Idempotência | Repetição sem novo pagamento, aquisição ou chave. |
| Integridade | Pedido inexistente, vazio e total divergente. |
| Rollback | Ausência de estado parcial após falha provocada. |
| Contrato | JSON, mídia, campos extras e dados proibidos. |
| HTTP | Limite de corpo, rota e método inexistentes. |
| Fronteira externa | `503` sem fallback ou rede. |
| Persistência inválida | Pagamento com valor divergente rejeitado. |
| Inicialização | Configuração inválida e banco ausente rejeitados. |

### 10.1 Quality gates

| Comando | Resultado |
|---|---|
| `npm run api:test` | PASS - 12/12 |
| `npm run db:test` | PASS - 4/4 |
| `npm run lint` | PASS - zero warnings |
| `npm run typecheck` | PASS |
| `npm test` | PASS - 33/33 |
| `npm run build` | PASS - export Android com 599 módulos |
| Inicialização com banco ausente | PASS da condição negativa - saída 1 e mensagem sanitizada |

O único aviso esperado é o `ExperimentalWarning` de `node:sqlite` no Node 22.

## 11. Rastreabilidade

| Funcionalidade ou requisito | Evidência |
|---|---|
| Backend Node executável | Scripts `api:start` e `api:test`; entrada `server/index.mjs`. |
| Rota de saúde | `GET /health` e teste HTTP real. |
| Catálogo local | `GET /api/products`, SQLite e agrupamento `UX-10`. |
| Biblioteca persistida | `GET /api/users/:userId/library`. |
| Contrato de pagamento | `POST /api/payments` aceita somente `pedidoId`. |
| Valor confiável | Total derivado do pedido e conferido contra seus itens. |
| Pagamento simulado | Gateway local, referência fictícia e estado aprovado. |
| Biblioteca após aprovação | Serviço transacional e teste de persistência. |
| Idempotência | Pagamento único e ausência de itens/chaves duplicados. |
| Segurança | Entrada estrita, SQL parametrizado, erros e logs sanitizados. |
| Mercado Pago | Fronteira substituível e modo externo desabilitado. |
| Reprodutibilidade | SQLite temporário, porta efêmera e comandos npm documentados. |
| Qualidade | Gate formal PASS com score 100/100. |

## 12. Limitações e pendências para a Sprint 2

- autenticação e autorização reais (`HU-12`);
- CRUD administrativo persistente completo (`HU-13`);
- escolha do produto/API do Mercado Pago;
- aplicação cadastrada, credenciais e contas de teste autorizadas (`HU-14`);
- desenho assíncrono com webhook, reconciliação e retentativas;
- reembolso e estorno;
- integração do aplicativo Expo com a API;
- liberação ponta a ponta da biblioteca por resultado externo (`HU-15`);
- política comercial de geração, proteção e entrega de chaves;
- revisão do uso de `node:sqlite` enquanto o módulo permanecer experimental.

## 13. Resultado final

O Prompt 15 entregou um backend Node local, pequeno e executável, com quatro endpoints estritamente necessários e acesso ao SQLite aprovado no Prompt 14. O pagamento simulado valida o pedido, deriva o valor do banco, executa as escritas atomicamente e impede duplicações por idempotência persistida.

A fronteira do Mercado Pago ficou segura e demonstrável: o simulador não exige conta ou segredo, enquanto o modo externo permanece explicitamente indisponível, sem chamada de rede ou resposta simulada apresentada como externa.

O gate formal foi **PASS**, com score **100/100**, os 14 critérios de aceitação foram atendidos e a Story 2.3 foi movida para `Done`.

## 14. Referências internas

- `documentos/PixelVault_Modelo_de_Dados_e_DER.md`;
- `documentos/PixelVault_Script_SQL_e_Banco_Local.md`;
- `docs/stories/2.3.api-node-fronteira-mercado-pago.md`;
- `.ai/decision-log-2.3.md`;
- `server/`;
- `tests/api.test.mjs`;
- `README.md`;
- `.env.example`;
- `docs/evidence/prompt-15/README.md`;
- `docs/qa/gates/2.3-api-node-fronteira-mercado-pago.yml`.

## 15. Checklist do Prompt 15

- [x] Backend Node executável criado.
- [x] Organização mínima do código concluída.
- [x] Rota de saúde implementada.
- [x] Endpoints essenciais implementados e documentados.
- [x] Acesso ao SQLite local implementado.
- [x] Contrato de criação de pagamento definido.
- [x] Modo simulado funcional sem credenciais reais.
- [x] Modo externo desabilitado sem fallback silencioso.
- [x] Transação, rollback e idempotência comprovados.
- [x] Dados financeiros e segredos excluídos do contrato e da persistência.
- [x] Testes HTTP reais aprovados.
- [x] Quality gates aprovados.
- [x] Limitações e pendências registradas para a Sprint 2.
- [x] Gate formal aprovado com 100/100.
