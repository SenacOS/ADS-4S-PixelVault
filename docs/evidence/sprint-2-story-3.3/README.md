# Evidências — Item 2.2 / Story 3.3

**Data:** 20/11/2026. Fontes: roteiro da segunda entrega, item 2.2; autorização do usuário para exportação sem dashboard; Stories 3.1/3.2. ADR: `docs/architecture/project-decisions/3.3-exportacao-json.md`.

**Gate final:** CONCERNS, 90/100; Story 3.3 Done. TEST-001: escrita/compartilhamento reais no aparelho pendentes. Parecer em `docs/qa/gates/3.3-exportacao-json.yml`.

## Contrato

Arquivo `pixelvault-dados-<instante-ISO-seguro>.json`, UTF-8, MIME `application/json`. Campos: `formato`, `versao`, `geradoEm`, `demonstrativo`, `origem`, `moeda`, `sincronizacao`, `catalogo`, `carrinho`, `totalCarrinhoCentavos`, `biblioteca`, `pedido`. Preços/totais são inteiros; pedido é demonstrativo e seus totais/quantidade são recalculados.

Metadados de sincronização informam quantidade de operações, alteração local e legado sem histórico; não contêm operações, atores ou credenciais. Os dados vêm do cache e não representam necessariamente o último estado do servidor. Sem conta ativa, não se assume o jogador padrão.

## Dependências e documentação

Consulta do endereço exigido `https://docs.expo.dev/versions/v54.0.0/` redirecionou para latest no leitor. Foram lidas as fontes oficiais específicas do [FileSystem SDK 54](https://github.com/expo/expo/blob/sdk-54/docs/pages/versions/v54.0.0/sdk/filesystem.mdx) e [Sharing SDK 54](https://github.com/expo/expo/blob/sdk-54/docs/pages/versions/v54.0.0/sdk/sharing.mdx), além das declarações TypeScript instaladas.

Instalação: `npm install 'expo-file-system@~19.0.24' 'expo-sharing@~14.0.8' --ignore-scripts --no-audit --no-fund`, exit 0. Versões correspondem ao mapa `expo/bundledNativeModules.json`. Sem mudança do SDK.

## Testes

- `tests/json-export.test.mjs`: sete cenários novos de contrato, ausência/mudança de conta, centavos e totais, lista permitida, catálogo vazio/legado, dados inválidos, disponibilidade/falhas de entrega e mensagem neutra ao fechar compartilhamento.
- Subcentavos como 1.005/1.001 são rejeitados; ruído binário de 0.1+0.2 é tolerado. Objetos inseridos em campos textuais são rejeitados antes de serializar.
- Os testes de entrega nativa usam funções injetadas: comprovam sequência/contrato, não o driver em aparelho.
- Suíte completa: 63/63 PASS. Logs locais: `tmp/auditoria/story-3.3-tests.log`, `story-3.3-build.log`, `story-3.3-web.log`.
- Lint/typecheck: PASS, exit 0. Exports web/Android com `--clear`: PASS; Android 632 módulos. `npx expo install --check`: PASS usando mapa local offline do SDK 54.
- E2E final: quatro casos, cinco downloads reais e 21 jornadas de regressão PASS; nenhum overflow horizontal. Capturas inspecionadas visualmente pelo QA.

## E2E de arquivo real

Após `npm run build:web:evidence -- --clear`, executar:

```powershell
node scripts/capture-evidence.mjs sprint-2-story-3.3
```

O Chrome recebe pasta de download exclusiva por cenário. O executor clica no botão real duas vezes no mesmo ciclo para verificar a trava, aguarda o `.json` completo no disco e valida seu conteúdo, valores, conta e ausência de dados proibidos. Não basta observar feedback ou simular o download.

| Caso | Verificação |
| --- | --- |
| `export-catalogo` | Arquivo válido com dois produtos e conta vazia. |
| `export-conta-atual` | Compra demonstrativa: dois itens, total 10480; nova conta exporta carrinho/biblioteca vazios. |
| `export-admin-offline` | Produto criado sem API disponível aparece no JSON, com uma operação pendente. |
| `export-erro-retentativa` | Falha de Blob mostra erro; tentativa posterior baixa o arquivo. |

`capture-results.json` registra arquivos/bytes/contagens; os downloads reais ficam em `downloads/<caso>/`. Capturas PNG documentam o feedback. Regressão anterior é executada separadamente em `sprint-2-regression-3.3`, preservando os registros históricos.

## Validação em aparelho

`adb devices` foi conferido nesta execução e retornou lista vazia. Escrita/compartilhamento nativos não executados.

Quando houver runtime SDK 54 disponível: entrar no jogador, criar carrinho/pedido demonstrativo, exportar sem API, selecionar destino no compartilhamento e abrir o JSON para conferir conteúdo/centavos. Repetir no administrador, com outra conta, fechando o compartilhamento e tentando novamente; confirmar ausência de credenciais/chaves. Registrar dispositivo, sistema e resultado real. Não confundir export Android com execução desses passos.
