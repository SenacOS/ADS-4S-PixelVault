# Histórico de desenvolvimento e evidências acadêmicas

## Sprint 2 — Story 3.8 / Integração visual das versões (21/11/2026)

Identidade branca e ouro fosco integrada seletivamente de `C:/PI4/ADS-4S-PixelVault`, com foco, estados de botões, banners e navegação adaptados à base funcional atual. Marcadores WF/ST e atalhos de preenchimento de perfis foram retirados da interface. Os 32 produtos, capas, persistência, API, outbox, JSON e Checkout Pro de teste foram preservados. A validação de contraste identificou a necessidade de usar ouro escuro na borda da ação primária, mantendo o preenchimento ouro. Evidências novas usam o sufixo `visual-3.8`; não substituem as rodadas anteriores. Relatório da story 3.7 preservado em `documentos/historico/story-3.7/` antes de atualizar a apresentação atual.

## Sprint 2 — Story 3.7 / Documentação da segunda entrega (21/11/2026)

Consolidação em `documentos/PixelVault_Relatorio_Final_Sprint2.docx` e PDF de mesmo nome, derivados do relatório original da Sprint 1, preservado sem alteração. Incluídos itens 2.1–2.8, status/comunicação/Review/Retrospectiva, encerramento/lições, roteiro de vídeo de 9 minutos, testes, telas e trechos atuais de código. Quatro documentos complementares detalham o fechamento. As métricas acumuladas são 16/17 itens e 48/53 SP; HU-12 permanece aberta. Vídeo, pacote único e submissão são tarefas posteriores. Evidências documentais em `docs/evidence/sprint-2-story-3.7/` e parecer no gate 3.7. Os registros abaixo mantêm seu significado histórico.

## Sprint 2 — Story 3.4 / QA antes do pagamento (20/11/2026)

Nova rodada completa de botões/campos, teclado, negativos, API e downloads. Regressões reproduzidas em cadastro, centavos/limites e descrição multilinha foram corrigidas e receberam testes permanentes. Cadastro efêmero agora tem modo local explícito, sem credencial de servidor. Matriz e resultados em `docs/evidence/qa-full/README.md`; pagamento Mercado Pago permanece não implementado, para discussão posterior com o usuário.

## Sprint 2 — Story 3.3 / Item 2.2 (20/11/2026)

Botão de exportação JSON no catálogo/admin, com catálogo e dados locais somente da conta ativa, formato versionado e centavos. Download web e preparação/compartilhamento nativo, sem dashboard, credenciais ou chaves de ativação. Artefato: `documentos/PixelVault_Sprint2_Item_2.2_Exportacao_JSON.md`; provas e limites: `docs/evidence/sprint-2-story-3.3/README.md`.

## Sprint 2 — Story 3.2 / Item 2.1 (20/11/2026)

CRUD REST de produtos/compatibilidades integrado às telas e sincronização durável entregues. Escritas exigem ADMIN autenticado no backend; recibos e revisões protegem contra repetição e conflito. Fila offline sobrevive a reload e é retomada após login. Migração preserva dados anteriores. Artefato: `documentos/PixelVault_Sprint2_Item_2.1_CRUD_e_Sincronizacao.md`; provas: `docs/evidence/sprint-2-story-3.2/README.md`. A validação do driver em aparelho continua separada e pendente, sem ampliar a conclusão para compra ou autenticação persistente.

## Sprint 2 — Story 3.1 (20/11/2026)

O aplicativo passou a persistir catálogo e dados demonstrativos por conta no dispositivo, com `expo-sqlite` no Android/iOS e adaptador `localStorage` na web. A integração inicial consome somente `GET /api/products`, com cache, timeout e proteção de alterações administrativas locais. Cadastro, login, envio de CRUD e pagamento externo seguem para as próximas stories.

O banco relacional do servidor foi preservado; o cache móvel é independente. O relatório da Sprint 1 permanece como histórico e a evolução está em `documentos/PixelVault_Sprint2_Persistencia_Local_Integracao_Catalogo.md`. Evidências e limitações nativas: `docs/evidence/sprint-2-story-3.1/README.md`. Dashboard foi retirado do escopo pelo usuário e o pitch será em vídeo.

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

### 21/11/2026 — 30 novos jogos e capas locais (story3.6)

Adicionados30 jogos fictícios, preservando os dois originais: base32 itens,31JOGO e1DLC. Criadas32 capas originais de pixel art PNG768×432 e uma imagem genérica, empacotadas no app. O componente exibe capa acessível com proporção16:9, fallback e recuperação; detalhes passam a mostrar descrição e catálogo informa quantidade encontrada. Dados e compatibilidades permanecem exemplos acadêmicos.

A fonte JSON compartilhada alimenta cliente e bootstrap. Migrações aditivas de banco e cache respeitam IDs editados, exclusões posteriores, contas e outbox; nenhum banco foi recriado. O banco de trabalho foi efetivamente ampliado2→32 e os dados protegidos permaneceram idênticos, sem FKs inválidas ou duplicação na segunda abertura. Novos testes cobrem PNGs, rollback, IDs personalizados, cachesv1/v2 e DELETE pendente. A verificação web percorre32 imagens/títulos e compara todos os campos entre manifesto, cache e API; fixtures antigas de dois itens são explicitamente isoladas.

Documentação: [catálogo ampliado e capas](../documentos/PixelVault_Catalogo_Expandido_e_Capas_Locais.md). Resultados finais e capturas: `docs/evidence/sprint-2-story-3.6/README.md`. Sem nova compra, alteração de credenciais ou produção.

### 21/11/2026 — compra externa de teste aprovada e biblioteca restaurada

O usuário concluiu a compra hospedada de teste solicitada. `npm run checkout:smoke` reconciliou APROVADO; uma consulta independente do gateway à API oficial confirmou pagamento 190842627252, pedido a30a0a1b-88b6-4927-99a2-dc6c2d78e330 e 10480 centavos, com vendedor/comprador/metadados/BRL válidos. Três reconciliações não duplicaram pagamento, itens ou chaves. Outro usuário não acessou o pedido e recebeu biblioteca remota vazia.

O estado persistiu após reiniciar o servidor/login. Um teste adicional com Expo Web+Chrome e a API/banco da compra real, sem adaptador simulado, confirmou biblioteca com Neon Expansion/Orbit Raiders antes e depois de reinício da API, reload/relogin e atualização explícita. A seed já continha itens/chaves demonstrativos: a aquisição remota reutilizou esses registros, sem duplicar; inserção nova/rollback seguem comprovados pelos contratos automatizados.

Não houve mudança no código de produto, nova compra enviada pelos scripts ou ativação de produção. Evidências sanitizadas em `docs/evidence/sprint-2-story-3.5/mercadopago-approved.json`, `mercadopago-approved-app-restore.json` e captura associada. Story encaminhada novamente ao QA; validação nativa continua pendente.

### 20/11/2026 — implementação do Checkout Pro exclusivamente de teste (story 3.5)

Após preparar a story por @sm e a decisão técnica por @architect, as credenciais de teste foram configuradas privadamente no backend e a identidade do vendedor foi validada em `/users/me` como MLB/test_user. Implementados pedido autenticado com totais do servidor, preferência via Preferences API, recuperação por referência após resposta perdida, reconciliação autenticada e concessão atômica/idempotente. O app prepara o resumo remoto, abre checkout externo e consulta o pagamento; cartão não passa pelo PixelVault. Dados internos de retomada ficam isolados por conta e fora do JSON.

A revisão de QA identificou e motivou proteção da rota legada de biblioteca, bloqueio de aprovação simulada de pedido remoto mesmo após alternar modo e correções de retomada/cache sem perfil. A preferência real de teste foi criada e recuperada pela API oficial, e consultada como PENDENTE, sem enviar pagamento. Compra externa aprovada e dispositivo ainda precisam de validação; a story não é declarada concluída por esses testes parciais. Resultados, comandos e limitações: [implementação Mercado Pago](../documentos/PixelVault_Mercado_Pago_Checkout_Teste.md) e evidências da story 3.5.

Os exemplos antigos de biblioteca e `PAYMENT_MODE=mercadopago` neste histórico descrevem entregas anteriores: agora a biblioteca legada exige sessão do dono e os pedidos remotos utilizam `/api/checkouts`, conforme o contrato atual acima.

### 20/11/2026 — preparação do Mercado Pago para uso acadêmico

Após a QA da story 3.4, foram tentadas as instalações do marketplace/plugin do Mercado Pago, sem sucesso: repositório GitHub indisponível (HTTP 404) e plugin não encontrado. A alternativa executada foi cadastrar diretamente o MCP oficial com `codex mcp add mercadopago --url https://mcp.mercadopago.com/mcp`. A autenticação OAuth foi concluída pelo usuário e, após reiniciar o Codex, a conexão foi validada por consultas à documentação e à lista de aplicações.

O usuário escolheu Checkout Pro e autorizou criar o **PixelVault**, com plataforma própria e finalidade exclusivamente acadêmica e de testes. A criação foi confirmada pelo Mercado Pago, que também informou a geração automática dos recursos de vendedor/comprador de teste e da aplicação do vendedor de teste.

Identificadores, sequência, decisões, limites e próximos passos estão no [histórico de configuração do Mercado Pago](../documentos/PixelVault_Mercado_Pago_Historico_Configuracao.md). Nenhuma credencial foi adicionada ao projeto. Não houve ativação de produção, pagamento ou compra de teste, alteração de código, configuração de webhook ou conclusão da integração: o gateway continua simulado. Este registro documenta a preparação externa e não altera o escopo concluído da story 3.4.

- Em ambiente com rede restrita, `npx expo install` falhou com `TypeError: fetch failed`. A execução funcionou após liberar acesso ao registro; em uma estação comum, é necessário confirmar proxy, firewall ou usar uma rede autorizada.
- `npx expo-doctor` também depende de rede ou cache quando ainda não está disponível localmente. Após a liberação de acesso, os 18 checks passaram.
- O Expo rejeita `--offline` e `--localhost` no mesmo comando. Para evidências locais foi usado `npx expo start --offline --port 8099`, que alcançou o estado `Metro waiting` e encerrou normalmente com `Ctrl+C`.
- A instalação reportou que o ESLint 9 selecionado pelo fluxo oficial do Expo está fora da janela de suporte indicada, mas permaneceu compatível com `eslint-config-expo` 10 e o gate executou sem erros. Uma atualização maior deve acompanhar uma futura migração de SDK.
- Na validação registrada, `npm audit` reportou 16 vulnerabilidades transitivas, sendo 7 moderadas e 9 altas, todas na árvore do Expo/Metro do SDK 54. A correção sugerida exigia atualização incompatível para Expo 57; por isso, nenhum `npm audit fix --force` foi aplicado.
