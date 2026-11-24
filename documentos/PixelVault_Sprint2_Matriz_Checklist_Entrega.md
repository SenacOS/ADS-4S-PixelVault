# PixelVault — 2.8 Matriz e checklist da segunda entrega

**Referência:** 21/11/2026. **Estado:** relatório consolidado DOCX/PDF e documentos complementares emitidos; vídeo e pacote pendentes. A existência deste checklist não comprova submissão ao Blackboard.

## Matriz do roteiro

| Item | Requisito | Artefatos/evidências | Estado documental |
| --- | --- | --- | --- |
|2.1|CRUD e integração/sincronização|Stories 3.1/3.2; SQL/API; `documentos/PixelVault_Sprint2_Item_2.1_CRUD_e_Sincronizacao.md`; evidências correspondentes|Implementado; síntese e telas no relatório |
|2.2|Botão para gerar JSON|Story 3.3; `documentos/PixelVault_Sprint2_Item_2.2_Exportacao_JSON.md`; JSONs realmente baixados|Implementado; explicação e botão visível no relatório |
|2.3|Comunicação, Review/Retrospectiva e status|`documentos/PixelVault_Sprint2_Comunicacao_Review_Retrospectiva_Status.md`; fontes do backlog|Documento e seção consolidados |
|2.4|Encerramento e lições/estimado versus real|`documentos/PixelVault_Sprint2_Encerramento_Licoes_Aprendidas.md`|Documento consolidado; horas reais não aferidas |
|2.5|Dashboard|Não aplicável ao escopo definido|Manter item no sumário com esta indicação breve |
|2.6|Testes unitários, integração e E2E|Stories 3.4–3.8; `docs/qa/gates/`; `docs/evidence/`; rodada atual 93 testes/110 cenários web|Síntese e evidências incluídas no relatório; 36 casos visuais/interação e 74 regressões funcionais, sem somar rodadas históricas |
|2.7|Pitch com todos os rostos, código/telas/testes, até 10 min|`documentos/PixelVault_Sprint2_Roteiro_Pitch_Video.md`|Roteiro pronto; gravação pendente |
|2.8|PDF, tudo já entregue, código/telas, pitch e projeto zipado via Blackboard|Relatório Sprint 1, consolidação Sprint 2 e este checklist|Em preparação; não submetido por esta tarefa |
|Incremento vinculado|Mercado Pago em teste e biblioteca|Story 3.5, `documentos/PixelVault_Mercado_Pago_Checkout_Teste.md`, evidência sanitizada de aprovação/restauração|Implementado em teste; explicar reconciliação |
|Incremento adicional|32 produtos-base e capas locais|Story 3.6 e `documentos/PixelVault_Catalogo_Expandido_e_Capas_Locais.md`|Implementado; atualizar capturas e contagens atuais |

## Organização do documento final

Preservar capa com instituição no topo, disciplina/projeto ao centro, seis nomes/RAs e São Paulo–2026. Manter a evolução e os conteúdos da primeira entrega; acrescentar a segunda sem converter planejamento antigo em resultado posterior.

Sumário mínimo: Introdução;1.Desenvolvimento/Sprint 1 com seus subitens;2.Sprint 2, subdividida em 2.1 a 2.8 na ordem do roteiro; Conclusão; Referências; Anexos. A numeração de conclusão/referências pode ser atualizada na consolidação para evitar conflito com o antigo capítulo 2 de conclusão. Código e telas devem constar do índice em subseção/anexo identificável.

Formatação do roteiro: margens superior/inferior/direita 2 cm, esquerda 3 cm; Verdana, Arial ou Times New Roman; texto 10 pt; títulos 12 pt negrito; espaçamento 1,5; recuo de parágrafo 2 cm. Renderizar e inspecionar legibilidade das tabelas, imagens e código antes de emitir o PDF.

## Checklist de documentação

- [x] Capa preserva exatamente nomes e RAs da base; PO/SM corretos.
- [x] Sumário inclui todos os itens 2.1–2.8, código, telas e anexos aplicáveis, com páginas coerentes.
- [x] Introdução distingue protótipo Sprint 1 de incremento persistente/checkout Sprint 2.
- [x] Conteúdo anterior preservado, com correções claramente contextualizadas.
- [x] Métricas usam 17 itens/53 SP originais; HU-12 não declarada concluída.
- [x] Comunicação/Review/Retrospectiva são documentais; sem reuniões/horas/aprovações inventadas.
- [x] Código e telas atuais representam 32 produtos-base,33 capas e fluxo de teste.
- [x] Resultados 89 testes/74 jornadas vinculados à rodada 3.6; histórico anterior mantido como histórico.
- [x] Referências apontam para roteiro, aulas, documentação oficial e evidências necessárias.
- [x] PDF atualizado na story 3.8 e revisado: 106 páginas, sem novos cortes ou sobreposições; imagens históricas mantêm a qualidade da fonte original. Edição anterior preservada em `documentos/historico/story-3.7/`.

## Checklist do projeto e pacote

- [ ] Projeto contém fontes, assets locais, manifestos/lockfile, SQL/migrações, testes e instruções reproduzíveis.
- [ ] Dependências instaláveis pelo lockfile; não depender de `node_modules` incluído.
- [ ] Não incluir `.env`, `.env.mercadopago`, tokens, senhas, cache OAuth, credenciais do Codex, bancos de execução ou logs/capturas com secrets.
- [ ] Inspecionar o conteúdo real do ZIP; `.gitignore` não garante filtragem de um compactador genérico.
- [ ] Manter `.env.example` somente com campos vazios/exemplos seguros; explicar que o avaliador configura suas próprias credenciais de teste.
- [ ] Não incluir `node_modules`, caches de ferramentas, temporários ou instaladores sem relação com o projeto.
- [ ] Incluir PDF, pitch e projeto no arquivo único exigido, com nomes claros e sem versões concorrentes ambíguas.
- [ ] Extrair uma cópia do pacote e conferir estrutura, leitura do PDF, reprodução do vídeo e instruções do projeto.
- [ ] Confirmar data/horário da última aula de PI em novembro e limite de upload do Blackboard com a equipe/instituição.
- [ ] Submeter somente pelo Blackboard e guardar comprovante após envio efetivo.

## Pendências que impedem afirmar entrega final concluída

Revisão coletiva da documentação emitida; gravação do pitch com os seis integrantes; criação e inspeção do pacote; definição interna do responsável pelo envio; confirmação do prazo específico e submissão. HU-12 permanece pendência funcional do Product Backlog, separada desses itens de empacotamento.

**Fontes:** relatório final da Sprint 1; roteiro da segunda entrega, formatação e item 2.8; stories/gates/evidências 3.1–3.6. Os templates de status e riscos foram adaptados ao domínio digital, sem incluir estoque/logística de supermercado.
