# PixelVault - Script SQL e Banco Local

**Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis**  
**Item atendido:** 1.5 - Modelagem, Estrutura do Banco de Dados e Node  
**Responsável:** Integrante 2  
**Prompt:** 14 - Script SQL e banco local  
**Story associada:** 2.2 - Script SQL e banco SQLite local reproduzível  
**Versão:** 1.0  
**Data:** 14/09/2026  
**Status:** concluído  
**Gate de qualidade:** PASS - 100/100

## 1. Objetivo

Converter o DER aprovado no Prompt 13 em um esquema SQLite reproduzível, acompanhado por uma massa pequena de dados fictícios, um procedimento de inicialização via CLI e testes reais de criação, inserção, consulta e integridade.

Este incremento entrega a base local exigida pelo item 1.5 sem antecipar a API Node, a integração com o aplicativo Expo ou o Mercado Pago, reservados ao Prompt 15.

## 2. Entradas utilizadas

- DER e dicionário aprovados em `documentos/PixelVault_Modelo_de_Dados_e_DER.md`;
- dados funcionais do Prompt 12 e de `src/data/pixelVaultData.js`;
- regras de carrinho, total, pedido e biblioteca de `src/domain/prototypeLogic.mjs`;
- Story 2.2 e seus 14 critérios de aceitação;
- decisão `UX-10`, que separa produto, loja de ativação, plataforma cloud e compatibilidade.

## 3. Artefatos produzidos

| Artefato | Finalidade |
|---|---|
| `database/schema.sql` | Criar as 13 tabelas, relacionamentos, restrições e índices. |
| `database/seed.sql` | Inserir a massa acadêmica fictícia em transação única. |
| `scripts/init-db.mjs` | Recriar `database/pixelvault.sqlite` de forma segura e reproduzível. |
| `tests/database.test.mjs` | Validar criação, consultas, chaves estrangeiras e casos negativos. |
| `docs/evidence/prompt-14/README.md` | Registrar ambiente, comandos, consultas e resultados observados. |
| `docs/qa/gates/2.2-script-sql-banco-local.yml` | Registrar o parecer formal de qualidade. |

## 4. Estrutura física do banco

O esquema possui exatamente 13 tabelas:

| Grupo | Tabelas |
|---|---|
| Acesso | `usuario` |
| Catálogo | `loja_ativacao`, `plataforma_cloud`, `produto`, `compatibilidade_produto` |
| Carrinho | `carrinho`, `item_carrinho` |
| Pedido e pagamento | `pedido`, `item_pedido`, `pagamento` |
| Biblioteca | `biblioteca`, `item_biblioteca`, `chave_ativacao` |

### 4.1 Decisões físicas

- IDs são `TEXT`, preservando os identificadores usados pelo protótipo.
- Valores monetários são inteiros em centavos.
- `produto.tipo` aceita somente `JOGO` ou `DLC`.
- `usuario.papel` aceita somente `JOGADOR` ou `ADMIN`.
- `item_pedido.id` é uma PK técnica textual; `(pedido_id, produto_id)` permanece único.
- `item_biblioteca.id` permite que a chave de ativação use uma FK simples.
- `item_carrinho` usa PK composta e impede o mesmo produto duas vezes no carrinho.
- Cada usuário possui no máximo um carrinho e uma biblioteca.
- Cada pedido possui no máximo um registro de pagamento neste modelo mínimo.
- Dados de cartão e nome impresso não fazem parte do esquema.

## 5. Chaves e integridade

O script habilita chaves estrangeiras com:

```sql
PRAGMA foreign_keys = ON;
```

As principais regras estruturais são:

1. todas as tabelas possuem PK;
2. e-mail de usuário é único e deve estar normalizado em minúsculas;
3. preço, total e valor de pagamento devem ser positivos;
4. loja e plataforma possuem nomes únicos;
5. compatibilidade não pode repetir o par produto/plataforma;
6. carrinho não pode repetir produto;
7. pedido não pode repetir produto entre seus itens;
8. pagamento não pode ser duplicado para o mesmo pedido;
9. biblioteca não pode repetir produto nem item de pedido;
10. código de chave e vínculo da chave com a aquisição são únicos;
11. referências históricas usam `ON DELETE RESTRICT`;
12. itens transitórios do carrinho usam `ON DELETE CASCADE` ao excluir o carrinho.

Foram criados índices para FKs consultadas que não são atendidas por PK ou `UNIQUE`.

### 5.1 Invariantes reservadas ao Prompt 15

Quatro regras que dependem de múltiplas tabelas foram documentadas, sem triggers prematuros:

- todo produto válido deve possuir ao menos uma compatibilidade;
- `pedido.total_centavos` deve corresponder à soma de `item_pedido`;
- `pagamento.valor_centavos` deve corresponder ao total do pedido;
- a biblioteca só deve receber itens depois de pagamento aprovado.

Essas regras deverão ser executadas atomicamente pela camada de serviço da API Node.

## 6. Massa fictícia

A seed reproduz o cenário aprovado no Prompt 12:

| Dado | Massa inserida |
|---|---|
| Usuários | Jogador e administrador/curador fictícios |
| Loja | Loja de demonstração fictícia |
| Plataformas | GeForce NOW e Boosteroid |
| Produtos | Orbit Raiders (`JOGO`, 7990 centavos) e Neon Expansion (`DLC`, 2490 centavos) |
| Compatibilidades | Orbit com duas plataformas; Neon com GeForce NOW |
| Carrinho | Um carrinho inicial vazio para o jogador |
| Pedido | `pedido-demo-001`, dois itens, total de 10480 centavos |
| Pagamento | Um pagamento fictício `APROVADO`, no valor de 10480 centavos |
| Biblioteca | Dois produtos adquiridos |
| Chaves | Duas chaves explicitamente fictícias |

As senhas não são gravadas em texto puro: a seed utiliza marcadores de hash não autenticáveis e claramente acadêmicos.

## 7. Inicialização reproduzível

Pré-requisito: Node.js 22 com suporte a `node:sqlite`.

Na raiz do projeto, executar:

```powershell
npm run db:init
```

O inicializador:

1. resolve os caminhos do schema, seed e banco;
2. cria um arquivo intermediário exclusivo do processo;
3. executa schema e seed;
4. habilita FKs na conexão;
5. executa `PRAGMA foreign_key_check`;
6. fecha o banco intermediário;
7. substitui `database/pixelvault.sqlite` somente após sucesso completo;
8. remove o arquivo intermediário se ocorrer erro.

O comando pode ser repetido para restaurar exatamente a mesma massa. O arquivo `.sqlite` é gerado localmente e ignorado pelo Git; os arquivos SQL permanecem como fontes versionáveis.

## 8. Testes executados

### 8.1 Testes específicos do banco

```powershell
npm run db:test
```

Resultado: **4/4 testes aprovados**.

| Teste | Evidência produzida |
|---|---|
| Criação e seed | Exatamente 13 tabelas, dois usuários, carrinho vazio e zero violações de FK. |
| Catálogo e pedido | Dois produtos, compatibilidades corretas, dois itens e total de 10480 centavos. |
| Biblioteca | Dois produtos, mesma loja e duas chaves fictícias. |
| Casos negativos | Rejeição de duplicidades, enums inválidos, preço zero e FKs inexistentes. |

Cada teste cria um banco isolado em diretório temporário e o remove ao terminar.

### 8.2 Quality gates

| Comando | Resultado |
|---|---|
| `npm run db:init` | PASS em duas reconstruções |
| `npm run db:test` | PASS - 4/4 |
| `npm run lint` | PASS - zero warnings |
| `npm run typecheck` | PASS |
| `npm test` | PASS - 21/21 |
| `npm run build` | PASS - export Android com 599 módulos |
| `PRAGMA foreign_key_check` | PASS - zero violações |

As duas reconstruções usadas pelo QA produziram o mesmo SHA-256 do banco, confirmando determinismo da massa e do processo.

## 9. Consultas demonstrativas

As consultas reais confirmaram:

### 9.1 Catálogo e compatibilidades

```text
Neon Expansion  | GeForce NOW
Orbit Raiders   | Boosteroid
Orbit Raiders   | GeForce NOW
```

### 9.2 Pedido e pagamento

```text
pedido-demo-001 | 2 itens | total 10480 | soma 10480 | APROVADO | valor 10480
```

### 9.3 Biblioteca

```text
Neon Expansion | Loja de demonstração (fictícia) | PV-NEON-DEMO-CHAVE-FICTICIA
Orbit Raiders  | Loja de demonstração (fictícia) | PV-ORBIT-DEMO-CHAVE-FICTICIA
```

## 10. Rastreabilidade

| Requisito | Evidência |
|---|---|
| DER aprovado | 13 tabelas correspondentes às entidades do Prompt 13. |
| `UX-10` | Produto, loja, plataforma e compatibilidade permanecem separados. |
| Carrinho sem duplicidade | PK composta em `item_carrinho` e teste negativo. |
| Continuidade dos preços | Snapshots em `item_pedido` e soma igual ao pedido. |
| Pagamento fictício | Estado, valor e referência sem qualquer dado de cartão. |
| Biblioteca idempotente | Unicidades por produto e item de pedido. |
| Chaves fictícias | Uma chave única por item de biblioteca. |
| Reprodutibilidade | `db:init`, staging, FK check e duas reconstruções idênticas. |
| Limite com Prompt 15 | Nenhuma API, endpoint, Express, integração Expo ou Mercado Pago foi implementada. |

## 11. Limitações registradas

- `node:sqlite` ainda emite `ExperimentalWarning` no Node 22.18.0; o aviso não afetou os testes.
- O banco ainda não é aberto pelo aplicativo Expo.
- Não existe API Node ou autenticação persistente neste incremento.
- O pagamento permanece fictício e não chama gateway externo.
- As invariantes entre múltiplas tabelas dependem da futura camada transacional da API.
- O SQLite CLI é útil para inspeção manual, mas o procedimento automatizado depende somente do Node instalado.

## 12. Resultado final

O Prompt 14 converteu o modelo aprovado em uma base SQLite local simples, reproduzível e testada. O esquema contém as 13 entidades necessárias, a seed preserva os usuários, produtos, plataformas, pedido e biblioteca demonstrados no protótipo, e os testes comprovam criação, inserção, consulta e rejeição de violações essenciais.

O gate formal foi **PASS**, com score **100/100**, e a Story 2.2 foi movida para `Done`. O resultado fornece uma entrada estável para o Prompt 15 sem apresentar a API ou a integração móvel como concluídas.

## 13. Referências internas

- `documentos/PixelVault_Modelo_de_Dados_e_DER.md`;
- `docs/stories/2.2.script-sql-banco-local.md`;
- `database/schema.sql`;
- `database/seed.sql`;
- `scripts/init-db.mjs`;
- `tests/database.test.mjs`;
- `docs/evidence/prompt-14/README.md`;
- `docs/qa/gates/2.2-script-sql-banco-local.yml`.

## 14. Checklist do Prompt 14

- [x] Script SQL de criação concluído.
- [x] Chaves primárias e estrangeiras coerentes.
- [x] Procedimento reproduzível de inicialização criado.
- [x] Banco SQLite local gerado.
- [x] Massa fictícia alinhada ao Prompt 12.
- [x] Testes reais de criação, inserção, consulta e integridade aprovados.
- [x] Evidências registradas para o relatório.
- [x] Gate formal aprovado.
- [x] API Node e integrações mantidas fora deste prompt.
