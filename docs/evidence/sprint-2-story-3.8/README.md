# Evidências — Story 3.8: visual branco e ouro

Data: 21/11/2026. Adaptação seletiva da referência visual, preservando a base funcional deste repositório.

## Gates e regressão

Lint e typecheck aprovados; `npm test`: **93/93**, nenhuma falha ou caso desabilitado. Builds web local e conectado aprovados. A regressão final tem **110 jornadas web**, sem falhas, overflow horizontal ou marcadores WF/ST em texto/atributos perceptíveis.

| Manifesto em docs/evidence/ | Jornadas |
| --- | ---: |
| qa-visual-3.8/capture-results.json | 36 |
| qa-full-local-visual-3.8/capture-results.json | 45 |
| qa-full-api-visual-3.8/capture-results.json | 6 |
| qa-full-payment-visual-3.8/capture-results.json | 10 |
| qa-catalog-local-visual-3.8/capture-results.json | 7 |
| qa-catalog-api-visual-3.8/capture-results.json | 6 |

Os casos visuais incluem cinco áreas em 320/390 px, amostras em 360 px, fonte a 130%, foco de campo/botão/navegação e mouse pressionado. `interactionChecks` comprova Tab até Entrar, contorno de foco 3 px e ativação por Enter até o catálogo. O estado pressionado usa ouro `rgb(174,132,38)` e contorno escuro; o foco usa `rgb(90,67,16)`. As combinações reais também são verificadas por testes de contraste.

As regressões originais utilizam fixture isolada de dois produtos para os fluxos controlados. As duas suítes de catálogo utilizam o catálogo ampliado de 32 itens, conferem imagens naturais 768×432, proporção 16:9, filtros, dados equivalentes, rolagem até o último item, fallback e atualização de cache antigo. Sete arquivos JSON foram efetivamente baixados e verificados nas regressões local/pagamento.

O checkout destas suítes usa provedor controlado. Não houve nova compra no Mercado Pago real nesta story. O comprovante externo anterior permanece preservado e identificado como histórico.

## Preservação e rastreabilidade

`validation-summary.json` registra os resultados, a verificação de 42 arquivos da referência e 74 arquivos protegidos do destino contra os hashes anteriores. Backend, banco principal, persistência, integrações, dados, capas, dependências e ambientes preservados. Nenhum token privado foi importado. Os baselines e logs de trabalho ficam em `tmp/visual-3.8/`, fora do pacote de evidências finais.

A documentação principal recebe capturas do tema atual; a edição anterior da story 3.7 está em `documentos/historico/story-3.7/` com hashes registrados no README. O relatório da Sprint 1 não foi alterado. O parecer final fica em `docs/qa/gates/3.8-visual-branco-ouro-copy-neutra.yml`.

O PDF atual tem **106 páginas**. As 25 páginas alteradas foram inspecionadas individualmente em resolução original; as outras 81 tiveram os pixels de conteúdo comparados por SHA256 à edição anterior já revisada, excluindo apenas os 65 pixels inferiores do rodapé. QA repetiu independentemente a comparação. Sumário e paginação final, seis nomes/RAs e preservação de 66 mídias históricas foram conferidos; `document-validation.json` registra hashes e verificação de ausência de placeholders, glifos substitutos e token privado. A imagem da aprovação externa anterior permanece histórica; a nova biblioteca branca é explicitamente o fluxo local simulado.

## Reprodução dos exports

Para alternar a configuração pública entre export local e conectado, usar `expo export --platform web --clear`: o cache do Metro pode reutilizar a transformação da variável pública de um export anterior. O harness agora valida o endpoint compilado antes de iniciar o Chrome, evitando interpretar a variante errada como falha do aplicativo.

O export local foi emitido em `dist-web/`, sem `EXPO_PUBLIC_API_URL`; o conectado foi emitido em `tmp/auditoria/dist-web-sync/`, com `EXPO_PUBLIC_API_URL=http://127.0.0.1:3107`. `EXPO_NO_DOTENV=1` evita carregar ambientes privados durante as evidências. O servidor e o Chrome headless são iniciados/encerrados pelo harness; os bancos são temporários e isolados. Rodar as suítes sequencialmente porque compartilham as portas do executor.

## DoD

- [x] Critérios visuais/textuais implementados e escopo funcional preservado.
- [x] Sem novas dependências, configuração privada ou mudança de modelo/API.
- [x] Gates estáticos, suíte completa, builds e regressões executados.
- [x] Contraste, foco, teclado, imagens e cenários de erro verificados.
- [x] Histórico e pendências existentes preservados; HU-12 não declarada concluída.
- [x] File List, checklist e registros documentais atualizados para revisão QA.
- [N/A] Cobertura percentual adicional: não existe limiar configurado; não foi inventado um percentual.
- [N/A] CodeRabbit desabilitado neste fluxo; não se alega execução.

Falhas iniciais do executor (marcadores removidos, caractere Enter incompleto e export conectado com cache local) foram diagnosticadas e corrigidas sem desativar os cenários. Imagens dessas tentativas ficam apenas em `tmp/visual-3.8/diagnostics/`; os manifestos e imagens publicados acima correspondem às rodadas finais aprovadas.
