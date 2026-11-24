# Story 3.12 — padronização de Review e Status

O DOCX `documentos/PixelVault_Relatorio_Final_Sprint2.docx` foi revisado usando os estilos reais da referência `documentos/PixelVault_Relatorio_Final_Sprint1.docx`, seção1.6.1 (páginas79–80 no Word).

A primeira entrega menciona Sprint Review no planejamento, mas não possui uma seção autônoma de Review com quadro equivalente. Por isso, o novo bloco usa a hierarquia e o padrão visual de tabelas da própria referência, conservando o conteúdo específico de Review já existente na Sprint2.

## Alterações

- `2.3.2 Sprint Review`: títulos e subtítulos na hierarquia da referência, prosa com o recuo original, tabela com cabeçalho azul, linhas alternadas e fonte textual da Sprint1. Conteúdo de incrementos e adaptação do backlog preservado.
- `2.3.3 Relatório de Status da Sprint 2`: mesma sequência do status da Sprint1: informações gerais, resumo executivo, status por área, entregas, métricas, cronograma e decisões. Progresso Geral e Qualidade em quadros separados de duas colunas, com cálculos e resultados atuais preservados.
- Numeração dos títulos adjacentes no item2.3 ajustada para manter a sequência. Sumário atualizado no Word.
- Estados continuam escritos por extenso, preservando as qualificações atuais. A tipografia18 reservada aos símbolos RAG da referência não foi aplicada a texto comum.

## Verificações

- Microsoft Word:107 páginas exportadas diretamente por EMF→PNG, sem geração de PDF. Inspeção visual detalhada das páginas afetadas82–85 e comparação com a referência79–80. Não se declara revisão visual integral das107 páginas.
- Integridade ZIP/OOXML aprovada; textos fora do escopo preservados (exceto numeração dos quatro títulos adjacentes e atualização esperada do sumário).
- Conteúdo das linhas originais de incrementos, áreas, indicadores e marcos preservado. A coluna Cálculo foi incorporada ao Resultado para seguir o quadro de duas colunas da referência; nenhum valor foi descartado.
-73 mídias preservadas byte a byte; relações de imagens/links iguais. Sem reintrodução de termos de simulação na prosa.
- Sprint1 e PDF atual da Sprint2 preservados por hash. Não executados gates do aplicativo, pois a tarefa não altera seu código.

SHA256:

| Arquivo | Hash |
| --- | --- |
| DOCX Sprint1, intacto | `5c959ea731a5bd8d9fd347c0b88bfbd071baa8c8e31b7ad877dd4d4c7caddccd` |
| PDF Sprint2, intacto | `99af87775b80830d54748f3b287417275d0ba4e9555ec5e4ee05669f605a1233` |
| DOCX Sprint2 antes | `b244dc2f880c7ee0afc4b14c20ba00fe7b7e74589b8d15e7b1c5ff1c29bf41f6` |
| DOCX Sprint2 revisado | `2434e514a8b0b561c3dafde4dd05cba8e79d146ceb4247c201fc92065cd6d53e` |

Backup, contrato de edição, validação programática e imagens de conferência: `tmp/docx-format-3.12/`, ignorado pelo Git. A revisão não altera fatos de entrega, pendências ou métricas para incluir mudanças posteriores de interface.
