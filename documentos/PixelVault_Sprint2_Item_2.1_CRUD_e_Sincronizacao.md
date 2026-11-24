# PixelVault — Item 2.1: CRUD e integração/sincronização

**Data:** 20/11/2026. **Stories:** 3.1 e 3.2. **Escopo:** cadastro principal de produtos/compatibilidades. **Estado:** implementação concluída; parecer e ressalvas em `docs/qa/gates/3.2-crud-api-sincronizacao.yml`.

**QA:** CONCERNS — 90/100; Story 3.2 Done. Lint, typecheck, 56 testes, builds Android/web e 24 jornadas E2E aprovados. Única ressalva: validação do driver em aparelho/emulador indisponível.

## Entrega

O aplicativo cria, consulta, altera e exclui produtos no SQLite do backend por REST. A persistência local da Story 3.1 foi complementada com uma fila durável de alterações, permitindo envio após indisponibilidade e recuperação depois de reabrir o aplicativo.

| Exigência 2.1 | Implementação verificável |
| --- | --- |
| Criar, ler, atualizar e excluir no banco | Rotas GET/POST/PUT/DELETE de produtos; consultas parametrizadas e transações. |
| Buscar e enviar por REST | Cliente separado das telas; botão Sincronizar catálogo; app/API real exercitados em E2E. |
| Sincronização correta | Fila local, revisões para conflito e recibos persistentes para repetição segura. |
| Continuidade local/offline da aula 07 | SQLite no dispositivo, armazenamento web equivalente e retomada após reload. |

## Contrato e integridade

- `GET /api/products` e `GET /api/products/:id` retornam revisão SHA-256 do conteúdo canônico.
- Escritas exigem `Authorization: Bearer ...`, perfil ADMIN, `operationId` e produto. PUT/DELETE também exigem `baseRevision`.
- Produto: `id`, `name`, `type` (`JOGO`/`DLC`), `priceCents`, `description`, `activationStore` (nome), `cloudPlatforms` (nomes cadastrados).
- Loja é resolvida ou criada na mesma transação; plataformas devem existir e ao menos uma é obrigatória. Exclusões com referências históricas retornam `409 PRODUCT_IN_USE`.
- O recibo é conferido antes da revisão atual, na mesma transação. A mesma operação/ator/corpo recebe o mesmo resultado; reutilização divergente retorna conflito.
- Migração aditiva cria `catalog_operation`; não reinicializa dados existentes. Hashes scrypt substituem somente marcadores conhecidos da seed antiga.

## Uso e resolução de falhas

Entre como administrador com a API disponível, realize o CRUD e pressione **Sincronizar catálogo**. O painel mostra pendências e confirmação do servidor. Sem rede, a fila permanece no dispositivo. Após reabrir ou expirar a sessão, entre novamente e retome o envio.

Conflitos não sobrescrevem outro dispositivo. Após revisar, é possível confirmar **Recarregar versão do servidor**, descartando apenas alterações locais do catálogo e mantendo carrinho/biblioteca. Snapshots 3.1 modificados, sem histórico completo, são preservados para revisão explícita; não se inventam exclusões ou revisões antigas.

## Evidências e limites

Ver `docs/evidence/sprint-2-story-3.2/README.md`: gates, testes de resposta perdida, erro de gravação, reinício, conflito e três jornadas E2E com API real. A revisão arquitetural está em `docs/architecture/project-decisions/3.2-crud-sincronizacao.md`.

A execução do driver SQLite em aparelho/emulador segue como ressalva nativa: nenhum dispositivo estava disponível. Não se apresenta Node/Web como execução móvel. O item 2.1 implementa o CRUD do cadastro principal; autenticação persistente/cadastro real, compra integrada, Mercado Pago, exportação JSON e pitch são entregas separadas. Dashboard foi retirado do escopo pelo usuário.
