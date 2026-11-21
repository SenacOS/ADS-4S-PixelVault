# PixelVault — 2.4 Encerramento e lições aprendidas

**Data de referência:** 21/11/2026. **Natureza:** encerramento documental do recorte de implementação da Sprint 2 e preparação da entrega final. Não representa submissão acadêmica concluída nem aceite pessoal do PO.

## 1. Resultado do recorte

O PixelVault evoluiu do protótipo em memória da Sprint 1 para catálogo persistido e sincronizado com API Node/SQLite, exportação JSON, checkout externo em ambiente de teste e biblioteca vinculada à aprovação consultada no servidor. O catálogo atual possui 32 produtos-base fictícios, com 32 capas específicas e 1 genérica locais. Preços e compatibilidades são ilustrativos; não há operação comercial real.

O objetivo técnico avançou em quatro dos cinco itens originais associados à Sprint 2. A pendência HU-12, manter acesso entre utilizações, impede afirmar conclusão integral de todo o backlog. Sessão em memória, novo login após reinício e cadastro efêmero são limitações atuais reconhecidas.

## 2. Estimado versus realizado

| Referência | Planejado/estimado | Realizado demonstrado | Diferença |
| --- | --- | --- | --- |
| Sprint 1, plano inicial |13 itens/27 SP|12 itens/22 SP|HT-02,5 SP, transferido |
| Sprint 2, recorte original com transferência |5 itens/31 SP|4 itens/26 SP|HU-12,5 SP, pendente |
| Backlog original acumulado |17 itens/53 SP|16 itens/48 SP|1 item/5 SP |

Na Sprint 2, HT-02(5 SP) e HU-13(8 SP) são sustentadas pela base SQL/API, persistência e sincronização; HU-14(8 SP) e HU-15(5 SP), pelo checkout de teste e biblioteca. As histórias 3.3,3.4 e 3.6 organizam exportação, regressão e expansão, sem acrescentar pontos arbitrários à estimativa original. Percentuais:80,0%dos itens e 83,9%dos pontos da Sprint 2;94,1%dos itens e 90,6%dos pontos acumulados.

**Horas reais não aferidas.** A base Sprint 1 descreve capacidade líquida simulada de 30 horas e reserva de 3 horas; isso é planejamento, não apontamento executado. Não há dados suficientes para calcular desvio de horas, custo, produtividade por pessoa ou velocidade comparável entre sprints. Story points não são convertidos em horas.

As datas de 20/11/2026(persistência, sincronização, JSON e regressão) e 21/11/2026(compra de teste validada e catálogo ampliado) são marcos dos registros técnicos, não duração total de trabalho nem data de reunião de aceite do grupo.

## 3. Desempenho observado e lições

| Evidência do processo | Lição aprendida | Aplicação futura |
| --- | --- | --- |
| Base técnica transferida e posteriormente implementada | Backlog deve tornar dependências e transferência explícitas | Replanejar antes de assumir novo compromisso |
| Estados local, pendente e sincronizado distinguidos | Persistência local não comprova aceitação no servidor | Manter feedback e outbox recuperável |
| Erros de preço/formulário reproduzidos por testes | Regra compartilhada precisa ser coerente entre camadas | Testar limites monetários e validação de contrato |
| Plugin indisponível contornado com MCP oficial | Ferramenta auxiliar pode falhar sem bloquear o produto | Preferir alternativa documentada e registrar sua configuração |
| Compra externa aprovada foi reconsultada e repetida | Pagamento exige verificação confiável e idempotência | Não conceder biblioteca pelo retorno visual do checkout |
| Migração de 2 para 32 produtos preservou dados | Atualizações de massa também precisam de cuidado transacional | Testar reexecução, histórico e alterações customizadas |
| Evidências e gates por história | Clareza de conclusão melhora quando cada afirmação tem origem | Manter documentos sincronizados com resultados reais |

O desempenho da equipe é avaliado pelo incremento e pela rastreabilidade disponíveis. Não há evidências para atribuir horas trabalhadas, produtividade, comparecimento ou contribuição técnica individual nesta etapa; os papéis preservados da base não são prova de execução de cada tarefa.

## 4. Entregas, responsabilidades e transição

Os papéis permanecem: PO Marcos Paulo Santos Boe; Scrum Master Gabriel Rodrigues Fausto; equipe formada pelos seis integrantes listados no relatório-base. A consolidação final deve ser conferida coletivamente. Não há nova aprovação pessoal registrada neste documento.

| Pendência | Próxima ação | Responsabilidade proposta |
| --- | --- | --- |
| HU-12 | Refinar/implementar acesso persistente ou declarar o recorte incompleto no fechamento | PO e equipe técnica |
| Documentação final | Revisar coletivamente o relatório consolidado DOCX/PDF e os complementos emitidos | Equipe e revisor documental |
| Pitch em vídeo | Ensaiar e gravar até 10 min, com todos os seis rostos | Seis integrantes |
| Pacote e envio | Conferir arquivo único, projeto executável e ausência de secrets; submeter pelo Blackboard | Responsável de submissão a definir pela equipe |

Webhook público e retorno automático não compõem o fluxo local entregue; utiliza-se consulta autenticada e retorno manual. Produção, reembolso, chargeback e revogação posterior não foram implementados no recorte acadêmico. Essas exclusões não devem ser anunciadas como capacidades prontas.

## 5. Critério de encerramento acadêmico

O recorte técnico está documentado com pendências explícitas. O encerramento da entrega acadêmica ocorrerá somente após conferência dos documentos finais, gravação do pitch, revisão do pacote e submissão. Este arquivo não comprova que essas etapas já aconteceram.

## Fontes

`documentos/PixelVault_Relatorio_Final_Sprint1.docx`, planejamento e status; roteiro da segunda entrega, item 2.4; stories 3.1 a 3.6 em `docs/stories/`; gates e evidências correspondentes em `docs/qa/gates/` e `docs/evidence/`; `documentos/PixelVault_Sprint2_Comunicacao_Review_Retrospectiva_Status.md`.
