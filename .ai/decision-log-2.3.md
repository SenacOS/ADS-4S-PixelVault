# Decision Log 2.3 - API Node e fronteira de pagamento

**Story:** `docs/stories/2.3.api-node-fronteira-mercado-pago.md`  
**Prompt:** 15 - API Node e fronteira do Mercado Pago  
**Decisor:** Aria (`@architect`)  
**Data da decisão:** 15/09/2026  
**Status:** aprovado para implementação do modo simulado; adaptador externo adiado

## 1. Contexto e restrições confirmadas

- A API atende a base técnica `HT-02`; autenticação persistente, CRUD administrativo integrado, integração do aplicativo, webhook e pagamento Mercado Pago ponta a ponta continuam na Sprint 2.
- O SQLite do Prompt 14, com 13 tabelas, é a fonte local. O schema e a seed não devem ser alterados nesta story.
- IDs permanecem textuais e valores monetários permanecem inteiros em centavos.
- `UX-10` é obrigatória: produto, loja de ativação, plataforma cloud e compatibilidade são conceitos distintos.
- A API não recebe, persiste, retorna nem registra número de cartão, nome impresso, CVV, validade, token de cartão ou credencial do provedor.
- O modo padrão e único pronto para demonstração é `simulated`, sem conta, segredo ou rede externa.

## 2. Decisões arquiteturais

### ADR-2.3-01 - Backend mínimo com módulos nativos do Node

**Decisão:** usar `node:http`, `node:sqlite`, `node:crypto` e `node:test`. Não adicionar framework HTTP, ORM ou SDK de pagamento nesta story.

**Motivo:** o projeto já exige Node 22 por causa de `node:sqlite`; quatro rotas não justificam nova dependência. A composição continua CLI-first, pequena e testável.

**Estrutura mínima recomendada:**

```text
server/
  config.mjs                 # ambiente, defaults e validação
  database.mjs               # abertura/fechamento e PRAGMAs
  repositories.mjs           # consultas parametrizadas
  payment-gateway.mjs        # contrato, simulated e unavailable
  payment-service.mjs        # invariantes, transação e biblioteca
  app.mjs                    # roteamento HTTP e serialização JSON
  index.mjs                  # composição e processo CLI
tests/
  api.test.mjs               # HTTP real, porta efêmera e DB temporário
```

Os nomes podem ser ajustados pelo executor, mas as responsabilidades não devem ser misturadas nem multiplicadas sem uso.

### ADR-2.3-02 - Configuração e ciclo de vida

- `API_HOST`: padrão `127.0.0.1`.
- `API_PORT`: padrão `3000`; testes fornecem porta `0` diretamente à composição.
- `PIXELVAULT_DB_PATH`: padrão `database/pixelvault.sqlite`.
- `PAYMENT_MODE`: padrão `simulated`; valores aceitos nesta story: `simulated` e `mercadopago`.
- Modo desconhecido é erro de configuração e encerra o processo com código diferente de zero.
- O processo verifica se o arquivo do banco existe antes de abrir, abre a conexão e confirma as tabelas necessárias. Falha de abertura ou schema incompatível encerra com mensagem sanitizada e código diferente de zero.
- `mercadopago` pode iniciar a API para tornar a indisponibilidade observável, mas `POST /api/payments` sempre responde `503` nesta story. Não há chamada externa, mesmo que uma variável de token exista no ambiente.
- A aplicação exporta fábrica e métodos de início/encerramento para os testes não deixarem processo ou conexão órfãos. `SIGINT` e `SIGTERM` fecham servidor e banco.

Não haverá carregador de `.env`; `.env.example` documenta apenas nomes e valores locais não secretos.

### ADR-2.3-03 - Acesso SQLite

- Uma conexão pertence a uma instância da aplicação.
- Toda conexão executa `PRAGMA foreign_keys = ON` e confirma que o valor ficou ativo.
- Escritas do pagamento simulado usam `BEGIN IMMEDIATE`, `COMMIT` e `ROLLBACK` explícitos.
- Entradas são usadas somente em statements parametrizados.
- Leituras têm ordenação explícita; não se depende da ordem física do SQLite.
- O banco temporário dos testes é inicializado a partir dos mesmos `schema.sql` e `seed.sql` do Prompt 14.

### ADR-2.3-04 - Envelope de erro uniforme

Toda falha HTTP usa JSON e não inclui stack trace, SQL, caminho local, corpo recebido, header ou segredo:

```json
{
  "error": {
    "code": "PEDIDO_NOT_FOUND",
    "message": "Pedido não encontrado."
  }
}
```

O `code` é estável para testes; `message` é uma descrição segura. Erros inesperados viram `500 INTERNAL_ERROR`. Rota inexistente usa `404 ROUTE_NOT_FOUND`; método incorreto em rota conhecida usa `405 METHOD_NOT_ALLOWED` e header `Allow`.

## 3. Contratos HTTP exatos

Todas as respostas usam `Content-Type: application/json; charset=utf-8`.

### 3.1 `GET /health`

**Resposta `200`, modo padrão:**

```json
{
  "status": "ok",
  "paymentMode": "simulated",
  "paymentAvailable": true
}
```

Quando `PAYMENT_MODE=mercadopago`, o serviço local permanece acessível, mas declara `paymentAvailable: false`. A rota não consulta rede externa e não expõe caminho do banco ou configuração sensível.

### 3.2 `GET /api/products`

**Resposta `200`:**

```json
{
  "products": [
    {
      "id": "orbit-raiders",
      "name": "Orbit Raiders",
      "type": "JOGO",
      "priceCents": 7990,
      "description": "Descrição demonstrativa.",
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

O texto real de `description` vem do banco. Produtos são ordenados por `produto.nome` e `produto.id`; plataformas dentro de cada produto, por `plataforma_cloud.nome` e `plataforma_cloud.id`, com comparação determinística. O agrupamento é feito pelo ID do produto para nunca duplicá-lo por plataforma. Falha de leitura usa `500 INTERNAL_ERROR`.

### 3.3 `GET /api/users/:userId/library`

`userId` é decodificado uma vez e tratado como identificador opaco. É inválido se vazio, maior que 128 caracteres, contiver caractere de controle ou tiver escape percentual inválido.

**Resposta `200` para usuário existente, inclusive com biblioteca vazia:**

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

`activationKey` é `null` quando não existir. Itens são ordenados por nome e ID do produto. Respostas de falha: `400 INVALID_USER_ID`, `404 USER_NOT_FOUND` e `500 INTERNAL_ERROR`. A rota não autentica nem autoriza; essa limitação deve estar no README e impede exposição fora do ambiente local de demonstração.

### 3.4 `POST /api/payments`

Requer `Content-Type: application/json` e corpo estrito:

```json
{ "pedidoId": "pedido-demo-001" }
```

O objeto deve conter exatamente `pedidoId`. O identificador segue a mesma validação de ID da rota de biblioteca. Campo adicional é rejeitado; se representar dado financeiro ou credencial, o código é `FORBIDDEN_PAYMENT_DATA`. O corpo possui limite de 16 KiB.

**Resposta `201` quando o pagamento é criado:**

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

**Resposta `200` quando o pagamento já existe:** mesmo formato e mesmos valores persistidos, sem nova execução do gateway, novo pagamento, novo item de biblioteca ou nova chave.

O servidor ignora qualquer total do cliente porque tal campo é rejeitado. O valor vem de `pedido.total_centavos` depois de confirmar que há ao menos um `item_pedido` e que a soma de `preco_unitario_centavos` coincide exatamente com o total.

Falhas estáveis:

| HTTP | Código | Condição |
|---:|---|---|
| `400` | `INVALID_JSON` | JSON malformado. |
| `400` | `INVALID_BODY` | Corpo ausente, não objeto ou sem `pedidoId`. |
| `400` | `INVALID_PEDIDO_ID` | Identificador inválido. |
| `400` | `UNSUPPORTED_FIELD` | Campo adicional não financeiro. |
| `400` | `FORBIDDEN_PAYMENT_DATA` | Campo financeiro, token ou credencial recebido. |
| `404` | `PEDIDO_NOT_FOUND` | Pedido não existe. |
| `409` | `EMPTY_ORDER` | Pedido não possui itens. |
| `409` | `ORDER_TOTAL_MISMATCH` | Soma dos snapshots diverge do pedido. |
| `409` | `PAYMENT_VALUE_MISMATCH` | Pagamento existente diverge do total do pedido. |
| `413` | `BODY_TOO_LARGE` | Corpo excede 16 KiB. |
| `415` | `UNSUPPORTED_MEDIA_TYPE` | Tipo do corpo não é JSON. |
| `503` | `PAYMENT_MODE_NOT_CONFIGURED` | Modo Mercado Pago solicitado sem configuração autorizada completa. |
| `503` | `PAYMENT_MODE_NOT_IMPLEMENTED` | Modo Mercado Pago solicitado nesta versão. |
| `500` | `INTERNAL_ERROR` | Falha inesperada sanitizada. |

## 4. Serviço, transação e idempotência

O contrato interno do gateway é independente de HTTP e SQLite:

```text
createPayment({ pedidoId, valorCentavos, idempotencyKey })
  -> { status, externalReference }
```

- `SimulatedPaymentGateway` não usa rede nem segredo, retorna `APROVADO` e referência iniciada por `FICTICIA-SIMULADA-`.
- `UnavailableMercadoPagoGateway` sempre lança erro tipado de configuração/implementação e jamais recorre ao simulador.
- A chave interna é derivada de `pedidoId`, sem conter dados pessoais. O futuro adaptador externo deverá mapeá-la para o mecanismo oficial de idempotência do produto então aprovado.

Fluxo atômico do modo simulado:

1. `BEGIN IMMEDIATE`.
2. Localizar pedido e itens; validar pedido não vazio e soma igual ao total.
3. Procurar pagamento pelo `pedido_id`.
4. Se existir, validar valor, reler biblioteca e devolver o registro sem invocar o gateway.
5. Se não existir, invocar apenas o gateway local e inserir um único pagamento com o valor derivado.
6. Somente para `APROVADO`, localizar ou criar a biblioteca, inserir uma aquisição por item e uma chave inequivocamente fictícia por nova aquisição.
7. Confirmar que os estados pertencem a `PENDENTE`, `APROVADO`, `RECUSADO` ou `ERRO` e executar `COMMIT`.
8. Em qualquer falha, executar `ROLLBACK` e propagar erro sanitizável.

As constraints únicas de `pagamento.pedido_id`, `(biblioteca_id, produto_id)`, `item_biblioteca.item_pedido_id` e chave são a última linha de defesa contra duplicidade. Conflito inesperado não é tratado como sucesso sem reler e validar o estado persistido.

Essa transação pode envolver o gateway porque o adaptador simulado é local e síncrono. **Um futuro adaptador de rede não poderá manter uma transação SQLite aberta durante a chamada externa**; ele exigirá fluxo persistido por estados, reconciliação/webhook e desenho próprio na Sprint 2.

## 5. Fronteira do Mercado Pago

### 5.1 Fontes oficiais consultadas

Consulta realizada em **15/09/2026**, somente em páginas oficiais do Mercado Pago:

1. [Criar order - Checkout API](https://www.mercadopago.com.br/developers/en/reference/online-payments/checkout-api/create-order/post): `POST /v1/orders`, Bearer Access Token, `X-Idempotency-Key`, resposta `201` e erros da operação.
2. [Possíveis erros - Checkout API Orders](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-management/integration-errors): erros de validação, credenciais, idempotência, bloqueio e limite de requisições.
3. [Credenciais](https://www.mercadopago.com.br/developers/pt/docs/qr-code-ca/resources/credentials): distinção geral entre credenciais de teste e produção e Access Token restrito ao backend.
4. [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/test-accounts): papéis de vendedor/comprador e dados próprios para teste.
5. [Mantenha suas credenciais seguras](https://www.mercadopago.com.br/developers/pt/docs/yampi/best-practices/credentials-best-practices/secure-credentials): token somente em header/backend e nunca exposto publicamente.

### 5.2 Conclusão da pesquisa

A API de Orders é apenas **candidata para análise da fronteira futura**, não uma escolha de integração desta story. A referência oficial consultada exige `Authorization` e `X-Idempotency-Key`, mas também informa regras de sandbox/credenciais específicas para essa operação que diferem da orientação geral sobre credenciais de teste. Portanto, a documentação específica do produto deverá prevalecer após o grupo decidir modalidade de checkout e meio de pagamento.

Faltam hoje: decisão de produto/API do Mercado Pago, fluxo de captura no cliente, aplicação cadastrada, credenciais explicitamente autorizadas, contas/dados de teste compatíveis e contrato assíncrono de retorno. Implementar um payload externo agora exigiria inventar requisitos e poderia usar credenciais incorretas.

Consequentemente:

- nenhuma chamada a `api.mercadopago.com` será feita;
- nenhum SDK Mercado Pago será instalado;
- nenhum campo/header do provedor será exposto no contrato público local;
- `MERCADO_PAGO_ACCESS_TOKEN` pode aparecer apenas como nome vazio em `.env.example`, acompanhado de aviso de que não é usado nesta versão;
- valor real nunca será colocado em arquivo, fixture, banco, resposta ou log;
- modo `mercadopago` falha explicitamente com `503`, sem resposta simulada disfarçada de externa.

## 6. Segurança e observabilidade

- Bind padrão somente em loopback; exposição em rede exige decisão futura, pois as rotas não possuem autenticação.
- Log mínimo: identificador local da requisição, método, pathname normalizado, status e duração. Nunca registrar query completa, headers, body, stack em resposta, caminho do banco, Access Token ou chave de ativação.
- Não registrar o corpo de `POST /api/payments`, inclusive em falhas de parsing.
- Rejeitar dados financeiros antes de chamar serviço ou banco; os testes inspecionam resposta, logs capturados e arquivo SQLite.
- A chave de ativação é retornada somente pela biblioteca local e é marcada `fictional: true`; continua sensível do ponto de vista funcional e não entra em logs.
- Sem CORS nesta story, pois o aplicativo Expo não consome a API.

## 7. Critérios arquiteturais para handoff

A implementação pode avançar quando preservar:

- quatro rotas e contratos deste log;
- zero rede no modo padrão e zero fallback silencioso;
- banco temporário e porta efêmera nos testes;
- FK ativa em cada conexão, statements parametrizados e ordenação determinística;
- transação e idempotência demonstradas por estado persistido, não por cache em memória;
- ausência de dados financeiros/segredos em entrada aceita, persistência, respostas e logs;
- pendências externas documentadas sem alegar integração Mercado Pago concluída.

## 8. Rastreabilidade

| Decisão | Origem |
|---|---|
| API Node inicial executável | `HT-02`; Story 2.3 AC 1-4 e 11. |
| Catálogo e biblioteca | Prompt 12; Story 2.3 AC 3-4. |
| Valor derivado, pagamento único e biblioteca após aprovação | Prompts 13-14; Story 2.3 AC 5-7. |
| Adaptador substituível e modo simulado | Prompt 15; Story 2.3 AC 6, 8 e 9. |
| Sem cartão ou segredo | Prompts 12-14; Story 2.3 AC 5, 10 e 11. |
| Mercado Pago homologado adiado | `HU-14`, `HU-15`; Story 2.3 AC 12. |

