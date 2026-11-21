# Decisões — Story 3.2

20/11/2026. Item 2.1 autorizado até conclusão. Apenas um agente auxiliar ativo de cada vez: @sm criou story, @architect revisou ADR, @qa revisou implementação.

- Revisões de conteúdo evitam alterar as colunas do domínio; recibos persistentes são migração aditiva.
- Fila local e edição são salvas juntas; HTTP fica fora da fila de gravação; ACK remove só a operação enviada e atualiza a revisão da próxima.
- Token nunca é persistido; login/logout têm guarda contra resposta atrasada.
- QA identificou ACK 2xx inválido e login tardio: corrigidos e testados.
- Snapshot legado modificado é preservado para resolução explícita, sem inferir dados faltantes.
- Evidências: `docs/evidence/sprint-2-story-3.2/README.md`. Sem commit/push/publicação ou alteração de credenciais reais.
