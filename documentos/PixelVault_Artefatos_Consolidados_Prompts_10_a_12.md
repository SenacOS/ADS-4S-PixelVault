# PixelVault - Artefatos Consolidados dos Prompts 10 a 12

**Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis**  
**Produto:** PixelVault - Loja de Jogos para Cloud Gaming  
**Versão do consolidado:** 1.0  
**Data da consolidação:** 14/09/2026  
**Conteúdo:** artefatos completos da Fase 4 - Ambiente React Native e interfaces iniciais

> Este arquivo reúne os três artefatos produzidos a partir dos Prompts 10, 11 e 12. O conteúdo consolida somente resultados comprovados no repositório, nas stories, nos gates de qualidade e nas evidências reais. Limitações de ambiente permanecem registradas e nenhum teste não executado é apresentado como aprovado.

## Regras de uso e precedência

1. O índice abaixo é o mapa oficial entre prompt, código de seção e artefato consolidado.
2. Cada artefato fica entre os marcadores HTML `ARTEFATO-Pxx-INICIO` e `ARTEFATO-Pxx-FIM`, permitindo localização textual mesmo quando o leitor não processar links internos.
3. A seção `A09` do consolidado dos Prompts 1 a 9 permanece a especificação de UX prevalente sobre o wireframe A08 versão 0.2.
4. A seção `A10` registra a configuração inicial; a experiência visual implementada em `A11` substitui a tela provisória de preparação descrita em `A10`.
5. A seção `A12` substitui os atalhos e estados apenas demonstrativos de `A11` por interações reais em memória. Em divergências de comportamento funcional, `A12` prevalece sobre `A11`.
6. Os dados, credenciais, pedido, chaves e pagamento descritos são fictícios e exclusivos da demonstração acadêmica.
7. Persistência, autenticação real, API, SQLite, Mercado Pago real e processamento financeiro permanecem fora do incremento documentado.
8. Os gates `CONCERNS` dos três prompts não bloquearam a conclusão das stories. Os concerns e limitações continuam registrados nos respectivos artefatos e não devem ser omitidos no relatório final.

<a id="indice-artefatos"></a>

## Índice de artefatos

| Seção | Origem | Artefato | Localização no consolidado |
|---|---|---|---|
| `A10` | Prompt 10 | Configuração do projeto Expo e organização do código | [Abrir seção](#artefato-p10) |
| `A11` | Prompt 11 | Componentes visuais e cinco áreas funcionais iniciais | [Abrir seção](#artefato-p11) |
| `A12` | Prompt 12 | Interações acadêmicas do protótipo | [Abrir seção](#artefato-p12) |

---

<a id="artefato-p10"></a>

## A10 - Prompt 10: Configuração do projeto e organização do código

**Artefato de referência:** `docs/stories/1.1.configuracao-projeto-expo.md`  
**Localização estável:** seção `A10`, entre `ARTEFATO-P10-INICIO` e `ARTEFATO-P10-FIM`

<!-- ARTEFATO-P10-INICIO -->

# PixelVault - Configuração do Projeto Expo e Organização do Código

**Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis**  
**Item atendido:** 1.4 - Configuração do Ambiente e Interface Inicial  
**Responsável:** Integrante 4 - RA: `[RA-4]`  
**Story associada:** 1.1 - Configuração do projeto Expo e organização do código  
**Versão:** 1.0 - ambiente validado e organização concluída  
**Data da validação:** 14/09/2026  
**Status:** Done  
**Gate de qualidade:** CONCERNS - 80/100, sem bloqueio

> Este artefato registra o estado real da base Expo/React Native, os comandos reproduzíveis, a estrutura inicial e as verificações técnicas executadas. Ele não declara como concluídas as interfaces e interações que pertencem aos Prompts 11 e 12.

## 1. Objetivo

Validar a base existente do PixelVault em React Native com Expo SDK 54, manter o projeto em JavaScript, organizar uma estrutura pequena para telas, componentes, dados e integrações e fornecer instruções que outro integrante consiga reproduzir a partir do lockfile.

## 2. Escopo atendido

- projeto Expo existente auditado antes das alterações;
- versões declaradas e instaladas conferidas com a documentação oficial do Expo SDK 54;
- entrada única do aplicativo preservada;
- estrutura mínima de código criada com módulos ativos;
- comandos de lint, análise estática, testes e build adicionados;
- instalação limpa, export Android e inicialização do Metro verificadas;
- README com instalação, execução, estrutura, limitações e preparação responsiva;
- fronteira de pagamento mantida explicitamente simulada;
- preparação documental para `COR-01` a `COR-06`, `RESP-01` a `RESP-16` e `UXT-01` a `UXT-14`.

Não foram implementados nesta etapa CRUD funcional, jornada completa, autenticação, persistência, API Node, SQLite ou Mercado Pago real.

## 3. Ambiente validado

| Item | Versão ou configuração observada | Classificação |
|---|---|---|
| Sistema de projeto | Expo/React Native em JavaScript | Mantido |
| Node.js | `v22.18.0` | Instalado no ambiente de validação |
| npm/npx | `11.5.2` | Instalado no ambiente de validação |
| Expo CLI | `54.0.27` | Executado localmente |
| Expo | `54.0.37` no lockfile; faixa `~54.0.36` no `package.json` | Compatível com SDK 54 |
| React | `19.1.0` | Declarado e instalado |
| React Native | `0.81.5` | Declarado e instalado |
| Expo Status Bar | `3.0.9`; faixa `~3.0.9` | Declarado e instalado |
| Orientação | `portrait` | Configurada em `app.json` |

A documentação oficial versionada associa o Expo SDK 54 ao React Native 0.81, ao React 19.1 e ao Node.js mínimo 20.19.x. Não foi realizada migração para TypeScript nem atualização não solicitada de SDK.

## 4. Estrutura organizada

```text
App.js                         composição raiz do aplicativo
index.js                       registro do componente Expo
app.json                       configuração do projeto
package.json                   dependências e scripts
package-lock.json              instalação reproduzível
README.md                      ambiente, execução e limitações
src/
  screens/                     telas do aplicativo
  components/                  componentes com reutilização real
  data/                        dados locais e fictícios
  integrations/                limites de integrações simuladas
tests/                         regressões mínimas
```

Na conclusão do Prompt 10, a entrada seguia `index.js` → `App.js` → `ProjectReadyScreen`. Essa tela provisória foi substituída no Prompt 11, mas a organização criada permaneceu como base do aplicativo.

## 5. Dependências e justificativas

| Dependência | Finalidade |
|---|---|
| `expo`, `react`, `react-native` | Núcleo do aplicativo Expo/React Native. |
| `expo-status-bar` | Controle da barra de status presente na composição. |
| `eslint`, `eslint-config-expo` | Gate de lint compatível com o Expo. |
| `typescript`, `@types/react` | Análise estática de JavaScript por `allowJs` e `checkJs`, sem migração do projeto. |

As dependências web e de área segura foram adicionadas apenas no Prompt 11. Não foram introduzidos Redux, biblioteca de navegação, framework visual, backend ou biblioteca de pagamento.

## 6. Comandos reproduzíveis

### 6.1 Instalação e compatibilidade

```powershell
npm ci
npx expo install --check
npx expo-doctor
```

### 6.2 Inicialização

```powershell
npm start
npm run android
npm run web
```

O comando `npm start` inicia o Metro e disponibiliza o QR code para o Expo Go quando computador e celular estão na mesma rede. A execução iOS requer macOS/Xcode.

### 6.3 Qualidade e build

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## 7. Evidências técnicas registradas

| Verificação | Resultado real |
|---|---|
| `npm ci` | PASS; 976 pacotes instalados a partir do lockfile. |
| `npm run lint` | PASS após declarar o ambiente Node para o teste CommonJS. |
| `npm run typecheck` | PASS. |
| `npm test` | PASS; 4/4 regressões estruturais. |
| `npm run build` | PASS; export Android com 577 módulos e bundle Hermes de aproximadamente 1,73 MB. |
| `npx expo install --check` | PASS; `Dependencies are up to date`. |
| `npx expo-doctor` | PASS; 18/18 verificações. |
| Metro offline | PASS; alcançou `Metro waiting` e foi encerrado de forma controlada. |
| `git diff --check` | PASS; apenas avisos de normalização LF/CRLF em arquivos preexistentes. |

## 8. Preparação para responsividade e acessibilidade

O README passou a exigir verificação em orientação retrato nas referências:

- `390 × 844 px`;
- largura intermediária de `360 px`;
- `320 × 568 px`;
- fonte ampliada a pelo menos `130%`.

Também foram registrados os contratos futuros de ausência de rolagem horizontal, uma coluna em 320 px, quebra controlada, área segura, rolagem vertical, navegação sem sobreposição, texto secundário mínimo de 14 dp, alvo de toque mínimo de `44 × 44 dp`, formulários utilizáveis com teclado e estados que não dependem somente de cor.

Esses critérios foram preparados, mas não declarados como integralmente testados no Prompt 10, pois as telas completas ainda não existiam.

## 9. Problemas reais encontrados e tratamento

| Problema observado | Contexto | Tratamento ou situação final |
|---|---|---|
| `TypeError: fetch failed` | Primeira instalação em ambiente com rede restrita. | Execução repetida com acesso autorizado; instalação concluída. |
| Lint falhou por `__dirname` | Teste CommonJS analisado sem ambiente Node. | Ambiente `node` declarado no flat config; repetição aprovada. |
| Expo Doctor aguardou rede/cache | Primeira tentativa restrita. | Processo encerrado e repetido com acesso; 18/18 checks. |
| Flags incompatíveis | `--offline` e `--localhost` usados juntos. | Inicialização corrigida para `npx expo start --offline --port 8099`. |
| Vulnerabilidades transitivas | `npm audit` indicou 7 moderadas e 9 altas, nenhuma crítica. | Não aplicado `npm audit fix --force`; correção oferecida exigia Expo 57, incompatível com o escopo. |

## 10. Resultado da revisão de qualidade

O gate foi `CONCERNS`, com nota 80/100 e transição da story para `Done`. Não houve falha de compilação, instalação ou inicialização. Os dois concerns originais foram:

1. a tela provisória usava textos de 12/13 dp e padding fixo, abaixo dos contratos futuros de `RESP-10` e `RESP-07`;
2. a árvore transitiva do Expo/Metro possuía 16 advisories sem correção compatível com o SDK 54.

O primeiro concern foi corrigido pela implementação do Prompt 11, que introduziu texto mínimo, insets dinâmicos e inspeção responsiva. O segundo permanece como dívida técnica monitorada.

## 11. Limitações e continuidade

- O Prompt 10 validou a base, não a jornada funcional completa.
- Os testes `UXT-01` a `UXT-14` ainda dependiam das telas e interações dos prompts seguintes.
- A tela provisória e seus componentes foram removidos por substituição no Prompt 11.
- Banco local, API Node e Mercado Pago pertencem a etapas posteriores.
- O projeto permanece preso ao SDK 54 por requisito; atualizações maiores exigem decisão separada.

## 12. Conclusão

O Prompt 10 entregou uma base Expo SDK 54 reproduzível, em JavaScript, com estrutura enxuta, comandos de qualidade operacionais, README e evidências reais de instalação, build e inicialização. A base foi considerada adequada para receber as interfaces e interações dos Prompts 11 e 12.

## 13. Referências internas

- `docs/stories/1.1.configuracao-projeto-expo.md`;
- `docs/qa/gates/1.1-configuracao-projeto-expo.yml`;
- `README.md`;
- `package.json` e `package-lock.json`;
- `documentos/PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md`, seções A03, A06, A08 e A09;
- documentação oficial do Expo SDK 54: `https://docs.expo.dev/versions/v54.0.0/`.

<!-- ARTEFATO-P10-FIM -->

[Voltar ao índice de artefatos](#indice-artefatos)

---

<a id="artefato-p11"></a>

## A11 - Prompt 11: Componentes visuais e cinco áreas funcionais iniciais

**Artefato de referência:** `docs/stories/1.2.componentes-visuais-cinco-areas.md`  
**Localização estável:** seção `A11`, entre `ARTEFATO-P11-INICIO` e `ARTEFATO-P11-FIM`

<!-- ARTEFATO-P11-INICIO -->

# PixelVault - Componentes Visuais e Cinco Áreas Funcionais Iniciais

**Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis**  
**Item atendido:** 1.4 - Configuração do Ambiente e Interface Inicial  
**Responsável:** Integrante 5 - RA: `[RA-5]`  
**Story associada:** 1.2 - Componentes visuais e cinco áreas funcionais iniciais  
**Versão:** 1.0 - interfaces navegáveis e evidenciadas  
**Data da validação:** 14/09/2026  
**Status:** Done  
**Gate de qualidade:** CONCERNS - 80/100, sem bloqueio

> Este artefato documenta a implementação visual e navegável das cinco áreas funcionais. O recorte do Prompt 11 apresenta telas, estados e continuidade visual; as regras completas de validação e mutação são registradas no Prompt 12.

## 1. Objetivo

Substituir a tela provisória por uma experiência visual navegável que represente acesso, catálogo, compra, biblioteca e administração, seguindo a revisão A09, utilizando componentes do React Native e reutilização apenas onde existe repetição concreta.

## 2. Cinco áreas implementadas

| Área funcional | Telas | Resultado entregue |
|---|---|---|
| Acesso | `WF-01`, `WF-02` | Login, cadastro, erro e entradas demonstráveis para jogador e administrador. |
| Catálogo | `WF-03`, `WF-04` | Filtros, cartões, detalhe e separação entre compatibilidade cloud e ativação. |
| Carrinho e checkout | `WF-05`, `WF-06`, `WF-07` | Dois itens, total contínuo, formulário e resultado explicitamente simulados. |
| Biblioteca | `WF-08` | Dois itens da compra, tipos, ativações e chaves fictícias. |
| Administração | `WF-09`, `WF-10`, `WF-11` | Lista local, modos de inclusão/edição e confirmação nominal de exclusão. |

## 3. Inventário de telas e estados

| ID | Conteúdo principal comprovado |
|---|---|
| `WF-01` | Login com marca textual, campos rotulados e entradas por perfil. |
| `WF-02` | Cadastro com nome, e-mail, senha e retorno ao login. |
| `WF-03` | Catálogo, filtros `Todos`, `GeForce NOW` e `Boosteroid`, contador e navegação. |
| `WF-04` | Detalhes do produto, compatibilidade, ativação e aviso de disponibilidade. |
| `WF-05` | Carrinho com dois itens, quantidade 2 e total `R$ 104,80`. |
| `WF-06` | Checkout com o mesmo resumo e aviso de ausência de cobrança. |
| `WF-07` | Resultado com pedido fictício, quantidade e total preservados. |
| `WF-08` | Biblioteca com os dois itens e chaves marcadas como fictícias. |
| `WF-09` | Lista administrativa e ações para novo, editar e excluir. |
| `WF-10` | Formulário compartilhado em modos `Novo item` e `Editar item`. |
| `WF-11` | Confirmação que identifica o item e permite cancelar ou excluir. |
| `ST-01` | Login com erro textual e valores preservados. |
| `ST-02` | Catálogo vazio com filtro ativo e `Limpar filtro`. |
| `ST-03` | Carrinho vazio, total zero e checkout indisponível. |
| `ST-04` | Biblioteca vazia e ação `Ir ao catálogo`. |
| `ST-05` | Checkout com erro próximo ao campo e resumo preservado. |

Todos os estados eram renderizáveis e alcançáveis na demonstração visual. A produção dos estados por regras funcionais reais foi concluída no Prompt 12.

## 4. Componentes e organização visual

Foram utilizados `View`, `Text`, `Image`, `StyleSheet`, Flexbox, `TextInput`, `Pressable` e listas do React Native. As abstrações compartilhadas foram limitadas a necessidades repetidas:

| Componente | Responsabilidade |
|---|---|
| `ScreenShell` | Área segura, teclado, rolagem e estrutura comum das telas. |
| `AppText` | Variações tipográficas e semântica de cabeçalho. |
| `AppButton` | Ações primárias, secundárias e destrutivas com alvo mínimo. |
| `LabeledField` | Campo com rótulo persistente, erro e propriedades acessíveis. |
| `ProductCard` | Conteúdo recorrente dos produtos por contexto. |
| `FeedbackBanner` | Mensagem textual de sucesso, informação ou erro. |
| `EmptyState` | Estados vazios e respectiva recuperação. |
| `BottomNavigation` | Ordem fixa `Catálogo`, `Carrinho`, `Biblioteca`. |

Não foi adicionada biblioteca visual, roteador ou gerenciador global de estado. A navegação visual usa estado React e `Pressable`.

## 5. Identidade visual provisória

A08 não aprovava marca gráfica, paleta, tipografia ou capas finais. Por isso, a implementação:

- reutilizou os tons provisórios da Story 1.1, com fundo `#0b1020`, superfícies `#18233a`, destaque `#70d6ff` e tipografia clara;
- manteve a fonte do sistema;
- utilizou fallback neutro e local com a identificação `CAPA ILUSTRATIVA`;
- não baixou imagens externas nem declarou uma identidade final aprovada;
- marcou pedido, chaves e lojas de ativação não aprovadas como fictícios.

## 6. Dados e continuidade visual

A mesma fonte local alimenta as telas críticas:

| Produto | Tipo | Preço | Uso na jornada |
|---|---|---:|---|
| Orbit Raiders | Jogo | R$ 79,90 | Catálogo, detalhe, carrinho, checkout, resultado, biblioteca e administração. |
| Neon Expansion | DLC | R$ 24,90 | Catálogo, detalhe, carrinho, checkout, resultado, biblioteca e administração. |

O carrinho, checkout e resultado exibem quantidade 2 e total `R$ 104,80`. A biblioteca contém os mesmos dois itens, corrigindo a inconsistência do wireframe anterior (`COR-01`). Produto, plataforma cloud, compatibilidade e loja de ativação permanecem conceitos separados.

## 7. Navegação e perfis

- O aplicativo inicia em `WF-01`.
- A entrada de jogador leva a `WF-03`.
- A entrada de administrador/curador leva a `WF-09`.
- O jogador navega na ordem `Catálogo`, `Carrinho`, `Biblioteca`.
- O administrador percorre lista, formulário compartilhado e confirmação de exclusão.
- O parâmetro `?screen=` existe somente no Expo Web para captura reproduzível; o runtime nativo inicia de forma segura em `WF-01`.

No Prompt 11, os perfis eram atalhos demonstrativos porque credenciais exatas ainda não haviam sido aprovadas. O Prompt 12 substituiu esses atalhos por preenchimento e submissão do formulário.

## 8. Responsividade e acessibilidade

As interfaces foram verificadas em `390 × 844`, `360 × 844` e `320 × 568`, sempre em retrato. Foram aplicados:

- `SafeAreaProvider` e insets dinâmicos;
- rolagem vertical sem rolagem horizontal;
- uma coluna nas larguras reduzidas;
- navegação sem encobrir o conteúdo;
- texto secundário mínimo de 14 dp;
- alvos de toque de 48 dp;
- rótulos persistentes, senha protegida e teclado apropriado para e-mail;
- quebra de títulos, preços, avisos e erros;
- mensagens e seleções expressas por texto, não apenas por cor;
- escala tipográfica web de 130%;
- foco visível em campo, botão e aba;
- nomes, funções e estados acessíveis nos controles.

As 27 execuções registraram `innerWidth === scrollWidth` e zero elemento com overflow horizontal.

## 9. Contraste e foco

| Uso | Razão calculada | Meta | Resultado |
|---|---:|---:|---|
| Botão secundário | 13,14:1 | ≥ 4,5:1 | PASS |
| Borda contra fundo | 5,14:1 | ≥ 3:1 | PASS |
| Borda contra superfície | 4,25:1 | ≥ 3:1 | PASS |
| Controle desabilitado | 4,71:1 | ≥ 4,5:1 | PASS |
| Foco contra fundo | 13,13:1 | ≥ 3:1 | PASS |
| Foco contra superfície | 10,87:1 | ≥ 3:1 | PASS |

## 10. Evidências produzidas

O comando reproduzível é:

```powershell
npm run evidence:capture
```

O processo exporta o Expo Web, serve o conteúdo localmente, opera o Chrome headless por CDP e grava PNGs e metadados em `docs/evidence/prompt-11/`.

| Grupo | Evidências principais |
|---|---|
| Acesso | `wf-01-login-390x844.png`, `wf-02-cadastro-390x844.png`, `st-01-login-erro-390x844.png` |
| Catálogo | `wf-03-catalogo-390x844.png`, variantes 360/320 e `wf-04-detalhes-390x844.png` |
| Compra | `wf-05-carrinho-390x844.png`, `wf-06-checkout-390x844.png`, `wf-07-resultado-390x844.png` |
| Biblioteca | `wf-08-biblioteca-390x844.png`, `st-04-biblioteca-vazia-390x844.png` |
| Administração | `wf-09-admin-390x844.png`, `wf-10-novo-item-390x844.png`, `wf-10-editar-item-390x844.png`, `wf-11-exclusao-390x844.png` |
| Estados | `st-02-catalogo-vazio-390x844.png`, `st-03-carrinho-vazio-390x844.png`, `st-05-checkout-erro-390x844.png` |
| Acessibilidade | Capturas de fonte 130%, campo focado, botão focado e navegação focada |

O lote final contém 27 PNGs válidas. UXT-03 e UXT-04 foram capturados após clique real nos destinos de jogador e administrador.

## 11. Diferenças entre wireframe e implementação

| Tela/área | Diferença | Motivo | Impacto e situação |
|---|---|---|---|
| Todas | Cores provisórias e fonte do sistema. | Não havia identidade final aprovada. | Coerência visual mantida; identidade final continua pendente. |
| Acesso | Atalhos locais por perfil, sem credenciais exatas. | Os valores ainda não haviam sido aprovados no Prompt 11. | Permitiram demonstrar destinos; substituídos pelo fluxo funcional do Prompt 12. |
| Produtos | Capas neutras com iniciais. | Não existiam capas aprovadas em `assets/`. | Estrutura preservada sem uso indevido de imagens externas. |
| Detalhe/biblioteca/formulário | Loja de ativação fictícia. | Valor exato não aprovado. | Compatibilidade e ativação continuam separadas. |
| Resultado/biblioteca | Pedido e chaves fictícios. | Ausência de backend e identificadores aprovados. | Fluxo coerente sem alegar dado real. |
| Estados visuais | Alguns feedbacks podiam aparecer para inspeção. | O Prompt 11 exigia estados alcançáveis, não regras completas. | Comportamento real concluído no Prompt 12. |
| Expo Web | Seletor `?screen=`. | Captura reproduzível de cada WF/ST. | Restrito à evidência; não altera o início nativo. |
| Formulários | Sem captura de teclado virtual móvel. | Chrome headless não abre teclado e não havia dispositivo ADB. | Foco/rolagem verificados; validação nativa permaneceu pendente. |

## 12. Gates e resultado da qualidade

| Verificação | Resultado |
|---|---|
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 9/9 regressões |
| `npm run build` | PASS; export Android com 598 módulos |
| Expo dependency check | PASS |
| Expo Doctor | PASS; 18/18 |
| Metro offline | PASS |
| `git diff --check` | PASS |
| Evidências | PASS; 27 PNGs, sem overflow horizontal |

O gate final foi `CONCERNS`, nota 80/100, com a story promovida para `Done`.

## 13. Problemas e limitações reais

- a instalação inicial falhou por rede restrita e foi repetida com acesso autorizado;
- o primeiro lote de capturas perdeu a conexão com o Metro e foi descartado;
- o capturador passou a usar export web estático e validação fail-fast;
- a primeira tentativa de fonte ampliada usou zoom de página, foi rejeitada e substituída por `fontScale=1.3` aplicado a texto e input;
- o ADB não encontrou dispositivo, portanto teclado virtual e leitor de tela nativos não foram testados;
- permaneceram 16 vulnerabilidades transitivas do Expo/Metro, nenhuma crítica, cuja correção proposta exigia Expo 57;
- o checklist/template QA referenciado pelo framework não estava disponível no caminho declarado, sem impedir a revisão manual.

## 14. Conclusão

O Prompt 11 entregou as cinco áreas funcionais, `WF-01` a `WF-11`, `ST-01` a `ST-05`, componentes reutilizáveis, continuidade visual, responsividade, acessibilidade básica e 27 evidências reais. Não houve integração externa ou persistência. A base ficou pronta para as interações funcionais em memória do Prompt 12.

## 15. Referências internas

- `docs/stories/1.2.componentes-visuais-cinco-areas.md`;
- `docs/qa/gates/1.2-componentes-visuais-cinco-areas.yml`;
- `docs/evidence/prompt-11/README.md` e `capture-results.json`;
- `.ai/decision-log-1.2.md`;
- `src/screens/`, `src/components/`, `src/data/` e `src/theme/`;
- `documentos/PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md`, seções A07 a A09.

<!-- ARTEFATO-P11-FIM -->

[Voltar ao índice de artefatos](#indice-artefatos)

---

<a id="artefato-p12"></a>

## A12 - Prompt 12: Interações acadêmicas do protótipo

**Artefato de referência:** `docs/stories/1.3.interacoes-academicas-prototipo.md`  
**Localização estável:** seção `A12`, entre `ARTEFATO-P12-INICIO` e `ARTEFATO-P12-FIM`

<!-- ARTEFATO-P12-INICIO -->

# PixelVault - Interações Acadêmicas do Protótipo

**Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis**  
**Item atendido:** 1.4 - Configuração do Ambiente e Interface Inicial  
**Responsável:** Integrante 6 - RA: `[RA-6]`  
**Story associada:** 1.3 - Interações acadêmicas do protótipo  
**Versão:** 1.0 - fluxo funcional local concluído  
**Data da validação:** 14/09/2026  
**Status:** Done  
**Gate de qualidade:** CONCERNS - 80/100, sem bloqueio

> Este artefato documenta a transformação das interfaces navegáveis em um protótipo funcional com estado local e dados fictícios. Não há autenticação, persistência, API, banco de dados ou pagamento real. Recarregar o aplicativo restaura a massa inicial.

## 1. Objetivo

Adicionar interações suficientes para demonstrar o fluxo acadêmico de cadastro e login, catálogo, carrinho, checkout simulado, biblioteca e CRUD, preservando dados, quantidades e total durante uma única sessão.

## 2. Estado e arquitetura funcional

`PixelVaultApp` concentra com `useState` os estados compartilhados necessários:

- rota atual;
- perfil autenticado fictício;
- catálogo local;
- produto selecionado;
- filtro ativo;
- carrinho;
- biblioteca;
- pedido simulado;
- contas criadas na sessão;
- formulários, erros e feedbacks.

As regras de filtro, adição sem duplicidade, remoção, total, validação, CRUD e biblioteca idempotente foram separadas do JSX em `src/domain/prototypeLogic.mjs`. Catálogo, carrinho, biblioteca e administração usam `FlatList`, com `ScreenShell` adaptado para não aninhar rolagem vertical equivalente.

## 3. Estado inicial da sessão

| Estado | Valor inicial |
|---|---|
| Rota nativa | `WF-01` |
| Catálogo | Orbit Raiders e Neon Expansion |
| Filtro | `Todos` |
| Carrinho | Vazio |
| Biblioteca | Vazia |
| Pedido | Nenhum |
| Perfil | Nenhum |
| Feedback | Nenhum |

O seletor `?screen=` e `?fontScale=` continua disponível somente no Expo Web para produção de evidências. No Expo Go, o código não acessa `window.location` e retorna aos padrões `WF-01` e escala 1.

## 4. Cadastro e login

### 4.1 Cadastro

- nome, e-mail e senha são controlados por `TextInput`;
- os três campos são obrigatórios após remoção de espaços externos;
- erros permanecem associados aos respectivos campos;
- cadastro válido cria uma conta somente em memória;
- após sucesso, a aplicação retorna ao login e exibe `FB-01`;
- a conta recém-criada pode entrar durante a mesma sessão.

### 4.2 Perfis fictícios aprovados

| Perfil | E-mail | Senha | Destino |
|---|---|---|---|
| Jogador | `jogador@pixelvault.example` | `demo123` | `WF-03` |
| Administrador/curador | `admin@pixelvault.example` | `demo123` | `WF-09` |

Os botões `Preencher jogador` e `Preencher administrador` apenas preenchem os campos. O usuário ainda precisa submeter o formulário, e combinações inválidas produzem `ST-01`.

## 5. Catálogo e filtro

- a lista usa o catálogo local compartilhado pelos dois perfis;
- a seleção é única entre `Todos`, `GeForce NOW` e `Boosteroid`;
- o filtro consulta o campo `compatibleWith` de cada produto;
- resultado vazio produz `ST-02`;
- `Limpar filtro` restaura `Todos`;
- abrir detalhes preserva o objeto correto por `id`;
- alterações do administrador aparecem no catálogo do jogador durante a mesma sessão.

## 6. Carrinho

- o produto selecionado é adicionado por `id`;
- a primeira adição emite `FB-02`;
- uma tentativa repetida não altera quantidade nem total e emite `FB-03`;
- o botão informa `Já está no carrinho`;
- qualquer item pode ser removido;
- quantidade e total são derivados do array atual, sem total hardcoded;
- ao remover o último item, `ST-03` mostra `R$ 0,00` e desabilita o checkout;
- com os dois produtos, quantidade e total são 2 e `R$ 104,80`.

## 7. Checkout e pedido simulado

O formulário contém somente os dois campos aprovados:

1. `Número do cartão fictício`;
2. `Nome impresso fictício`.

A validação verifica apenas se ambos estão preenchidos após `trim`. Não foram inventadas regras de bandeira, CVV, validade ou algoritmo financeiro.

- submissão inválida mantém carrinho e resumo, associa erros e não cria pedido ou biblioteca;
- submissão válida cria um único pedido local com identificador fictício;
- o resultado preserva os itens, quantidade e total do carrinho;
- o aviso `Pagamento simulado — nenhuma cobrança será realizada` aparece antes e depois da confirmação;
- os valores digitados no formulário não são persistidos nem exibidos após a submissão.

## 8. Biblioteca

- antes da compra, a biblioteca exibe `ST-04`;
- após o pedido, recebe uma ocorrência de cada produto comprado;
- Orbit Raiders e Neon Expansion aparecem com tipo, loja e chave fictícia aplicável;
- a inclusão é idempotente: abrir novamente o mesmo pedido não duplica itens nem chaves;
- a identidade por `id` é preservada entre catálogo, carrinho, pedido e biblioteca.

## 9. CRUD administrativo

O mesmo formulário atende inclusão e edição. São obrigatórios:

- nome;
- tipo `Jogo` ou `DLC`;
- preço numérico positivo, aceitando vírgula ou ponto;
- descrição;
- ao menos uma compatibilidade entre `GeForce NOW` e `Boosteroid`;
- loja de ativação.

### 9.1 Inclusão

Gera `id` local monotônico (`local-1`, `local-2`, ...), atualiza a lista, retorna a `WF-09` e apresenta `FB-04`.

### 9.2 Edição

Carrega os dados do item selecionado, mantém o mesmo `id`, atualiza a lista compartilhada e apresenta `FB-05`.

### 9.3 Exclusão

`WF-11` identifica nominalmente o item. Cancelar retorna sem mutação; confirmar remove somente o item selecionado e apresenta `FB-06`. Efeitos retroativos sobre carrinho ou biblioteca ficaram fora deste recorte.

## 10. Feedbacks funcionais

| ID | Evento | Texto aprovado |
|---|---|---|
| `FB-01` | Cadastro válido | `Cadastro concluído. Entre com as credenciais de demonstração.` |
| `FB-02` | Primeira adição | `Item adicionado ao carrinho.` |
| `FB-03` | Adição repetida | `Este item já está no carrinho.` |
| `FB-04` | Inclusão administrativa | `Item cadastrado na lista local.` |
| `FB-05` | Edição administrativa | `Alterações salvas na lista local.` |
| `FB-06` | Exclusão administrativa | `Item excluído da lista local.` |

Cada feedback aparece somente depois do evento correspondente, possui função acessível e não é exibido simultaneamente por padrão com outros feedbacks.

## 11. Continuidade dos dados

```text
Catálogo local
   ├── jogador consulta e filtra
   └── administrador cria, edita e exclui
            ↓ mesmos IDs
Carrinho → Checkout → Pedido fictício → Biblioteca
```

O contrato foi verificado com os dois produtos e total `R$ 104,80`. O pedido guarda um snapshot dos itens e do total, sem guardar dados digitados no checkout.

## 12. Testes automatizados

A suíte usa o executor nativo `node:test`, sem biblioteca adicional:

- 9 regressões estruturais preservadas;
- 8 testes de regras funcionais;
- 17/17 testes aprovados.

Os testes cobrem filtro, total, duplicidade, remoção, cadastro/login, checkout válido e inválido, biblioteca idempotente e CRUD de criação, atualização e exclusão.

## 13. Roteiro UXT executado

| Caso | Resultado observado | Status | Evidência |
|---|---|---|---|
| `UXT-01` | Cadastro vazio permaneceu em WF-02 e marcou os três campos. | PASS | `uxt-01-cadastro-invalido-390x844.png` |
| `UXT-02` | Conta local criada, retorno a WF-01 e FB-01 visível. | PASS | `uxt-02-cadastro-valido-390x844.png` |
| `UXT-03` | Credencial do jogador abriu WF-03. | PASS | `uxt-03-login-jogador-390x844.png` |
| `UXT-04` | Credencial administrativa abriu WF-09. | PASS | `uxt-04-login-admin-390x844.png` |
| `UXT-05` | Exclusão administrativa refletiu no catálogo; filtro produziu ST-02 e limpeza restaurou a lista. | PASS | `uxt-05-filtro-vazio-390x844.png`; `uxt-05-filtro-limpo-390x844.png` |
| `UXT-06` | Segunda adição manteve uma ocorrência e exibiu FB-03. | PASS | `uxt-06-duplicidade-390x844.png` |
| `UXT-07` | Remoção final produziu ST-03, total zero e checkout indisponível. | PASS | `uxt-07-carrinho-vazio-390x844.png` |
| `UXT-08` | Dois itens chegaram ao checkout com total `R$ 104,80`. | PASS | `uxt-08-checkout-dois-itens-390x844.png` |
| `UXT-09` | Checkout vazio marcou ambos os campos e não criou pedido. | PASS | `uxt-09-checkout-invalido-390x844.png` |
| `UXT-10` | Campos preenchidos criaram pedido fictício e WF-07. | PASS | `uxt-10-checkout-valido-390x844.png` |
| `UXT-11` | Biblioteca mostrou os dois itens e duas chaves fictícias sem duplicação. | PASS | `uxt-11-biblioteca-pos-compra-390x844.png` |
| `UXT-12` | Criar, editar, cancelar exclusão e confirmar exclusão atualizaram a mesma lista e emitiram FB-04 a FB-06. | PASS | `uxt-12-crud-criado-390x844.png`; `uxt-12-crud-completo-390x844.png` |
| `UXT-13` | Cinco jornadas críticas repetidas em 320 × 568, sem overflow. | PASS | `uxt-13-*.png` |
| `UXT-14` | Fonte 130%, foco e ausência de overflow aprovados na web; teclado virtual e leitor de tela nativos não executados. | PARTIAL | `uxt-14-*.png` |

## 14. Evidências e reprodução

O comando reproduzível é:

```powershell
npm run evidence:capture:prompt12
```

O lote executa sessões limpas, preenche campos, aciona botões reais e grava resultados em `docs/evidence/prompt-12/`.

Resultados do lote:

- 21/21 capturas geradas;
- viewports `390 × 844`, `360 × 844` e `320 × 568`;
- fonte web 1,3× nos dois cenários de UXT-14;
- nenhuma ocorrência de overflow horizontal;
- ações, asserções, viewport e foco registrados em `capture-results.json`.

## 15. Quality gates

| Verificação | Resultado |
|---|---|
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 17/17 |
| `npm run build` | PASS; export Android com 599 módulos |
| `npx expo install --check` | PASS |
| `npx expo-doctor` | PASS; 18/18 |
| Metro offline | PASS |
| `git diff --check` | PASS |
| Inspeção visual | PASS; 21/21 capturas verificadas |

O gate final foi `CONCERNS`, nota 80/100, sem achado bloqueante. A story passou de `InReview` para `Done`.

## 16. Limitações e concerns registrados

1. `UXT-14` permanece parcial: o ADB não encontrou dispositivo ou emulador, então teclado virtual e leitor de tela nativos não foram executados. Foco, escala tipográfica de 130% e ausência de overflow foram verificados no Expo Web.
2. `npm audit` registrou 16 vulnerabilidades transitivas da árvore Expo/Metro: 7 moderadas, 9 altas e nenhuma crítica. A correção automática exige Expo 57 e não foi aplicada porque o projeto deve permanecer no SDK 54.
3. CodeRabbit estava indisponível no WSL. A revisão manual independente foi realizada pelo QA.
4. FB-02 e FB-05 foram rastreados no código e no fluxo, mas não possuem capturas isoladas próprias; uma futura suíte de componentes pode ampliar essa evidência.
5. O estado é somente local e reinicia ao recarregar, conforme o escopo acadêmico.

## 17. Segurança e limites do protótipo

- não existem segredos ou credenciais reais;
- as credenciais `.example` são fixtures públicas de demonstração;
- não existe autenticação segura, token ou autorização persistente;
- não existe backend, API ou SQLite neste incremento;
- o checkout não chama gateway e não processa cobrança;
- números e nomes digitados no checkout não são persistidos;
- pedido e chaves não possuem valor comercial.

## 18. Resultado final

O Prompt 12 completou o fluxo acadêmico demonstrável da Fase 4. Jogador e administrador/curador podem entrar por formulários, o catálogo pode ser filtrado e alterado localmente, o carrinho impede duplicidade e recalcula o total, o checkout valida os campos aprovados e cria um pedido simulado, e a compra chega à biblioteca sem duplicação. O incremento atende os 17 critérios de aceitação e mantém documentadas as limitações nativas e transitivas sem inventar resultados.

## 19. Referências internas

- `docs/stories/1.3.interacoes-academicas-prototipo.md`;
- `docs/qa/gates/1.3-interacoes-academicas-prototipo.yml`;
- `docs/evidence/prompt-12/README.md` e `capture-results.json`;
- `.ai/decision-log-1.3.md`;
- `src/domain/prototypeLogic.mjs`;
- `tests/prototype-interactions.test.mjs`;
- `scripts/capture-evidence.mjs`;
- `README.md`;
- `documentos/PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md`, seção A09.

<!-- ARTEFATO-P12-FIM -->

[Voltar ao índice de artefatos](#indice-artefatos)
