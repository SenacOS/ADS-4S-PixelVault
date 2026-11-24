# PixelVault

PixelVault é um aplicativo acadêmico em React Native que demonstra a jornada de uma loja digital de jogos e DLCs. O repositório reúne uma interface Expo para jogador e administrador, SQLite e uma API Node com demonstração local e Checkout Pro exclusivamente de teste.

> O aplicativo, a API e os dados são demonstrativos. Não use este projeto para processar credenciais, cartões ou pagamentos reais.

## Estado atual

A interface adota o tema **branco e ouro fosco**, integrado da outra versão do projeto sem substituir os fluxos atuais de persistência, API, checkout e exportação. A [story 3.8](docs/stories/3.8.visual-branco-ouro-copy-neutra.md) e o [registro da integração visual](documentos/PixelVault_Integracao_Visual_Branco_Ouro.md) descrevem o recorte e as novas evidências. Login pelos campos normais; avisos úteis de conta local e pagamento de teste permanecem visíveis.

A segunda entrega está consolidada no [relatório editável](documentos/PixelVault_Relatorio_Final_Sprint2.docx) e no [PDF](documentos/PixelVault_Relatorio_Final_Sprint2.pdf), preservando a primeira entrega. [Comunicação e status](documentos/PixelVault_Sprint2_Comunicacao_Review_Retrospectiva_Status.md), [encerramento e lições](documentos/PixelVault_Sprint2_Encerramento_Licoes_Aprendidas.md), [roteiro do vídeo](documentos/PixelVault_Sprint2_Roteiro_Pitch_Video.md) e [checklist](documentos/PixelVault_Sprint2_Matriz_Checklist_Entrega.md) registram o fechamento documental. A gravação e a submissão permanecem pendentes; HU-12 segue aberta.

O catálogo-base tem **32 itens (31 jogos e uma DLC)**, incluindo30 novos jogos fictícios. Todos possuem capas locais originais, visíveis sem serviço externo de imagens. Dados editados ou criados pelo usuário são preservados. [Catálogo ampliado e validação](documentos/PixelVault_Catalogo_Expandido_e_Capas_Locais.md).

| Componente | Implementação | Observação |
| --- | --- | --- |
| Aplicativo | Expo SDK 54, React 19.1 e React Native 0.81 | Executa em Android, iOS e web |
| Interface | Login, cadastro, catálogo, carrinho, checkout, biblioteca e administração | Catálogo e dados demonstrativos por conta persistidos; acesso permanece em memória |
| Banco | SQLite do servidor e cache SQLite independente no dispositivo | Web utiliza adaptador localStorage |
| API | Servidor HTTP feito com módulos nativos do Node.js | Disponível apenas para desenvolvimento local |
| Pagamento | Demonstração sem API e Checkout Pro de teste com reconciliação autenticada | Compra hospedada de teste aprovada, reconciliada e restaurada na biblioteca web |
| Qualidade | ESLint, TypeScript com `checkJs` e testes nativos do Node.js | Gates disponíveis por scripts npm |

## Pré-requisitos

**Windows: [roteiro simples de execução](documentos/PixelVault_Como_Executar.md).** Com Node.js 22.13+ e npm instalados, dê duplo clique em `Iniciar-PixelVault.cmd`: ele instala as dependências ausentes, cria o banco apenas se necessário e inicia API e web. Mantenha a janela aberta; encerre com Ctrl+C. Se `.env.mercadopago` existir, as credenciais de teste são carregadas somente no backend.

- Node.js `>=22.13` para executar também o módulo nativo `node:sqlite` sem flag adicional.
- npm compatível com a versão instalada do Node.js.
- Expo Go ou um emulador/dispositivo configurado para executar o aplicativo.
- macOS e Xcode para execução local em iOS.

O Expo SDK 54 requer no mínimo Node.js `20.19.x`; este projeto adota um requisito maior por causa do banco local. Consulte a [referência oficial do Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/).

## Instalação

Na raiz de um clone do repositório:

```powershell
npm ci
npx expo install --check
npx expo-doctor
```

O `package-lock.json` é a fonte usada para reproduzir as dependências. Não execute atualizações forçadas antes de validar a compatibilidade com o Expo SDK 54.

## Executando o aplicativo

```powershell
npm start
```

O Metro exibirá as opções disponíveis e o QR code para o Expo Go. Também é possível iniciar uma plataforma diretamente:

```powershell
npm run android
npm run ios
npm run web
```

O comando de iOS exige macOS. Em ambientes sem rede, o Expo CLI também oferece `npx expo start --offline`, desde que as dependências necessárias já estejam instaladas.

## Acesso demonstrativo

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Jogador | `jogador@pixelvault.example` | `demo123` |
| Administrador | `admin@pixelvault.example` | `demo123` |

Essas credenciais são demonstrativas. Com API configurada, os perfis existentes validam o hash no backend e recebem sessão de oito horas mantida somente em memória; apenas ADMIN pode escrever no catálogo. Logout ou reinício do servidor invalida a sessão. Sem rede, as contas demonstrativas permitem uso local, mas o envio exige entrar novamente com o backend disponível. Contas novas ainda são efêmeras: entram em modo local identificado, sem sessão nem permissões no servidor. E-mails são normalizados e duplicidades da sessão são rejeitadas; a senha continua exata. Carrinho, biblioteca e último pedido são recuperados por conta; o particionamento local não substitui autenticação persistente.

## Persistência e sincronização — Sprint 2, Stories 3.1 e 3.2

Android/iOS usam `expo-sqlite ~16.0.10`, compatível com SDK 54, para manter um cache próprio em `pixelvault-mobile.sqlite`. Esse cache guarda catálogo, compatibilidades, alterações administrativas locais e dados demonstrativos de cada conta. É independente das 13 tabelas relacionais do backend. Na web, o mesmo contrato usa `localStorage` por origem do navegador.

A leitura local termina antes de liberar as telas. Uma alteração só é apresentada como salva depois de persistida; erros preservam o estado confirmado. Senhas, sessão, tokens e campos financeiros não entram no armazenamento. Sem API, o checkout é simulado; com API, o app exige sessão online, prepara o pedido remoto de teste e consulta a aprovação no servidor. A referência de retomada é persistida por conta, sem URL de checkout ou token.

Para habilitar a leitura do catálogo da API, defina `EXPO_PUBLIC_API_URL` antes de iniciar o Expo, ou em um `.env` local. Essa variável é pública e não deve conter segredo. A inicialização consulta a API quando configurada e o catálogo oferece o botão **Atualizar catálogo da API**. Falhas mantêm os dados locais disponíveis.

| Ambiente | URL de exemplo |
| --- | --- |
| Web no computador | `http://127.0.0.1:3000` |
| Emulador Android padrão | `http://10.0.2.2:3000` |
| Aparelho físico | `http://IP-LAN-DO-COMPUTADOR:3000` |

No aparelho físico, mantenha computador e celular na mesma rede e inicie a API com `API_HOST=0.0.0.0`. Configure a URL com o IP real do computador. `127.0.0.1` no celular identifica o próprio aparelho. A API usa variáveis do processo; o Expo CLI carrega a configuração pública do app pelo `.env`.

Exemplo no PowerShell, com banco já inicializado:

```powershell
$env:API_HOST = '0.0.0.0'
npm run api:start
```

Em outro terminal, para o emulador Android:

```powershell
$env:EXPO_PUBLIC_API_URL = 'http://10.0.2.2:3000'
npm start
```

Criação, edição e exclusão são salvas localmente junto de uma fila durável. Após entrar como administrador, use **Sincronizar catálogo** para enviá-las ao SQLite do servidor e recuperar o catálogo remoto. O painel distingue alterações pendentes de sincronização concluída. A fila sobrevive a recarregamento e falhas de rede; recibos no servidor impedem repetição de operações, inclusive após reinício.

Alterações concorrentes retornam conflito sem apagar a fila nem sobrescrever o servidor. Revise os dados e, se optar pela versão remota, use **Recarregar versão do servidor**, seguido de confirmação. Essa ação descarta apenas as alterações do catálogo; carrinho/biblioteca são preservados. Produto com histórico de compra ou carrinho no servidor não pode ser excluído.

O snapshot da Story 3.1 é migrado sem perda. Catálogo antigo modificado sem histórico de operações não é enviado automaticamente: revise e confirme o recarregamento antes de refazer suas mudanças. Não se inferem exclusões antigas. Senhas e credenciais de sessão nunca entram na fila ou snapshot.

O backend aplica `database/migrations/001_catalog_sync.sql` ao iniciar, criando a tabela operacional de recibos além das 13 tabelas do domínio. Dados existentes são preservados. Somente os marcadores conhecidos de senha da seed antiga são convertidos em hashes scrypt; hashes personalizados não são substituídos. Não é necessário executar `db:init` para atualizar um banco existente.

Validação específica: `npm run mobile:test`. Evidências e procedimento nativo em [Story 3.1](docs/evidence/sprint-2-story-3.1/README.md). A execução do driver em aparelho/emulador continua pendente enquanto o ADB não listar dispositivo; build e testes SQLite Node não substituem esse teste.

CRUD e sincronização: `npm run sync:test`. [Evidências da conclusão do item 2.1](docs/evidence/sprint-2-story-3.2/README.md). Ao alternar URLs em exports de teste, use `--clear` para evitar reutilizar uma transformação Metro com a URL anterior.

## Exportar JSON — item 2.2, Story 3.3

No catálogo ou na administração, pressione **Exportar dados em JSON**. A exportação funciona com o cache local, sem consultar a API. No navegador, o botão solicita o download; no Android/iOS, prepara o arquivo e abre as opções de compartilhamento. Fechar essas opções não é apresentado como envio confirmado.

O formato `pixelvault-dados`, versão 1, contém data ISO, moeda BRL, contexto demonstrativo, catálogo, carrinho/biblioteca/último pedido somente da conta ativa e indicadores de pendência de sincronização. A origem é sempre identificada como cache local. Valores são inteiros em centavos; preços com fração de centavo precisam ser corrigidos antes da exportação.

Senhas, identidade da conta, sessão, tokens, formulários financeiros, chaves de ativação, dados de outras contas e conteúdo da fila de sincronização são excluídos. Sem conta ativa, somente o catálogo e metadados são exportados. O arquivo não altera o banco nem envia dados ao servidor. O dashboard permanece fora do escopo.

Dependências nativas compatíveis com SDK 54: `expo-file-system ~19.0.24` e `expo-sharing ~14.0.8`. Arquivos nativos são temporários no cache do app. Testes: `npm run export:test`. [Contrato e evidências](docs/evidence/sprint-2-story-3.3/README.md); execução real de escrita/compartilhamento no aparelho permanece separada dos testes web.

## Banco SQLite local

O esquema fica em `database/schema.sql`; `database/seed.sql` contém o catálogo completo de 32 produtos e suas compatibilidades. Esses dois arquivos SQL bastam para criar a base, sem depender de código JavaScript para adicionar os 30 jogos. Para criar ou recriar o banco:

```powershell
npm run db:init
```

O comando valida as chaves estrangeiras e gera `database/pixelvault.sqlite`. Esse arquivo é um artefato local ignorado pelo Git; altere sempre as fontes SQL, não o binário gerado.

Para atualizar um banco existente, inicie normalmente a API: a expansão é aplicada uma vez, sem recriar o banco ou substituir edições. O cache do app também recebe as adições ao reabrir, preservando contas e outbox. Não execute `db:init` para aplicar somente essa expansão a uma base que deseja conservar.

Para executar apenas os testes do banco:

```powershell
npm run db:test
```

O banco usa o módulo experimental `node:sqlite`, portanto o Node.js pode exibir um aviso durante a execução.

## API local

Inicialize o banco antes de iniciar o servidor:

```powershell
npm run db:init
npm run api:start
```

Por padrão, a API responde em `http://127.0.0.1:3000`.

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/health` | Estado do servidor e disponibilidade do modo de pagamento |
| `GET` | `/api/products` | Catálogo agrupado com loja e plataformas compatíveis |
| `GET` | `/api/products/:id` | Detalhe e revisão do produto |
| `POST` | `/api/sessions` | Login demonstrativo no backend, retorna usuário e credencial de sessão |
| `DELETE` | `/api/sessions/current` | Encerra a sessão informada |
| `POST` | `/api/products` | Cria produto e compatibilidades (ADMIN) |
| `PUT` | `/api/products/:id` | Atualiza produto e compatibilidades (ADMIN, revisão original) |
| `DELETE` | `/api/products/:id` | Exclui produto sem histórico (ADMIN, revisão original) |
| `GET` | `/api/users/:userId/library` | Biblioteca legada; exige sessão do próprio dono |
| `POST` | `/api/checkouts` | Prepara Checkout Pro de teste autenticado, com total do servidor |
| `GET` | `/api/checkouts/:id` | Retoma resumo e estado do pedido do dono |
| `POST` | `/api/checkouts/:id/reconcile` | Consulta e confirma pagamento no Mercado Pago; corpo `{}` |
| `GET` | `/api/me/library` | Aquisições remotas confirmadas do perfil autenticado |
| `POST` | `/api/payments` | Criação ou consulta idempotente de pagamento simulado |

O corpo aceito por `POST /api/payments` contém exclusivamente `pedidoId`. Totais, cartões, CVV, tokens e outras credenciais financeiras são rejeitados.

### Configuração da API

As variáveis reconhecidas estão documentadas em `.env.example`:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `API_HOST` | `127.0.0.1` | Interface de rede do servidor |
| `API_PORT` | `3000` | Porta HTTP |
| `PIXELVAULT_DB_PATH` | `database/pixelvault.sqlite` | Caminho do banco local |
| `PAYMENT_MODE` | `simulated` | Seleciona `simulated` ou `mercadopago` |
| `API_WEB_ORIGIN` | vazio | Origem exata do frontend hospedado; HTTP localhost/127.0.0.1 são aceitos no desenvolvimento |

`npm run api:start` usa as variáveis do processo e mantém a demonstração por padrão. `npm run api:start:mercadopago` carrega explicitamente o arquivo privado `.env.mercadopago` e habilita o Checkout Pro exclusivamente de teste. O backend recusa configuração produtiva ou incompleta e não usa fallback simulado para pedidos remotos. [Parâmetros privados e execução](documentos/PixelVault_Mercado_Pago_Checkout_Teste.md).

Para validar somente a API:

```powershell
npm run api:test
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o Metro Bundler |
| `npm run android` | Inicia o Expo direcionado ao Android |
| `npm run ios` | Inicia o Expo direcionado ao iOS |
| `npm run web` | Inicia a versão web |
| `npm run db:init` | Recria o banco SQLite local |
| `npm run db:test` | Executa os testes do banco |
| `npm run catalog:covers` | Regenera as 32 capas originais e a capa genérica local |
| `npm run api:start` | Inicia a API local |
| `npm run api:start:mercadopago` | Inicia a API com o arquivo privado do ambiente de teste |
| `npm run checkout:test` | Testa contratos, recuperação, reconciliação e isolamento do checkout |
| `npm run checkout:smoke` | Cria/reutiliza preferência real de teste sem enviar pagamento |
| `npm run api:test` | Executa os testes da API |
| `npm run mobile:test` | Testa persistência local, offline e integração do catálogo |
| `npm run sync:test` | Testa CRUD, autorização, migrações e retomada da sincronização |
| `npm run export:test` | Testa formato JSON, isolamento, valores e entrega do arquivo |
| `npm run lint` | Executa ESLint sem aceitar warnings |
| `npm run typecheck` | Analisa os arquivos JavaScript com TypeScript |
| `npm test` | Executa toda a suíte automatizada |
| `npm run build` | Exporta o bundle Android para `dist/` |

## Estrutura do repositório

```text
App.js                  composição raiz do aplicativo
index.js                registro do componente Expo
assets/                 ícones e imagens do aplicativo
database/               esquema, seed e banco local gerado
docs/                   stories, gates de qualidade e evidências
scripts/                inicialização do banco e automações locais
server/                 API, repositórios e gateway de pagamento
src/components/         componentes reutilizáveis
src/data/               dados da demonstração
src/domain/             regras puras de domínio
src/integrations/       clientes de catálogo, sessão, checkout e exportação
src/persistence/        cache por plataforma, estado por conta e fila de gravação
src/screens/            telas e fluxos da interface
src/theme/              tokens visuais
tests/                  testes de estrutura, domínio, banco e API
.aiox-core/             framework e workflows de desenvolvimento
.codex/                 projeções locais dos agentes Codex
```

## Qualidade e validação

A rodada ampliada antes do pagamento está em [QA completa](docs/evidence/qa-full/README.md), com matriz de controles/campos, negativos, teclado, eventos de mouse via CDP, downloads e API real. Comandos: `node scripts/capture-evidence.mjs qa-full-local-final` e `node scripts/capture-evidence.mjs qa-full-api-final`, após preparar os exports descritos na evidência. O formulário de produtos valida os mesmos limites do backend (nome/loja 200, descrição 2000, preço de R$ 0,01 a R$ 1.000.000,00, sem fração de centavo); descrições podem ter múltiplas linhas.

Antes de abrir uma revisão, execute:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

O build exporta para `dist/`, que é ignorado pelo Git. Os testes usam o executor nativo do Node.js e cobrem a estrutura do aplicativo, regras de interação, banco e contratos da API.

## Decisões importantes para continuidade

- A interface consulta e sincroniza o CRUD do catálogo com a API quando `EXPO_PUBLIC_API_URL` está configurada. Escritas exigem sessão ADMIN do backend.
- Catálogo e dados demonstrativos das contas são restaurados após recarregar; perfil, sessão, formulários e cadastro continuam em memória.
- Valores monetários são representados em centavos no domínio e no banco.
- O servidor deriva o valor do pagamento a partir do pedido e nunca aceita o total enviado pelo cliente.
- O Checkout Pro exclusivamente de teste é implementado pela story 3.5; a compra externa aprovada foi validada em 21/11/2026, inclusive na biblioteca do app web após reinício/login. Inicie com `npm run api:start:mercadopago`; credenciais ficam no arquivo privado `.env.mercadopago`, ignorado pelo Git. [Configuração, contratos e execução](documentos/PixelVault_Mercado_Pago_Checkout_Teste.md).
- `database/schema.sql` e `database/seed.sql` criam o banco completo. `src/data/catalogExpansion.json` mantém os mesmos 30 jogos para o cache do aplicativo e a migração de bancos antigos; testes conferem a paridade com a seed. O SQLite gerado contém estado local e não deve ser recriado para atualizar apenas o catálogo.
- Preserve os gates `lint`, `typecheck`, `test` e `build` ao alterar dependências ou versões do Expo.

## Limitações conhecidas

- A sincronização bidirecional cobre produtos e compatibilidades. O carrinho permanece local; no checkout conectado, pedido e aquisições confirmadas pertencem ao backend. Sem API, a demonstração local é preservada.
- Não há autenticação ou autorização persistente.
- Sessões não sobrevivem ao reinício do app/servidor; cadastro real e sessão persistente de HU-12 permanecem pendentes.
- A preferência real de teste, recuperação, aprovação e biblioteca foram verificadas com a API oficial e no app web. A validação em dispositivo permanece pendente. Webhook público/retorno automático não foram configurados; confirmação usa consulta autenticada explícita.
- A validação nativa de teclado e alguns fluxos ainda depende de dispositivo ou emulador conectado.

## Documentação complementar

- [Catálogo ampliado, capas e validação dos 32 itens](documentos/PixelVault_Catalogo_Expandido_e_Capas_Locais.md)
- [Checkout Pro de teste: implementação e validação](documentos/PixelVault_Mercado_Pago_Checkout_Teste.md)
- [Histórico de configuração do Mercado Pago](documentos/PixelVault_Mercado_Pago_Historico_Configuracao.md)
- [Histórico de desenvolvimento e evidências acadêmicas](docs/historico-de-desenvolvimento.md)
- [Stories de implementação](docs/stories/)
- [Gates de qualidade](docs/qa/gates/)
- [Evidências visuais e funcionais](docs/evidence/)
- [Configuração do Expo](https://docs.expo.dev/versions/v54.0.0/config/app/)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
