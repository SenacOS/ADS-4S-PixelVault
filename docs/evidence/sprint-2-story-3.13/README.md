# Story3.13 — atualização somente textual do modelo colado

Foi utilizada a versão salva pelo usuário, SHA256 `1a5070884cec8f6be562d8047e8033b6c93165e3a942c8fd431baebf0cd09e3b`. Somente o relatório colado no final, blocos671–719, foi adaptado à Sprint2. Nenhuma seção foi removida ou deslocada.

## Preservação

O patch altera somente o conteúdo dos elementos `w:t` no XML. Uma comparação do XML com os conteúdos desses elementos neutralizados comprovou igualdade byte a byte: mesmos runs, fontes, cores, estilos, alinhamentos, espaçamentos, margens, bordas, dimensões, linhas/células, cabeçalhos repetidos, propriedades RAG e quebras. Os textos foram distribuídos entre os runs existentes sem criar ou excluir elementos ou mudar atributos.

Todas as outras partes do pacote DOCX permanecem byte a byte iguais, incluindo73 mídias e relações. Blocos anteriores ao671 também são idênticos. O valor textual do status geral foi atualizado para amarelo; os demais símbolos RAG foram preservados e as áreas adaptadas à situação correspondente.

## Conteúdo e conferência

- Recorte:5 itens planejados,4 concluídos,80,0%; HU-12 segue pendente.
- Qualidade:93 testes executados e93 aprovados, sem atribuir um total desconhecido de bugs à Sprint2.
- Áreas:Node/SQLite, CRUD/sincronização, JSON, Checkout Pro de teste, biblioteca, catálogo de32 produtos/33 capas e apresentação final.
- Marcos e riscos foram adaptados ao histórico existente. Metas e ações são formuladas como planejamento; não foram inseridas aprovações ou reuniões inexistentes.
- Word em somente leitura: páginas108–111 renderizadas diretamente em PNG e inspecionadas, comparando com o bloco anterior. Documento com111 páginas; apenas as4 páginas finais foram exportadas por execução do renderizador. O resumo automático do script menciona o total de páginas, não a quantidade de PNGs efetivamente exportados.
- Nenhum PDF gerado. Não houve atualização de campos, sumário ou salvamento pelo Word, para preservar a estrutura do pacote. Nenhum teste do aplicativo foi necessário nesta edição documental.

DOCX final SHA256: `fabc97d2af7193e2e279cc2ce07a92166ad85e4c7c10ac15a7ddf059b7bb7f41`.

Sprint1 intacta: `5c959ea731a5bd8d9fd347c0b88bfbd071baa8c8e31b7ad877dd4d4c7caddccd`.

PDF intacto: `99af87775b80830d54748f3b287417275d0ba4e9555ec5e4ee05669f605a1233`.

Backup, mudanças por célula/parágrafo, prova estrutural e imagens: `tmp/docx-text-3.13/`. O arquivo principal só foi substituído após conferir que não havia outra alteração do usuário desde o backup.
