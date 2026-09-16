# Histórico de desenvolvimento e evidências acadêmicas

Este documento preserva a rastreabilidade das entregas orientadas por prompts que antes ocupava o `README.md`. O README principal passou a apresentar apenas o estado atual do produto, a configuração do ambiente e o fluxo necessário para novos desenvolvedores.

## Mapa das entregas

| Referência | Escopo entregue | Artefatos principais |
| --- | --- | --- |
| Prompt 11 | Interfaces navegáveis, estados visuais e evidências responsivas | `src/`, `docs/evidence/prompt-11/` |
| Prompt 12 | Interações em memória, formulários, filtro, carrinho, checkout, biblioteca e CRUD | `src/`, `tests/prototype-interactions.test.mjs`, `docs/evidence/prompt-12/` |
| Prompt 14 | Modelo relacional e banco SQLite local recriável | `database/schema.sql`, `database/seed.sql`, `scripts/init-db.mjs` |
| Prompt 15 | API Node local e fronteira simulada de pagamento | `server/`, `tests/api.test.mjs` |

## Prompt 11 — interfaces e evidências

O aplicativo inicia em `WF-01`. A navegação local usa `Pressable` e estado React, sem roteador ou estado global. Os dados da jornada ficam centralizados em `src/data/pixelVaultData.js`; parâmetros como `?screen=wf03` existem somente no runtime web para capturas reproduzíveis.

```powershell
npm run web
npm run evidence:capture
```

O segundo comando exporta a versão web, abre o Chrome headless local e gera uma matriz de 27 imagens em `docs/evidence/prompt-11/`. O README dessa pasta registra viewports, diferenças em relação aos wireframes, contraste, foco acessível, escala de fonte a 130% e limitações encontradas.

A inspeção com teclado virtual nativo ficou pendente porque não havia dispositivo ou emulador conectado ao ADB. Nenhum resultado nativo foi simulado.

## Prompt 12 — interações e experiência de uso

Esta entrega tornou alcançáveis por interações reais em memória as cinco áreas da demonstração. Foram incluídos formulários, filtro, carrinho, checkout simulado, biblioteca e CRUD administrativo.

O estado reinicia ao recarregar. O catálogo é compartilhado entre jogador e administrador; carrinho, pedido e biblioteca preservam os mesmos identificadores, e o checkout de dois itens totaliza `R$ 104,80`.

Naquele estágio, não havia API, persistência, autenticação ou pagamento real. O banco e a API foram acrescentados nas entregas posteriores e continuaram desacoplados da interface.

### Acesso demonstrativo

- Jogador: `jogador@pixelvault.example`
- Administrador: `admin@pixelvault.example`
- Senha para ambos: `demo123`

Também é possível usar os botões de preenchimento antes de tocar em `Entrar`.

### Responsividade e acessibilidade

As validações usaram orientação retrato nas referências `390 × 844 px`, `360 px` de largura e `320 × 568 px`, além de fonte a `130%`.

A continuidade deve preservar `RESP-01` a `RESP-16`: ausência de rolagem horizontal, uma coluna no menor viewport, quebra controlada, respeito à área segura, rolagem vertical, navegação sem sobreposição, texto sem truncamento, alvos de toque mínimos de `44 × 44 dp`, formulários acessíveis com teclado, rótulos visíveis e estados que não dependam somente de cor.

Também permanecem relevantes `COR-01` a `COR-06`, `UXT-01` a `UXT-14`, `WF-01` a `WF-11` e `ST-01` a `ST-05`.

### Captura das evidências

```powershell
npm run evidence:capture:prompt12
```

O comando executa 21 jornadas reais no Chrome CDP e grava a matriz `UXT-01..14` em `docs/evidence/prompt-12/README.md`. A validação nativa de `UXT-14` continua pendente enquanto não houver dispositivo conectado ao ADB.

## Prompt 14 — modelo SQL e banco local

O modelo funciona por CLI e não está conectado ao aplicativo Expo. Ele requer Node.js `>=22.5`, pois o inicializador e os testes usam o módulo experimental nativo `node:sqlite`; nenhuma dependência externa foi adicionada.

Os arquivos `database/schema.sql` e `database/seed.sql` são as fontes versionáveis. `database/pixelvault.sqlite` é um artefato binário local, recriável e ignorado pelo Git.

```powershell
npm ci
npm run db:init
npm run db:test
```

`npm run db:init` monta esquema e seed em arquivo intermediário, valida as chaves estrangeiras e substitui somente `database/pixelvault.sqlite`. O comando pode ser repetido para recriar a mesma massa fictícia.

### Inspeção manual

Com SQLite CLI `3.44.4` ou compatível:

```powershell
sqlite3 database/pixelvault.sqlite ".tables"
sqlite3 database/pixelvault.sqlite ".schema"
sqlite3 database/pixelvault.sqlite "PRAGMA foreign_key_check;"
sqlite3 -header -column database/pixelvault.sqlite "SELECT p.nome, pc.nome AS plataforma FROM produto p JOIN compatibilidade_produto cp ON cp.produto_id = p.id JOIN plataforma_cloud pc ON pc.id = cp.plataforma_cloud_id ORDER BY p.nome, pc.nome;"
sqlite3 -header -column database/pixelvault.sqlite "SELECT p.id, COUNT(ip.id) AS quantidade, p.total_centavos, SUM(ip.preco_unitario_centavos) AS soma_itens FROM pedido p JOIN item_pedido ip ON ip.pedido_id = p.id GROUP BY p.id, p.total_centavos;"
sqlite3 -header -column database/pixelvault.sqlite "SELECT p.nome AS produto, la.nome AS loja, ca.codigo AS chave FROM item_biblioteca ib JOIN produto p ON p.id = ib.produto_id JOIN loja_ativacao la ON la.id = p.loja_ativacao_id JOIN chave_ativacao ca ON ca.item_biblioteca_id = ib.id ORDER BY p.nome;"
```

As regras que cruzam tabelas — produto com compatibilidade, total igual à soma dos itens, pagamento com o mesmo valor do pedido e biblioteca somente após aprovação — passaram a ser invariantes transacionais usadas pela API da etapa seguinte.

Não foram criados triggers, integração com `expo-sqlite`, autenticação persistente ou conexão do aplicativo com o banco.

## Prompt 15 — API Node e fronteira de pagamento

Esta entrega adicionou uma API demonstrativa feita somente com módulos nativos do Node.js. Ela usa o SQLite criado no Prompt 14 e permanece desacoplada do aplicativo Expo.

```powershell
npm ci
npm run db:init
npm run api:start
```

Por padrão, a API fica disponível em `http://127.0.0.1:3000`. As variáveis aceitas são `API_HOST`, `API_PORT`, `PIXELVAULT_DB_PATH` e `PAYMENT_MODE`; consulte `.env.example`.

O projeto não carrega `.env` automaticamente. `PAYMENT_MODE` aceita `simulated`, que é o padrão, ou `mercadopago`. O segundo modo sempre devolve `503` em pagamentos; nenhum token, SDK ou serviço externo é usado.

### `GET /health`

```powershell
curl.exe -i http://127.0.0.1:3000/health
```

Resposta `200` no modo padrão:

```json
{
  "status": "ok",
  "paymentMode": "simulated",
  "paymentAvailable": true
}
```

### `GET /api/products`

```powershell
curl.exe -i http://127.0.0.1:3000/api/products
```

A resposta `200` usa a seed do Prompt 14 e preserva produtos, loja de ativação e plataformas cloud:

```json
{
  "products": [
    {
      "id": "neon-expansion",
      "name": "Neon Expansion",
      "type": "DLC",
      "priceCents": 2490,
      "description": "Expansão demonstrativa para a jornada visual do PixelVault.",
      "activationStore": {
        "id": "loja-demo",
        "name": "Loja de demonstração (fictícia)"
      },
      "cloudPlatforms": [
        { "id": "geforce-now", "name": "GeForce NOW" }
      ]
    },
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

### `GET /api/users/:userId/library`

Esta rota não possui autenticação ou autorização e deve permanecer restrita à demonstração local.

```powershell
curl.exe -i http://127.0.0.1:3000/api/users/player-demo/library
```

Uma resposta `200` pode conter os itens da biblioteca com produto, loja e chave fictícia. Um usuário existente sem aquisições recebe `200` e `items: []`.

```json
{
  "userId": "player-demo",
  "items": [
    {
      "id": "item-biblioteca-neon-001",
      "product": {
        "id": "neon-expansion",
        "name": "Neon Expansion",
        "type": "DLC"
      },
      "activationStore": {
        "id": "loja-demo",
        "name": "Loja de demonstração (fictícia)"
      },
      "activationKey": {
        "code": "PV-NEON-DEMO-CHAVE-FICTICIA",
        "fictional": true
      }
    },
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

Para um usuário inexistente:

```powershell
curl.exe -i http://127.0.0.1:3000/api/users/unknown/library
```

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Usuário não encontrado."
  }
}
```

A resposta é `404`.

### `POST /api/payments`

A entrada aceita contém exclusivamente `pedidoId`:

```powershell
curl.exe -i -X POST http://127.0.0.1:3000/api/payments -H "Content-Type: application/json" -d '{"pedidoId":"pedido-demo-001"}'
```

Após `npm run db:init`, o pagamento fictício já existe na seed. A chamada reproduzível retorna `200` e reutiliza o registro:

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

Para um pedido válido ainda sem pagamento, a criação retorna `201`; `paymentId` é gerado, `referencia` começa com `FICTICIA-SIMULADA-` e uma repetição retorna `200` com os mesmos valores persistidos. O servidor sempre deriva o valor de `pedido.total_centavos`.

Totais enviados pelo cliente e outros dados financeiros são rejeitados com `400`:

```powershell
curl.exe -i -X POST http://127.0.0.1:3000/api/payments -H "Content-Type: application/json" -d '{"pedidoId":"pedido-demo-001","totalCentavos":10480}'
```

```json
{
  "error": {
    "code": "FORBIDDEN_PAYMENT_DATA",
    "message": "Dados financeiros ou credenciais não são aceitos."
  }
}
```

Número de cartão, nome impresso, CVV, validade, token e credenciais também são rejeitados. Com `PAYMENT_MODE=mercadopago`, a operação retorna `503 PAYMENT_MODE_NOT_IMPLEMENTED`, sem chamada externa ou fallback simulado.

```powershell
npm run api:test
npm test
```

A etapa posterior prevista deve tratar integração do aplicativo, autenticação e autorização, CRUD persistente, Mercado Pago em ambiente de teste, webhook, reconciliação, retentativas e política comercial de chaves.

## Registros operacionais das entregas

- Em ambiente com rede restrita, `npx expo install` falhou com `TypeError: fetch failed`. A execução funcionou após liberar acesso ao registro; em uma estação comum, é necessário confirmar proxy, firewall ou usar uma rede autorizada.
- `npx expo-doctor` também depende de rede ou cache quando ainda não está disponível localmente. Após a liberação de acesso, os 18 checks passaram.
- O Expo rejeita `--offline` e `--localhost` no mesmo comando. Para evidências locais foi usado `npx expo start --offline --port 8099`, que alcançou o estado `Metro waiting` e encerrou normalmente com `Ctrl+C`.
- A instalação reportou que o ESLint 9 selecionado pelo fluxo oficial do Expo está fora da janela de suporte indicada, mas permaneceu compatível com `eslint-config-expo` 10 e o gate executou sem erros. Uma atualização maior deve acompanhar uma futura migração de SDK.
- Na validação registrada, `npm audit` reportou 16 vulnerabilidades transitivas, sendo 7 moderadas e 9 altas, todas na árvore do Expo/Metro do SDK 54. A correção sugerida exigia atualização incompatível para Expo 57; por isso, nenhum `npm audit fix --force` foi aplicado.
