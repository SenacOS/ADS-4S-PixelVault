# Story 3.11 — compra e ações por perfil

Validação em 21/11/2026, Expo54 web + Chrome headless/CDP, sem transação externa.

- Compra: títulos, instruções, botões e mensagens de estado sem enquadramento de teste/simulação; confirmação também usa texto neutro. Configuração privada, validação de ambiente `test`, autenticação e contratos de pagamento preservados.
- Jogador: atualizar catálogo/API, exportar JSON e texto operacional de sincronização não aparecem no catálogo.
- Administrador: atualização da API disponível no painel, exportação JSON mantida e sincronização existente preservada. O botão de exportação só é composto para `profile.role === 'admin'`.
- Documento de entrega e README não alterados nesta tarefa.

## Gates

`npm run lint`: PASS. `npm run typecheck`: PASS. `npm test`: 93/93 PASS. Atualizada a expectativa de texto do teste estrutural existente, junto aos seletores dos cenários web afetados. CodeRabbit indisponível no ambiente; sem alegação de execução.

## Navegador

Quatro cenários passaram, sem falhas, em larguras de 320 e 390 pixels:

- `docs/evidence/qa-full-local-ui-3.11/capture-results.json`: jogador sem ações administrativas; compra local com campos/validação existentes e confirmação; administrador atualiza, exporta JSON e sai; novo login de jogador não recupera as ações de administrador.
- `docs/evidence/qa-full-payment-ui-3.11/capture-results.json`: mesmas verificações por perfil com API; pedido preparado, botões de abrir Mercado Pago/consultar presentes com nomes neutros; aprovação pelo provedor isolado confirmada via backend; administrador atualiza e baixa JSON.

Os cenários verificam a ausência de “ambiente de teste”, “Uso acadêmico”, “simulad” e “de teste” na compra. A interface da página hospedada pelo próprio Mercado Pago permanece fora do controle desta aplicação. O provedor remoto utilizado no smoke é isolado, sem credenciais privadas e sem novo pagamento externo. Banco principal não utilizado; documentos de entrega não regenerados.

Comandos: exports web com e sem `EXPO_PUBLIC_API_URL`, seguidos por `node scripts/capture-evidence.mjs qa-full-local-ui-3.11` e `node scripts/capture-evidence.mjs qa-full-payment-ui-3.11`. Builds usam `--clear` para garantir a URL pública correta.
