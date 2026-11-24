# PixelVault — Sprint 2: Persistência local e integração inicial do catálogo

**Item do roteiro:** 2.1 — CRUD e integração com API / sincronização de dados (parcial)  
**Story:** 3.1 — Persistência local e integração inicial do catálogo  
**Data:** 20/11/2026  
**Versão:** 1.0  
**Status:** Done; gate CONCERNS (90/100) por execução nativa pendente.  
**Responsabilidade técnica:** Dex (@dev), revisão arquitetural Aria (@architect), qualidade Quinn (@qa)

## 1. Objetivo e rastreabilidade

Iniciar a segunda entrega com persistência no dispositivo e consulta do catálogo da API, preservando a utilização sem rede. O incremento deriva da arquitetura local-first da aula 07, do item 2.1 do roteiro e da continuidade de `HU-13`. Não conclui a sincronização bidirecional, a autenticação (`HU-12`), o Mercado Pago de teste (`HU-14`) nem a liberação por confirmação externa (`HU-15`).

O usuário retirou o dashboard do escopo em 20/11/2026 e definiu o pitch em vídeo. A exportação JSON continua sendo item separado, sem implementação nesta story. O relatório histórico da Sprint 1 permanece preservado; os incrementos posteriores são registrados como evolução da Sprint 2.

## 2. Entradas e decisões

- Stories 1.3 e 2.3: interações demonstrativas e contrato mínimo da API.
- Consolidado dos Prompts 1 a 9: `HU-13`, separação produto/loja/plataforma e limites do MVP.
- Consolidado dos Prompts 10 a 15: interface implementada, banco servidor e gateway simulado.
- Aula 07: SQLite no dispositivo e backend como apoio à sincronização.
- `docs/architecture/project-decisions/3.1-persistencia-local.md`: decisão arquitetural do incremento.

O projeto permanece no Expo SDK 54. `expo-sqlite ~16.0.10` foi selecionado conforme o mapa de dependências do SDK instalado. O endereço público do app é `EXPO_PUBLIC_API_URL`, sem credenciais. O endpoint utilizado é exclusivamente `GET /api/products`.

## 3. Persistência e fronteiras

| Dado | Comportamento entregue |
| --- | --- |
| Catálogo e compatibilidades | Cache persistido; catálogo vazio é diferente de armazenamento ainda inexistente. |
| CRUD administrativo | Alterações locais duráveis, sem envio ao servidor. |
| Carrinho | Persistido por identidade de conta demonstrativa. |
| Biblioteca e último pedido | Persistidos por conta; continuam originados pela simulação. |
| Senha, sessão e formulário financeiro | Excluídos por lista explícita de campos permitidos. |
| Cadastro e login | Permanecem em memória; contas recém-cadastradas são efêmeras. |

Android/iOS utilizam `pixelvault-mobile.sqlite`, com uma tabela `mobile_vault` e snapshot JSON de versão 1. Esse armazenamento é um cache do aplicativo, independente do DER e das 13 tabelas do servidor. A web utiliza `localStorage` por origem com o mesmo contrato funcional; não é SQLite web.

A inicialização lê os dados antes de liberar alterações. As escritas são serializadas e a interface só informa sucesso após a gravação. Erros e versões desconhecidas não apagam o conteúdo existente. O encerramento aguarda a fila e é idempotente; respostas remotas de instâncias descartadas não podem salvar sobre uma instância nova.

## 4. Integração de leitura e funcionamento offline

O cliente HTTP valida status, JSON e formato, aplica limite de espera de cinco segundos e converte centavos, loja e plataformas para o contrato dos componentes existentes. A leitura pública do catálogo admite CORS para a versão web.

Com URL configurada, a aplicação tenta atualizar o catálogo após restaurar os dados locais. O botão **Atualizar catálogo da API** permite nova tentativa. Falha de rede, timeout ou resposta inválida mantém o cache. Sem configuração, os dados fictícios permitem iniciar a demonstração offline.

Uma edição administrativa marca `catalogDirty`. O marcador é conferido na fila de gravação para impedir sobrescrita mesmo quando a requisição remota começou antes da edição. Não há envio de alterações ou descarte automático nesta etapa. Carrinho e aquisições existentes não são substituídos pela atualização do catálogo.

## 5. Execução e evidências

O README do projeto contém comandos para computador, emulador Android e aparelho físico. Para executar somente os testes novos: `npm run mobile:test`. Os gates continuam sendo `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.

Resultados executados e capturas estão em `docs/evidence/sprint-2-story-3.1/README.md`; o parecer formal fica em `docs/qa/gates/3.1-persistencia-local-integracao-catalogo.yml`. Esses registros distinguem testes do SQL em Node, fluxos web e execução real do driver nativo.

## 6. Continuidade

1. Validar o driver `expo-sqlite` em aparelho/emulador disponível.
2. Implementar autenticação e sessão, substituindo o acesso demonstrativo e protegendo rotas.
3. Completar endpoints e envio do CRUD persistente ao backend, com política de conflitos.
4. Integrar carrinho, criação de pedido, pagamento Mercado Pago de teste e biblioteca confirmada.
5. Implementar exportação JSON, ampliar testes e consolidar documentação e pitch em vídeo.

O item 2.1 permanece parcial. Não se atribui percentual global da Sprint sem backlog atualizado e aceite das histórias.
