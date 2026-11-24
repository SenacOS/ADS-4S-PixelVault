# Evidências — Sprint 2, Story 3.1

**Data:** 20/11/2026. **Escopo:** cache persistente no aplicativo, dados demonstrativos por conta e consulta do catálogo da API. Revisão de arquitetura registrada em `docs/architecture/project-decisions/3.1-persistencia-local.md`.

**Gate formal:** CONCERNS, 90/100; Story 3.1 em Done. Única ressalva aberta: TEST-001, execução do driver em aparelho/emulador. Parecer em `docs/qa/gates/3.1-persistencia-local-integracao-catalogo.yml`.

## Fontes e dependência

- A URL solicitada `https://docs.expo.dev/versions/v54.0.0/` foi consultada; o serviço de leitura redirecionou para `latest`. Para não usar a versão atual por engano, foi lida a [fonte oficial específica do SDK 54](https://github.com/expo/expo/blob/sdk-54/docs/pages/versions/v54.0.0/sdk/sqlite.mdx).
- `node_modules/expo/bundledNativeModules.json` indica `expo-sqlite ~16.0.10`; a dependência e o lockfile foram atualizados sem alterar o SDK.
- Instalação: `npx expo install expo-sqlite -- --ignore-scripts`; o sandbox falhou com `ENOTFOUND`. Repetição fora do sandbox: `npm install --ignore-scripts --no-audit --no-fund`, exit 0, dois pacotes adicionados.
- `npx expo install --check`: exit 0, dependências compatíveis segundo o mapa local do SDK; rede desabilitada, portanto sem alegar validação online.

## Verificações automatizadas

O arquivo `tests/mobile-persistence.test.mjs` cobre reabertura de SQLite em disco, preservação de compatibilidades, isolamento, catálogo vazio, lista de campos permitidos, falhas de gravação, fila de escritas, formato incompatível, rede offline, resposta atrasada após edição e descarte de instância, fechamento idempotente, timeout e cliente contra API real em porta/bancos isolados.

O teste SQLite usa `node:sqlite` como executor do mesmo SQL e contrato assíncrono. **Não executa o driver Expo e não comprova SQLite no aparelho.** O servidor da integração usa somente dados temporários; o banco demonstrativo compartilhado não foi reinicializado.

Os testes HTTP exigiram execução fora do sandbox. Para o build Hermes, `TEMP` e `TMP` foram direcionados à pasta absoluta `tmp/auditoria` do projeto, após falha de permissão na pasta temporária virtualizada. Não houve alteração do código para ocultar falhas do ambiente.

| Gate | Resultado final |
| --- | --- |
| `npm run lint` | PASS, exit 0, zero warnings. |
| `npm run typecheck` | PASS, exit 0. |
| `npm test` | PASS, 44/44, exit 0; 11 cenários novos. |
| `npm run build` | PASS, export Android, 617 módulos. |
| `npm run build:web:evidence` | PASS, export web. |
| `npx expo install --check` | PASS com mapa local do SDK 54 (rede desabilitada). |
| E2E de persistência | PASS, 4/4 cenários, sem overflow horizontal. |
| E2E de regressão | PASS, 21/21 cenários do protótipo, sem overflow horizontal. |
| ADB | Nenhum dispositivo conectado; execução nativa pendente. |

Logs locais de execução: `tmp/auditoria/story-3.1-tests.log`, `story-3.1-build.log` e `story-3.1-web-build.log`. O parecer formal de QA e o registro acima permanecem versionáveis mesmo que os arquivos temporários sejam removidos.

## Fluxos web de persistência

Comando reproduzível após `npm run build:web:evidence`:

```powershell
node scripts/capture-evidence.mjs sprint-2-story-3.1
```

| Cenário | Asserção | Evidência |
| --- | --- | --- |
| Carrinho após reload | Login novamente recupera Orbit Raiders e total R$ 79,90. | `cart-restored.png` |
| Biblioteca após reload | Os dois produtos são recuperados; armazenamento não contém senha ou dados financeiros digitados. | `library-restored.png` |
| CRUD administrativo após reload | Item criado continua no catálogo administrativo. | `admin-crud-restored.png` |
| Isolamento | Outra conta demonstrativa não recebe o carrinho do jogador; viewport 320×568. | `user-isolation.png` |

`capture-results.json` registra ações, viewports e métricas. Cada cenário limpa o armazenamento antes de iniciar e conserva os dados durante o reload do próprio caso. Essa limpeza existe exclusivamente no executor de evidências. A aplicação não limpa o armazenamento ao iniciar.

Capturas de carrinho e biblioteca foram inspecionadas visualmente; métricas confirmam largura de conteúdo igual à viewport (390 ou 320 px). A regressão dos fluxos anteriores é executada com `node scripts/capture-evidence.mjs sprint-2-regression`, em pasta separada para preservar as evidências históricas do Prompt 12.

Esses fluxos utilizam o adaptador web e catálogo demonstrativo local. A integração cliente/API real é verificada separadamente no teste HTTP; não se atribui ao E2E web uma sincronização que ele não executou.

## Validação nativa pendente

`adb devices`, executado fora do sandbox, iniciou o daemon e retornou lista vazia. Não foi possível executar o driver em aparelho ou emulador. A exportação Android é evidência de bundle compatível, não de execução nativa.

Procedimento quando houver aparelho:

1. Inicializar a API e configurar `API_HOST=0.0.0.0` e `EXPO_PUBLIC_API_URL` com o IP LAN acessível. No emulador padrão, usar `10.0.2.2`.
2. Abrir o aplicativo em runtime compatível com SDK 54; entrar na conta demonstrativa e adicionar item ao carrinho.
3. Encerrar completamente o processo do aplicativo, abrir novamente, entrar na mesma conta e confirmar o carrinho.
4. Repetir CRUD e checkout simulado; confirmar compatibilidades, biblioteca e pedido após reabertura.
5. Desligar a API/rede e repetir abertura/consulta; confirmar preservação dos dados e feedback de erro na atualização.
6. Alternar conta e verificar isolamento; verificar teclado nativo, fonte ampliada e leitor de tela.
7. Registrar dispositivo, sistema, runtime, data, capturas e resultados; corrigir falhas antes de remover a ressalva de QA.

## Limites

- Snapshot local separado do banco relacional do servidor; formato versão 1, sem migração destrutiva automática.
- Login/cadastro/sessão permanecem em memória. Isolamento por ID demonstrativo não é autenticação.
- CRUD persistido somente localmente; `catalogDirty` impede sobrescrita até futura sincronização de escrita.
- Biblioteca originada por checkout simulado; Mercado Pago permanece indisponível.
- Dashboard retirado do escopo pelo usuário; pitch será em vídeo; exportação JSON posterior.
- CodeRabbit não executado; integração registrada como desabilitada no padrão anterior. Revisão manual, arquitetura e testes foram usados.
