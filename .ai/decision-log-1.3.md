# Decision Log: Story 1.3

**Data:** 2026-09-14  
**Agente:** @dev (Dex)  
**Modo:** yolo

## Decisões

1. Manter todo estado de sessão em `PixelVaultApp` com `useState`, callbacks explícitos e funções puras, sem Context, roteador ou dependência nova.
2. Usar o `id` como identidade em catálogo, carrinho, pedido e biblioteca; IDs administrativos seguem contador `local-N`.
3. Validar somente obrigatoriedade no cadastro/checkout e, no CRUD, os campos aprovados e preço positivo; nenhuma regra financeira foi criada.
4. Deixar `FlatList` controlar a rolagem nas quatro listas, adicionando modo não rolável ao `ScreenShell`.
5. Estender o capturador existente com cenários CDP sequenciais; query string permanece exclusiva do Expo Web e o nativo inicia em WF-01.

## Verificações e limite

Todos os gates e 21 capturas passaram. UXT-14 confirmou foco, fonte 130% e ausência de overflow na web; teclado virtual e leitor de tela nativos permaneceram não executados porque `adb devices -l` não encontrou dispositivo.
