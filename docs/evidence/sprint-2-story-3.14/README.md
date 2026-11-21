# Story3.14 — catálogo completo na seed SQL

A seed anterior continha2 produtos; os outros30 eram carregados de `src/data/catalogExpansion.json` pelo inicializador e pela migração da API. Agora `database/seed.sql` inclui os30 jogos adicionais e40 associações de compatibilidade, além dos dados originais:32 produtos (31 jogos e1 DLC),43 associações.

`scripts/init-db.mjs` executa apenas schema e seed para criar o catálogo; foi removida a chamada redundante à expansão JavaScript. O JSON continua necessário ao cache do app e à migração de bancos antigos, cujas implementações foram preservadas.

## Validação

- Novo teste executa somente `schema.sql` + `seed.sql` em SQLite em memória:32 produtos,31 jogos,1 DLC e zero violações de FK.
- Verificados os30 IDs, nomes, tipos, preços em centavos, descrições, loja e compatibilidades contra o JSON.
- Executar a migração após a seed completa insere0 produtos e mantém32 itens.
- Regressões existentes de migração e preservação de edições/exclusões continuam aprovadas.
- `npm run lint`: PASS; `npm run typecheck`: PASS; `npm test`:94/94 PASS.
- `git diff --check`: PASS nos arquivos editados.

Banco em uso não recriado nem modificado por esta tarefa. SHA256 antes/depois: `d9f07101a4265a11d42fd35422d39cf999727a87a453f976b133f7c5b47eeb43`.

Não foi executado `npm run db:init` sobre a base de uso. A verificação utilizou memória e os bancos temporários da suíte. Nenhum documento de entrega foi modificado. CodeRabbit indisponível no ambiente; revisão local, sem alegação de execução dessa ferramenta.
