# PixelVault — 2.3 Plano de comunicação, Review, Retrospectiva e status

**Emissão:** 21/11/2026. **Período:** continuidade após o encerramento da Sprint 1, documentado em 23/09/2026, até 21/11/2026. **Product Owner:** Marcos Paulo Santos Boe. **Scrum Master e responsável pelo relatório:** Gabriel Rodrigues Fausto.

## 1. Resumo executivo

**Status geral: atenção.** O incremento de Sprint 2 entrega a base SQLite/API transferida, persistência e sincronização do catálogo, exportação JSON, Checkout Pro em teste com compra aprovada e biblioteca reconciliada. A expansão posterior mantém 32 produtos-base e 33 capas locais, incluindo a genérica. O acesso persistente de HU-12 e os itens finais de documentação, vídeo e submissão ainda exigem acompanhamento.

O Product Backlog original chega a 16 de 17 itens e 48 de 53 SP. Isso mede cobertura dos itens originais, não percentual de prontidão da submissão acadêmica. Os artefatos adicionais e a ampliação do catálogo são registrados como incrementos sem criar pontos retroativos.

## 2. Plano de comunicação

O plano mantém os canais da base Sprint 1: Trello para acompanhamento, WhatsApp para comunicação assíncrona e Google Meet para encontros quando necessários. A tabela define a utilização planejada; não comprova encontros ou atualizações realizados nesses serviços. As evidências verificáveis desta revisão são os arquivos versionáveis do projeto.

| Comunicação | Conteúdo e público | Cadência proposta | Responsável de coordenação | Registro esperado |
| --- | --- | --- | --- | --- |
| Acompanhamento assíncrono | Seis integrantes: próximo passo, bloqueio e evidência | A cada avanço ou impedimento relevante | Gabriel Rodrigues Fausto | Story e quadro atualizados, link da evidência |
| Refinamento | Escopo, dependências e prioridade com PO e executores | Antes de iniciar item ou alterar recorte | Marcos Paulo Santos Boe | Critérios e decisão rastreáveis |
| Revisão técnica | Contratos, migrações, segurança e testes | Antes de concluir incremento | Executor e revisor designados | Decisão, logs sanitizados e gate |
| Review e Retrospectiva | Resultado, pendências e melhoria com equipe | No fechamento do recorte | PO e Scrum Master | Síntese documental abaixo |
| Preparação de entrega | Conferência de PDF, vídeo e projeto | Antes da submissão | Equipe, coordenação do Scrum Master | Checklist 2.8 e arquivo final conferido |

Não se atribui aprovação pessoal do PO nem presença dos integrantes a uma reunião não comprovada. Aceite técnico documentado e aprovação acadêmica são eventos distintos.

## 3. Sprint Review documental

**Método:** revisão dos incrementos, gates e evidências existentes, realizada para este relatório em 21/11/2026. Não é ata de reunião presencial nem pesquisa com usuários.

| Incremento revisado | Evidência principal | Conclusão documental |
| --- | --- | --- |
| Base Node/SQLite e catálogo persistente | Stories 2.2/2.3,3.1/3.2; SQL e evidências | Base transferida da Sprint 1 implementada; CRUD e sincronização demonstrados |
| Exportação JSON | Story 3.3 e arquivos baixados | Botão gera dados versionados e isolados por conta |
| Regressão ampliada | Story 3.4 e matriz `docs/evidence/qa-full/README.md` | Campos, controles e falhas recuperáveis exercitados |
| Checkout e biblioteca | Story 3.5; evidência `docs/evidence/sprint-2-story-3.5/mercadopago-approved.json` e restauração do app | Compra de teste aprovada, consultas repetidas sem duplicação e biblioteca restaurada após reinício/reautenticação |
| Catálogo com imagens | Story 3.6 e sua matriz |32 produtos-base;32 capas específicas e 1 genérica; migração preserva histórico |

Os pareceres técnicos e seus limites completos continuam nos gates originais. Esta síntese não substitui esses registros. A entrega do pagamento usa ambiente de teste, consulta autenticada e retorno manual; produção não foi ativada.

### Adaptação do backlog

HT-02 deixa de ser transferência aberta. HU-13, HU-14 e HU-15 têm evidências de implementação. HU-12 permanece pendente: sessão online em memória e cadastro efêmero não satisfazem manter acesso entre utilizações. O próximo fechamento deve priorizar resolver ou assumir explicitamente essa pendência, concluir documentos e gravar o vídeo.

## 4. Relatório de status e métricas

| Área | Estado | Observação |
| --- | --- | --- |
| Catálogo, CRUD e sincronização | Entregue no recorte | API/SQLite, fila durável, conflitos e reenvio |
| Exportação de dados | Entregue no recorte | JSON com dados permitidos e sem secrets |
| Pagamento e biblioteca | Entregue em teste | Aprovação externa validada e reconciliação idempotente |
| Acesso persistente | Pendente | HU-12 não entregue; sessão exige novo login |
| UX e catálogo ampliado | Entregue no recorte |32 itens-base, capas locais, filtros/detalhes/carrinho |
| Documento final e vídeo | Documentação consolidada; vídeo pendente | Relatório DOCX/PDF e complementos preparados; gravação e revisão coletiva pendentes |
| Estoque físico/logística | Não aplicável | Produtos digitais; não importar módulos do exemplo de supermercado |

| Indicador | Cálculo | Resultado |
| --- | --- | --- |
| Sprint 1 — itens concluídos do plano inicial |12/13|92,3%|
| Sprint 1 — pontos entregues do plano inicial |22/27|81,5%|
| Sprint 2 — itens do recorte transferido/candidato |4/5|80,0%|
| Sprint 2 — pontos desse recorte |26/31|83,9%|
| Product Backlog original — itens acumulados |16/17|94,1%|
| Product Backlog original — pontos acumulados |48/53|90,6%|

O recorte de Sprint 2 corresponde a HT-02(5), HU-12(5), HU-13(8), HU-14(8) e HU-15(5). Foram entregues 26 SP; HU-12 responde pelos 5 SP restantes. Os pontos são as estimativas originais, usadas como referência; não há nova sessão de Planning Poker comprovada nem conversão de pontos em horas.

**Nota de consistência da base:** a tabela antiga do status inverte os rótulos de 12 e 13. O texto de encerramento e a lista de itens confirmam 12 concluídos de 13 planejados. A correção aqui preserva esse significado e não reescreve o documento original.

### Qualidade e marcos

| Marco | Data evidenciada | Situação |
| --- | --- | --- |
| Relatório de encerramento Sprint 1 |23/09/2026|Base documental preservada |
| Persistência, CRUD/sincronização e JSON |20/11/2026|Stories 3.1–3.3 concluídas |
| Rodada ampliada pré-pagamento |20/11/2026|68 testes e 51 jornadas na rodada histórica |
| Compra externa de teste e restauração |21/11/2026|Story 3.5 concluída |
| Catálogo ampliado e regressão atual |21/11/2026|89 testes,74 jornadas web, lint/typecheck/build aprovados |
| PDF, vídeo e pacote |Antes da última aula de PI em novembro|Documentação emitida; gravação e pacote pendentes; data da aula não fornecida |

Os resultados históricos não se somam como se fossem casos únicos diferentes.89 testes e 74 jornadas correspondem à rodada final da story 3.6. Não há inventário consolidado de bugs de todo o semestre que permita informar uma contagem única confiável; defeitos e correções permanecem rastreados por story/gate.

## 5. Riscos, impedimentos e mitigação

Escala qualitativa adaptada do template: verde(controlado), amarelo(atenção), vermelho(impacto crítico atual). Probabilidade e impacto abaixo são avaliações documentais, não medições estatísticas.

| ID | Risco/problema | Probabilidade/impacto | Estado | Mitigação e contingência | Coordenação proposta |
| --- | --- | --- | --- | --- | --- |
| R 1 | HU-12 permanecer incompleta na entrega | Alta/alto | Amarelo | Tornar pendência explícita; refinar e priorizar; não apresentar sessão em memória como persistente | PO e equipe |
| R 2 | Credencial ou banco sensível entrar no pacote | Média/alto | Amarelo | Inspecionar arquivos incluídos; excluir ambientes privados, tokens, bancos de execução e logs sensíveis; recriar o pacote se encontrar segredo | Executor técnico e revisor |
| R 3 | Indisponibilidade do Mercado Pago durante demonstração | Média/médio | Amarelo | Preparar fluxo de teste, consultar estado pelo backend e manter evidência sanitizada da compra aprovada; explicar falha sem simular aprovação externa | Equipe técnica |
| R 4 | PDF/vídeo exceder formato, prazo ou limite | Média/alto | Amarelo | Renderizar e conferir PDF; ensaiar roteiro 9 min; confirmar data de aula; revisar arquivo único antes do Blackboard | Scrum Master e equipe |
| R 5 | Alteração de catálogo apagar dados existentes | Baixa/alto | Verde no recorte testado | Migração aditiva/idempotente, testes de preservação e cópia local antes de operação destrutiva; não resetar banco de trabalho | Executor técnico |

## 6. Retrospectiva documental e próximas ações

| Observação sustentada pelas evidências | Aprendizado | Ação proposta |
| --- | --- | --- |
| Itens técnicos não entregues na Sprint 1 foram transferidos explicitamente | Transferência visível evita confundir plano e entrega | Manter HU-12 aberta até haver critério comprovado |
| Contratos de preço e formulário tiveram regressões corrigidas | Validar somente campo visual não basta | Testar domínio, API e interface para a mesma regra |
| Confirmação externa e reconsulta foram necessárias no pagamento | Retorno do navegador não comprova aprovação | Preservar reconciliação autenticada e repetição idempotente |
| Catálogo expandido exigiu migração sem reset | Evoluir massa demonstrativa também altera estado persistido | Continuar testes de atualização sobre banco/cache anteriores |
| Logs, story e gate separados tornam o resultado verificável | Documento deve refletir evidência e limite real | Atualizar matriz de entrega a cada fechamento |

Esta retrospectiva não atribui falas, desempenho individual ou feedback a participantes sem registro. As ações são propostas para revisão da equipe, sem alegar deliberação pessoal já ocorrida.

## Fontes e rastreabilidade

Base: `documentos/PixelVault_Relatorio_Final_Sprint1.docx`, seções 1.2 e 1.6; roteiro da segunda entrega, item 2.3; templates de status/riscos. Evidências: stories 3.1 a 3.6 em `docs/stories/`, pareceres em `docs/qa/gates/` e resultados em `docs/evidence/`. Detalhes operacionais: `documentos/PixelVault_Sprint2_Item_2.1_CRUD_e_Sincronizacao.md`, `documentos/PixelVault_Sprint2_Item_2.2_Exportacao_JSON.md`, `documentos/PixelVault_Mercado_Pago_Checkout_Teste.md` e `documentos/PixelVault_Catalogo_Expandido_e_Capas_Locais.md`.
