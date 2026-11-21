# PixelVault — rodada completa de QA antes do pagamento

**Data:** 20/11/2026. **Story:** 3.4. **Solicitação:** revisar botões, campos e funcionalidades antes de discutir a integração Mercado Pago.

**Status:** Done; QA CONCERNS, 90/100, somente pela validação nativa pendente.

## Escopo e achados

A rodada ampliou a regressão com eventos de mouse via CDP, envio por teclado, estados desabilitados, cancelamentos, campos vazios/espaços, preços inválidos, limites de texto, armazenamento, sincronização com API real e downloads JSON.

Foram corrigidos cadastro com e-mail duplicado/espaços/maiúsculas, valores monetários fora do contrato e descrição multilinha recusada pela API. O cadastro efêmero ganhou entrada explicitamente local quando há API configurada, sem receber sessão ou permissões de servidor. O texto administrativo foi ajustado à persistência existente.

As falhas anteriores foram preservadas e os cenários ampliados repetidos. A matriz por controle/campo, comandos, arquivos de resultado e limitações estão em `docs/evidence/qa-full/README.md`. O parecer formal fica em `docs/qa/gates/3.4-regressao-completa-pre-pagamento.yml`.

**Resultado final executado:** 68/68 testes automatizados, 45/45 jornadas locais e 6/6 com API real. Os 49 modelos de botão observados foram acionados no conjunto; nove rótulos cobrem 11 posições de formulário. Seis JSONs reais foram baixados e conferidos. Lint, typecheck e exports Android/web passaram; zero overflow horizontal nas 51 jornadas.

## Continuidade

Mercado Pago não foi implementado nesta rodada. O próximo passo é combinar a modalidade de checkout, preparar conta/aplicação e credenciais de teste no backend e definir como a aplicação receberá a confirmação do pagamento. Cadastro persistente e criação de pedido no servidor precisam ser considerados nesse fluxo; o checkout atual permanece simulado.

Teste nativo continua pendente por ausência de aparelho/emulador. Nenhum resultado web é apresentado como confirmação de SQLite, teclado ou compartilhamento em dispositivo.
