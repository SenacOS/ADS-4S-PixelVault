# Evidências — Story 3.2 / Item 2.1

**Data:** 20/11/2026. Fontes: roteiro da segunda entrega, item 2.1; HU-13; aula 07; Story 3.1. Decisão: `docs/architecture/project-decisions/3.2-crud-sincronizacao.md`.

**Parecer final:** CONCERNS, 90/100. Story 3.2 em Done. Implementação do item 2.1 concluída; TEST-001 registra exclusivamente a validação nativa pendente. Gate: `docs/qa/gates/3.2-crud-api-sincronizacao.yml`.

## Validação

- Documentação consultada antes do código: [Expo SQLite SDK 54](https://github.com/expo/expo/blob/sdk-54/docs/pages/versions/v54.0.0/sdk/sqlite.mdx) e [Node 22 Crypto](https://nodejs.org/docs/latest-v22.x/api/crypto.html). Mantido `expo-sqlite 16.0.10`, sem nova dependência.
- `npm test`: **56/56 PASS**. Inclui 12 testes novos em `tests/catalog-sync.test.mjs`: CRUD/autorização, rollback, conflito, recibo após reinício, resposta HTTP perdida, erro de gravação do ACK, três operações encadeadas, edição durante HTTP, migração legada, lista de campos permitidos, login cancelado e migração seletiva de hashes.
- Lint e typecheck: PASS, exit 0, zero warnings do lint.
- `npm run build -- --clear`: PASS, export Android, 618 módulos.
- Export web com API e `npm run build:web:evidence -- --clear` sem API: PASS.
- Regressão final: **21/21 PASS**, zero overflow, em `docs/evidence/sprint-2-regression-3.2/capture-results.json`; mesmos fontes dos exports revisados pelo QA. Somada ao E2E integrado, são 24 jornadas web aprovadas.
- Testes HTTP executados fora do sandbox com portas/bancos temporários. `TEMP`/`TMP` direcionados a `tmp/auditoria` para o Hermes. O banco compartilhado da demonstração não foi recriado.
- As confirmações de escrita são validadas antes de remover operações da fila; respostas 2xx inválidas mantêm as pendências.
- Leituras iniciadas antes de alterações/ACK não substituem um catálogo mais recente, mesmo após a fila ficar vazia. Login cancelado e resposta HTTP com JSON inválido não liberam autenticação offline indevida.

## E2E aplicativo + API real

Preparação PowerShell:

```powershell
$env:EXPO_PUBLIC_API_URL = 'http://127.0.0.1:3107'
npx expo export --platform web --clear --output-dir tmp/auditoria/dist-web-sync
node scripts/capture-evidence.mjs sprint-2-story-3.2
```

O executor inicia API real na porta 3107, banco descartável e Chrome headless. A porta deve estar livre. Não usa nem apaga o banco da demonstração. O bloqueio da API na simulação offline afeta apenas as requisições do navegador à porta 3107.

| Cenário | Verificação | Captura |
| --- | --- | --- |
| CRUD integrado | Criação e edição verificadas por GET real; reload; exclusão confirmada no servidor. | `crud-servidor.png` |
| Retomada offline | API bloqueada, criação, tentativa falha, reload, fila recuperada, novo login online e envio confirmado no backend. | `retomada-offline.png` |
| Conflito | Outra sessão altera o produto; envio local recebe conflito; confirmação explícita recupera versão remota. | `conflito-resolvido.png` |

**Resultado:** 3/3 PASS; largura do conteúdo igual à viewport, sem overflow horizontal. JSON registra ações e verificações do servidor. As capturas foram inspecionadas visualmente. A sessão/credencial é mantida somente em memória e não aparece no snapshot local ou nos resultados.

Para regressão sem API: remover `EXPO_PUBLIC_API_URL` do terminal, exportar com `npm run build:web:evidence -- --clear` e executar `node scripts/capture-evidence.mjs sprint-2-regression-3.2`. O `--clear` é necessário ao alternar configurações nos exports para não reutilizar uma transformação com a URL anterior.

## Limites de validação

`adb devices` foi repetido neste incremento e retornou lista vazia. Driver Expo, encerramento/reabertura nativos e acessibilidade nativa permanecem pendentes. SQLite Node exercita SQL; Chrome exercita o adaptador web. Export Android não equivale a execução em aparelho. O procedimento nativo está registrado nas evidências da Story 3.1.

O escopo concluído do item 2.1 é o CRUD do cadastro principal e sua sincronização. Sessão persistente de HU-12, cadastro real, carrinho/pedido no backend e pagamento Mercado Pago não são declarados concluídos. CodeRabbit não executado, conforme padrão anterior; revisão manual e QA aplicados.
