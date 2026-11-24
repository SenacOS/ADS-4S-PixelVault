# PixelVault — catálogo ampliado e capas locais

**Data:** 21/11/2026. **Story:** 3.6. **Status:** Done; QA CONCERNS, 90/100, somente pela validação nativa pendente. Lint, typecheck, 89 testes, 74 jornadas web e build Android 669 módulos aprovados.

## Entrega

Foram adicionados **30 jogos fictícios**, mantendo Orbit Raiders e a DLC Neon Expansion: **32 itens-base (31 jogos e uma DLC)**. Os preços e as compatibilidades cloud são dados acadêmicos ilustrativos. Itens criados pelo usuário são preservados e podem aumentar o total além da base.

Os 32 itens possuem capas originais de pixel art em PNG local, com 768×432 pixels. Uma 33ª ilustração serve como capa genérica para produtos sem arte própria. Os arquivos são empacotados com Expo, sem download de imagens de terceiros ou dependência de serviço externo. O mapa de capas usa IDs e imports estáticos; URLs de imagem não são aceitas pelo CRUD nem acrescentadas ao banco/API.

As capas são exibidas em catálogo, detalhes, carrinho, biblioteca e administração, com rótulos acessíveis. O componente mantém proporção 16:9, cobre a área sem deformar e apresenta mensagem acessível se o carregamento falhar. IDs que coincidam com propriedades de Object também recebem a imagem genérica. A página de detalhes passou a mostrar a descrição do item; o catálogo informa a quantidade encontrada.

## Novos jogos

| Jogo fictício | Preço demonstrativo |
| --- | --- |
| Aurora Quest | R$ 19,90 |
| Crystal Harbor | R$ 26,90 |
| Solar Drifters | R$ 33,90 |
| Ember Citadel | R$ 40,90 |
| Moonlight Valley | R$ 47,90 |
| Iron Circuit | R$ 54,90 |
| Skybound Isles | R$ 61,90 |
| Ocean Echoes | R$ 68,90 |
| Frostfall Keep | R$ 75,90 |
| Desert Horizon | R$ 82,90 |
| Prism Runner | R$ 89,90 |
| Starlight Nomads | R$ 96,90 |
| Verdant Guardians | R$ 19,90 |
| Thunder Peaks | R$ 26,90 |
| Coral Odyssey | R$ 33,90 |
| Clockwork Haven | R$ 40,90 |
| Obsidian Knights | R$ 47,90 |
| Comet Trails | R$ 54,90 |
| Saffron Dunes | R$ 61,90 |
| Misty Outpost | R$ 68,90 |
| Glacier Voyage | R$ 75,90 |
| Tidal Legends | R$ 82,90 |
| Copper Canyon | R$ 89,90 |
| Celestial Forge | R$ 96,90 |
| Jade Expedition | R$ 19,90 |
| Midnight Metro | R$ 26,90 |
| Silver Summit | R$ 33,90 |
| Sunken Compass | R$ 40,90 |
| Crimson Bastion | R$ 47,90 |
| Zenith Frontier | R$ 54,90 |

## Fontes e atualização dos dados existentes

A fonte das 30 adições é `src/data/catalogExpansion.json`, compartilhada pelo frontend e pelo bootstrap/migração do backend. Os dois registros originais permanecem nos arquivos existentes. A seed efetiva é formada por `database/seed.sql` e pelo manifesto aplicado pelo helper `server/catalog-expansion.mjs`; executar apenas o SQL-base não equivale ao bootstrap completo.

`npm run db:init` cria um banco novo com os 32 itens e as 13 tabelas de domínio originais. Para banco existente, a abertura pela API faz migração aditiva transacional e registra a aplicação em `app_migration`. Não recria o banco, sobrescreve produto existente ou recria um produto excluído depois da migração. Lojas/plataformas personalizadas também são preservadas.

O banco de trabalho `database/pixelvault.sqlite` foi efetivamente atualizado de 2 para 32 produtos, mantendo usuários, carrinhos, pedidos, pagamentos, biblioteca, chaves e campos/compatibilidades anteriores. Uma segunda abertura não duplicou itens e não houve violações de FK. Evidência: `docs/evidence/sprint-2-story-3.6/existing-database-migration.json`.

O cache do aplicativo recebe somente as 30 adições, uma vez, com marcador `catalogEdition=2`, preservado em gravação, refresh e descarte. Alterações, dados por conta e outbox são mantidos; IDs já presentes ou em operação pendente, inclusive DELETE, não são reinseridos. O catálogo e o marcador são salvos antes de publicar a migração na interface. Reabrir o app aplica a atualização ao cache antigo; não é necessário apagar armazenamento.

## Verificação

Os testes verificam integridade/decodificação de todos os 33 PNGs e sua unicidade, bootstrap32, migração de banco antigo, preservação de campos, exclusões posteriores, rollback e conflitos de IDs de loja/plataforma. Cache v1 legado, cache v2, DELETE pendente, contas, falha de gravação e preservação do marcador também estão cobertos.

O E2E percorre toda a lista em 320/390px, confirma32 IDs/títulos, carregamento efetivo e proporção 16:9 de cada imagem e equivalência de nome/tipo/centavos/descrição/loja/plataformas entre cache e manifesto. Filtros esperados: Todos 32, GeForce NOW 22 e Boosteroid 21. Também exercita primeiro/último jogo novo, detalhes, carrinho, erro de imagem/recuperação e produto sem capa própria. Há execução sem API e com HTTP/SQLite reais.

As regressões antigas usam uma fixture isolada de dois itens para preservar os cenários originais; não representam o catálogo padrão atual. A nova suíte de 32 itens usa os defaults reais, sem flag de produção para limitar o catálogo. Os resultados finais, screenshots, comandos e limitações ficam em `docs/evidence/sprint-2-story-3.6/README.md`; parecer em `docs/qa/gates/3.6-catalogo-expandido-capas-locais.yml`.

## Comandos

```powershell
npm run catalog:covers
npm run lint
npm run typecheck
npm test
npm run build -- --clear
```

O gerador de capas usa somente módulos nativos Node.js e não adiciona dependências. Assets gerados e o registro estático ficam versionáveis; mudanças nas adições futuras exigem revisão do marcador de migração. Não houve nova compra, alteração de credenciais ou ativação de produção. Execução em aparelho/emulador permanece separada dos resultados web/build.

