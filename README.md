# PixelVault

PixelVault é um aplicativo acadêmico em React Native que demonstra a jornada de uma loja digital de jogos e DLCs. O repositório reúne uma interface Expo para jogador e administrador, um modelo SQLite recriável e uma API Node local com pagamentos simulados.

> O aplicativo, a API e os dados são demonstrativos. Não use este projeto para processar credenciais, cartões ou pagamentos reais.

## Estado atual

| Componente | Implementação | Observação |
| --- | --- | --- |
| Aplicativo | Expo SDK 54, React 19.1 e React Native 0.81 | Executa em Android, iOS e web |
| Interface | Login, cadastro, catálogo, carrinho, checkout, biblioteca e administração | Estado mantido somente em memória |
| Banco | SQLite criado por scripts e fontes SQL versionadas | Ainda não está conectado ao aplicativo |
| API | Servidor HTTP feito com módulos nativos do Node.js | Disponível apenas para desenvolvimento local |
| Pagamento | Gateway simulado e modo Mercado Pago não implementado | Nenhuma chamada financeira externa é realizada |
| Qualidade | ESLint, TypeScript com `checkJs` e testes nativos do Node.js | Gates disponíveis por scripts npm |

## Pré-requisitos

- Node.js `>=22.5` para executar também o módulo nativo `node:sqlite`.
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

Essas credenciais são fictícias e validadas somente no estado local da interface. Não existe autenticação ou autorização persistente.

## Banco SQLite local

O esquema e a massa inicial ficam em `database/schema.sql` e `database/seed.sql`. Para criar ou recriar o banco:

```powershell
npm run db:init
```

O comando valida as chaves estrangeiras e gera `database/pixelvault.sqlite`. Esse arquivo é um artefato local ignorado pelo Git; altere sempre as fontes SQL, não o binário gerado.

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
| `GET` | `/api/users/:userId/library` | Biblioteca demonstrativa de um usuário |
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

O projeto não carrega arquivos `.env` automaticamente. Defina as variáveis no processo ou no ambiente que inicia o servidor. O modo `mercadopago` é apenas uma fronteira explícita e retorna `503 PAYMENT_MODE_NOT_IMPLEMENTED`; não há SDK, token ou fallback externo.

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
| `npm run api:start` | Inicia a API local |
| `npm run api:test` | Executa os testes da API |
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
src/integrations/       fronteiras de integrações simuladas
src/screens/            telas e fluxos da interface
src/theme/              tokens visuais
tests/                  testes de estrutura, domínio, banco e API
.aiox-core/             framework e workflows de desenvolvimento
.codex/                 projeções locais dos agentes Codex
```

## Qualidade e validação

Antes de abrir uma revisão, execute:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

O build exporta para `dist/`, que é ignorado pelo Git. Os testes usam o executor nativo do Node.js e cobrem a estrutura do aplicativo, regras de interação, banco e contratos da API.

## Decisões importantes para continuidade

- A interface Expo ainda não consome a API; os dois módulos devem continuar testáveis de forma independente até a integração ser especificada.
- O estado da interface é reiniciado quando a aplicação recarrega.
- Valores monetários são representados em centavos no domínio e no banco.
- O servidor deriva o valor do pagamento a partir do pedido e nunca aceita o total enviado pelo cliente.
- O gateway de pagamento permanece simulado. Não adicione credenciais reais sem uma story e uma revisão de segurança.
- `database/schema.sql` e `database/seed.sql` são as fontes do banco; `database/pixelvault.sqlite` é descartável.
- Preserve os gates `lint`, `typecheck`, `test` e `build` ao alterar dependências ou versões do Expo.

## Limitações conhecidas

- Não há integração entre o aplicativo e a API.
- Não há autenticação ou autorização persistente.
- O CRUD administrativo existe somente no estado local da interface.
- Não há integração real com Mercado Pago, webhook ou reconciliação.
- A validação nativa de teclado e alguns fluxos ainda depende de dispositivo ou emulador conectado.

## Documentação complementar

- [Histórico de desenvolvimento e evidências acadêmicas](docs/historico-de-desenvolvimento.md)
- [Stories de implementação](docs/stories/)
- [Gates de qualidade](docs/qa/gates/)
- [Evidências visuais e funcionais](docs/evidence/)
- [Configuração do Expo](https://docs.expo.dev/versions/v54.0.0/config/app/)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
