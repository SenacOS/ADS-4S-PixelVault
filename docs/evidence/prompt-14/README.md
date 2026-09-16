# Evidências do Prompt 14 — SQLite local

Data da execução: 14/09/2026.

## Ambiente e procedimento

- Node.js: `v22.18.0`
- npm: `11.5.2`
- SQLite CLI: `3.44.4`
- Executor do banco: `node:sqlite`, sem dependência npm adicional

O comando `npm run db:init` foi executado duas vezes. Ambas as execuções terminaram com exit code `0` e recriaram `database/pixelvault.sqlite` exclusivamente a partir de `database/schema.sql` e `database/seed.sql`. O inicializador habilitou FKs, validou `PRAGMA foreign_key_check` e substituiu apenas o arquivo-alvo depois da montagem bem-sucedida.

## Resultados observados

`SELECT COUNT(*) ... FROM sqlite_master` retornou `13`. `PRAGMA foreign_key_check` não retornou linhas.

Consulta de catálogo e compatibilidade:

```text
produto         plataforma
--------------  -----------
Neon Expansion  GeForce NOW
Orbit Raiders   Boosteroid
Orbit Raiders   GeForce NOW
```

Consulta de pedido e pagamento:

```text
id               quantidade  total_centavos  soma_itens  status    valor_centavos
---------------  ----------  --------------  ----------  --------  --------------
pedido-demo-001  2           10480           10480       APROVADO  10480
```

Consulta de biblioteca:

```text
produto         loja                             chave
--------------  -------------------------------  ----------------------------
Neon Expansion  Loja de demonstração (fictícia)  PV-NEON-DEMO-CHAVE-FICTICIA
Orbit Raiders   Loja de demonstração (fictícia)  PV-ORBIT-DEMO-CHAVE-FICTICIA
```

A seed manteve `item_carrinho` com zero registros. Os testes inseriram um item válido em banco isolado e comprovaram a rejeição de e-mail duplicado, papel inválido, tipo e preço inválidos, item duplicado no carrinho, FK inexistente, segundo pagamento do pedido, item duplicado na biblioteca e código de chave repetido.

## Quality gates

| Comando | Resultado observado |
|---|---|
| `npm run db:init` (duas execuções) | aprovado; exit code 0 nas duas |
| `npm run db:test` | 4/4 testes aprovados |
| `npm run lint` | aprovado; zero warnings |
| `npm run typecheck` | aprovado |
| `npm test` | 21/21 testes aprovados |
| `npm run build` | aprovado; export Android em `dist/` |

## Consultas manuais

Os comandos completos de `.tables`, `.schema`, `PRAGMA foreign_key_check` e das três consultas demonstrativas estão no `README.md` da raiz.

## Decisões e limitações

- `item_pedido.id` é PK textual e `(pedido_id, produto_id)` permanece `UNIQUE`, conforme a Story 2.2.
- `item_biblioteca.id` é um identificador técnico textual usado pela FK simples `chave_ativacao.item_biblioteca_id`; a unicidade lógica `(biblioteca_id, produto_id)` foi preservada.
- As quatro invariantes que cruzam tabelas permanecem para a transação da camada de serviço do Prompt 15; não foram criados triggers.
- O Node 22.18.0 ainda emite `ExperimentalWarning` ao carregar `node:sqlite`; isso não afetou os resultados.
- O banco não foi integrado ao Expo e nenhuma API, autenticação persistente ou integração de pagamento foi adicionada.
