# Evidências da consolidação documental — Story 3.7

Data: 21/11/2026. Escopo: documentos da segunda entrega, derivados do relatório real da Sprint 1. Nenhuma alteração de código de produto, gravação, criação de ZIP ou submissão nesta story.

## Artefatos e verificações

- Relatório editável/PDF: `documentos/PixelVault_Relatorio_Final_Sprint2.docx` e `.pdf`.
- Complementos: comunicação/status, encerramento/lições, roteiro de vídeo e matriz/checklist em `documentos/PixelVault_Sprint2_*.md` (ver File List da story).
- `validation-summary.json`: hashes, preservação do original e de 66 mídias históricas, seis nomes/RAs, seções exigidas, sumário atualizado e resultados dos gates.
- Lint e typecheck aprovados; `npm test`: 89 aprovados, 0 falhas. Executados nesta revisão documental. As 74 jornadas web são citadas a partir da rodada existente da story 3.6, sem duplicar contagens ou declarar nova execução E2E.
- Métricas rastreadas: Sprint 2 4/5 itens e 26/31 SP; acumulado 16/17 e 48/53 SP; HU-12 aberta. Capas: 32 específicas + 1 genérica para 32 produtos-base.

## Preservação e revisão visual

O arquivo original `PixelVault_Relatorio_Final_Sprint1.docx` permanece inalterado. O novo relatório preserva todo o desenvolvimento anterior como histórico, reorganizando a conclusão antiga em 1.7. A introdução, os novos capítulos e as evidências refletem o incremento posterior. As imagens antigas foram limitadas à largura útil, sem recorte ou substituição de mídia. As capturas de código históricas mantêm sua qualidade original; os trechos atuais são texto selecionável.

O sumário e as páginas foram atualizados com Microsoft Word invisível. Renderização pelo `render_docx.py` empacotado, usando Word como backend PDF porque LibreOffice não está instalado. PNGs e scripts de trabalho ficam apenas em `tmp/docs-sprint2/`, fora dos entregáveis. O parecer e o alcance da inspeção estão no gate 3.7.

A versão final tem **104 páginas**. A revisão anterior foi inspecionada individualmente em resolução original. Após os ajustes, 74 páginas finais mantiveram pixels de conteúdo idênticos às páginas já inspecionadas; a comparação independente de SHA256 excluiu somente os 65 pixels inferiores do rodapé. As 30 páginas alteradas foram novamente inspecionadas individualmente. A conferência final também verificou sumário e paginação. Foram corrigidos posicionamento flutuante de tabelas antigas, largura das imagens e legenda separada da figura. A qualidade e os recortes internos das capturas históricas não foram recriados nem apresentados como imagens novas.

## Pendências de entrega

Vídeo de até 10 minutos com seis participantes, criação/inspeção do pacote único, prazo específico e submissão no Blackboard. O roteiro prepara essas ações e não comprova que aconteceram. Credenciais e bancos privados não foram incorporados ao relatório; o checklist estabelece sua exclusão do pacote futuro.
