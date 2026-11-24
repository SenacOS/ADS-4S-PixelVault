# Story 3.6 — catálogo ampliado e imagens locais

**Data:** 21/11/2026. **Status:** Done; QA CONCERNS, 90/100. 89 testes e 74 jornadas web aprovados. A única ressalva é a execução nativa pendente; runtime web/Android exportados não equivalem a teste em aparelho.

## Dados e assets

- 30 jogos fictícios adicionados;32 produtos-base = 31 jogos + 1 DLC, com os dois originais preservados.
- 32 capas específicas +1 genérica, PNG 768×432, 262727 bytes no total, produzidas por `scripts/generate-catalog-covers.mjs` sem dependências ou downloads de terceiros.
- O manifesto `src/data/catalogExpansion.json` é compartilhado por cliente/bootstrap; não há novo campo de URL no CRUD/banco.
- `packaged-covers.json` comprova por comparação de bytes que os 33 PNGs constam do export Android. Os89 testes automatizados passaram, incluindo integridade/decodificação de PNG, migrações, cache e regressões anteriores.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | PASS, sem erros/avisos. |
| `npm run typecheck` | PASS. |
| `npm test` | PASS, 89/89. |
| `npm run build -- --clear` | PASS, Android 669 módulos; 33 capas comprovadamente empacotadas. |
| Export web com e sem API | PASS, ambos com `--clear`. |
| `qa-catalog-local` | PASS, 7/7. |
| `qa-catalog-api` | PASS, 6/6. |
| Regressão anterior de navegação/sync/checkout | PASS, 45 locais + 6 API + 10 checkout. Total geral: 74 jornadas e zero overflow. |
| Migração do banco de trabalho | PASS, 2→32, sem reset; tabelas protegidas/edições preservadas, zero FK e segunda abertura sem duplicação. |
| CodeRabbit | NOT RUN, desabilitado na story; revisão especializada manual @qa. |
| Dispositivo Android/iOS | NOT RUN; validação nativa permanece ressalva explícita. |

Logs locais ignorados: `tmp/auditoria/catalog-{lint,typecheck,tests,web-local,web-api,build-android,e2e-local}.log` e `qa-{catalog-api,full-local-catalog-regression,full-api-catalog-regression,full-payment-catalog-regression}.log`.

## Matriz do catálogo padrão real

As duas suítes de catálogo usam os defaults de 32 itens. A suíte API usa HTTP/SQLite reais em banco temporário; não chama Mercado Pago.

| Cenário | Evidência efetivamente verificada |
| --- | --- |
| `catalogo-lista-inicio-390` | Contador32 e captura do início da lista. |
| `catalogo-lista-final-320` | Rolagem completa,32 IDs/títulos/imagens e captura do último item. |
| `catalogo-32-imagens-390` | Todos 32, GeForce NOW 22, Boosteroid 21, retornoTodos 32; capa de cada produto carregada, URL única e proporção 16:9. Zenith Frontier abre detalhes e entra no carrinho com R$ 54,90. |
| `catalogo-32-imagens-320` |32 imagens carregadas; último/primeiro jogo novo acessíveis; Aurora Quest mostra descrição e entra no carrinho com R$ 19,90. |
| `catalogo-fallback-erro-e-recuperacao` | Bloqueio de PNG provoca `Image.onError` e mensagem acessível; desbloqueio/reload restaura32 imagens. |
| `catalogo-capa-generica-id-herdado` | Produto customizado de ID `constructor` abre detalhe e imagem genérica real carregada; não resolve propriedade herdada do mapa. |
| `catalogo-cache-antigo-atualizado` (local) | Cache anterior com dois itens/carrinho recebe expansão, mantém carrinho e persiste `catalogEdition=2`. |

O harness percorre a lista virtualizada e acumula32 IDs/títulos, sem presumir que todos os cards estejam no DOM simultaneamente. Para cada capa verifica `complete`, dimensões naturais768×432 e proporção renderizada16:9. Cada filtro possui contagem e URLs únicas registradas em `catalogChecks`.

`catalogSnapshot` compara os 32 registros canônicos por ID, nome, tipo, preço em centavos, descrição, loja e compatibilidades; a comparação é executada tanto no cliente local quanto no catálogo retornado pela API. Manifests:

- [Catálogo local](../qa-catalog-local/capture-results.json).
- [Catálogo API](../qa-catalog-api/capture-results.json).
- [Regressão local](../qa-full-local-catalog-regression/capture-results.json).
- [Regressão API](../qa-full-api-catalog-regression/capture-results.json).
- [Regressão checkout](../qa-full-payment-catalog-regression/capture-results.json).

As regressões anteriores são explicitamente executadas com uma fixture de dois produtos, restrita ao harness/banco temporário e cache semeado por CDP com marcador válido. Isso preserva os cenários anteriores sem alterar o default de 32 em produção. Capturas anteriores não foram reescritas como prova do catálogo novo.

Cliques usam eventos de mouse via CDP; campos usam eventos DOM no browser. Inspeção visual realizada nas telas início390, final320 e carrinho320: capas proporcionais, títulos/preços legíveis e sem overflow horizontal. Os arquivos com sufixo `-failed.png` de uma rodada anterior ficam preservados como registro de falha; o manifest final determina o resultado vigente.

## Persistência e correções

`existing-database-migration.json` registra a atualização real do banco de trabalho. Comparações internas confirmaram igualdade das tabelas de usuários, carrinhos, pedidos, pagamentos, biblioteca/chaves e dos produtos/compatibilidades anteriores. Apenas contagens/booleanos são publicados; credenciais/dados pessoais não constam da evidência.

Os testes cobrem migração única e repetida, exclusão posterior que não reaparece, ID existente com conteúdo/compatibilidade customizados, colisões em IDs de loja/plataforma e rollback sem marca de versão. No cache cobrem v1/legacyDirty, v2, outbox/DELETE, dados por conta, não restauração de original excluído, preservação do marcador em refresh/descarte e falha de gravação sem publicação ou perda.

Problemas encontrados e corrigidos:

1. O mapa de capas podia resolver propriedades herdadas para IDs como `constructor`; corrigido com `Object.hasOwn`, inclusive no gerador.
2. O `Image` web assumia altura intrínseca, apesar do aspectRatio; moldura16:9 com preenchimento absoluto100% corrigiu e recebeu verificação geométrica E2E.
3. A descrição já existia no domínio, mas não aparecia nos detalhes; passou a ser exibida e verificada.
4. O primeiro registro estático de imports PNG precisou de imports default tipados para compatibilidade com checkJs/Expo; typecheck final passou.
5. Asserções antigas de dois itens foram adaptadas para32 ou mantidas como fixtures explícitas. Nenhuma aquisição/pagamento anterior foi recriada pela ampliação.

## Reproduzir

```powershell
npm run catalog:covers
npm run lint
npm run typecheck
npm test
$env:TEMP=(Resolve-Path tmp/auditoria).Path
$env:TMP=$env:TEMP
$env:EXPO_PUBLIC_API_URL=''
npm run build:web:evidence -- --clear
node scripts/capture-evidence.mjs qa-catalog-local
node scripts/capture-evidence.mjs qa-full-local-catalog-regression
$env:EXPO_PUBLIC_API_URL='http://127.0.0.1:3107'
npx expo export --platform web --clear --output-dir tmp/auditoria/dist-web-sync
node scripts/capture-evidence.mjs qa-catalog-api
node scripts/capture-evidence.mjs qa-full-api-catalog-regression
node scripts/capture-evidence.mjs qa-full-payment-catalog-regression
npm run build -- --clear
```

Executar suítes de navegador sequencialmente: elas usam8097/3107/9223 e encerram seus próprios processos e bancos temporários. Não executar `db:init` sobre banco existente para aplicar a expansão; a abertura da API realiza a migração aditiva.

## DoD

- [x] Requisitos e arquitetura rastreados;30 adições/32 produtos-base e33 assets locais, sem dependências novas.
- [x] Migração não destrutiva, equivalência de domínio, testes de falha e preservação de dados verificados.
- [x]89 testes, lint/typecheck, builds e13 jornadas específicas do catálogo passaram.
- [x] Regressão final dos demais fluxos e parecer QA formal:45locais+6API+10checkout, total geral74. Gate CONCERNS 90/100 em `docs/qa/gates/3.6-catalogo-expandido-capas-locais.yml`; única ressalva nativa.
- [x] Story, File List, README, histórico, comandos e evidências preparados para revisão.
- [ ] Validação em aparelho/emulador, mantida como limitação; build/web não são execução nativa.
- [N/A] Nova compra externa, credenciais/produção e CodeRabbit; contrato de checkout não foi ampliado.
