# Story 3.4 — regressão pré-pagamento

20/11/2026. Rodada completa autorizada, sem implementar Mercado Pago. Uma tarefa auxiliar por vez: @sm criou story e @qa revisou correções.

- Base preservada: 38/40 E2E e 63 testes anteriores aprovados; casos novos reproduziram duas falhas de UI e duas de contrato.
- Correções limitadas à coerência dos artefatos existentes: cadastro demonstrativo, centavos/limites e descrição textarea.
- Entrada local explicitamente restrita à conta registered/player da sessão; não é fallback de HTTP401 e não concede credencial de servidor.
- Preços inválidos antigos não são arredondados/destruídos durante sincronização.
- Matriz diferencia inventário de controles observados de ações/assertions efetivamente executadas.
- Resultados e limitações: `docs/evidence/qa-full/README.md`. Sem commit, push, publicação ou integração financeira externa.
