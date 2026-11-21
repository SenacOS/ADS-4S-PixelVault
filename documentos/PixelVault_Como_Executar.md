# PixelVault — como executar no Windows

## Primeira execução

1. Instale o **Node.js 22.13 ou superior** (com npm) pelo [site oficial](https://nodejs.org/en/download). Para reproduzir o ambiente validado, use a linha 22. Feche e reabra o Explorador/terminal após instalar.
2. Abra a pasta atual do projeto. Em outro computador, use um ZIP atualizado ou um commit que já inclua este iniciador e extraia a pasta inteira. Mantenha juntos `package.json`, `package-lock.json`, `server`, `src`, `assets`, `database` e `scripts`. Alterações locais ainda sem commit não aparecem em um clone novo.
3. Dentro da pasta do projeto, dê **duplo clique em `Iniciar-PixelVault.cmd`**.
4. Na primeira vez, aguarde a instalação das dependências. É necessário acesso à internet nessa etapa. O banco é criado automaticamente se ainda não existir.
5. Aguarde o navegador abrir em **http://localhost:8081**. Se não abrir, acesse esse endereço manualmente.

Não é necessário instalar Expo globalmente, Android Studio ou um servidor de banco. O iniciador `.cmd` executa com duplo clique no Windows e depende do Node instalado; não é um aplicativo `.exe` independente.

## Entrar no sistema

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Jogador | jogador@pixelvault.example | demo123 |
| Administrador | admin@pixelvault.example | demo123 |

Com a API disponível, entre como administrador para criar, editar, excluir e sincronizar itens do catálogo. Os dados do navegador ficam vinculados à origem; use sempre `http://localhost:8081` para reencontrar o mesmo cache.

## Próximas execuções e encerramento

Dê duplo clique novamente em `Iniciar-PixelVault.cmd`. Mantenha a janela aberta enquanto usa o projeto. Para encerrar, volte à janela e pressione **Ctrl+C**; se o Windows perguntar se deseja finalizar o arquivo em lotes, confirme com **S**. Fechar somente a aba do navegador não encerra os serviços.

O iniciador preserva o banco existente. **Não execute `npm run db:init` para iniciar no dia a dia:** esse comando recria o banco e substitui seus dados.

## Mercado Pago de teste

Se existir `.env.mercadopago` na raiz, o iniciador carrega esse arquivo **somente no backend** e seleciona o Checkout Pro de teste. As credenciais continuam privadas e não são copiadas para o frontend.

Em outro computador, o arquivo não vem pelo Git. Configure-o privadamente conforme `documentos/PixelVault_Mercado_Pago_Checkout_Teste.md`. São necessários `MERCADO_PAGO_ENVIRONMENT=test`, `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_TEST_SELLER_ID` e `MERCADO_PAGO_TEST_BUYER_ID`. Nunca coloque o token em uma variável `EXPO_PUBLIC_*`.

Sem esse arquivo, a API e o catálogo funcionam no modo local de pagamento demonstrativo. O Checkout Pro requer configuração e conexão com o Mercado Pago. Se as credenciais estiverem incompletas ou inválidas, corrija o arquivo; o iniciador não oculta o erro trocando de modo.

## Execução manual no PowerShell

Na pasta do projeto, uma vez:

```powershell
npm ci
```

O mesmo iniciador pode ser chamado pelo terminal:

```powershell
node scripts/start-local.mjs
```

Ou inicie separadamente. No primeiro terminal:

```powershell
# Execute apenas se o banco ainda não existir:
if (-not (Test-Path database/pixelvault.sqlite)) { npm run db:init }
npm run api:start
# Para Checkout Pro de teste, substitua a linha anterior por:
# npm run api:start:mercadopago
```

No segundo terminal:

```powershell
$env:EXPO_PUBLIC_API_URL = 'http://127.0.0.1:3000'
npm run web -- --localhost --port 8081
```

Na execução manual do Mercado Pago, o arquivo privado também deve conter `PAYMENT_MODE=mercadopago`. Encerre os dois terminais com Ctrl+C.

## Se algo não funcionar

| Mensagem ou sintoma | O que fazer |
| --- | --- |
| Node/npm não encontrado ou versão incompatível | Instale Node 22.13+ com npm e reabra a janela. |
| Falha ao instalar dependências | Confira a internet. Abra um terminal na pasta e execute `npm ci` para ver o erro completo. |
| Dependências incompletas após atualizar o projeto | Execute `npm ci` novamente. O iniciador instala automaticamente somente quando a instalação local está ausente. |
| Porta 3000 ou 8081 ocupada | Encerre a execução anterior ou o programa que usa a porta e tente novamente. Não abra dois iniciadores ao mesmo tempo. |
| Navegador não abriu | Acesse http://localhost:8081 com a janela do iniciador aberta. |
| Erro no Mercado Pago | Confira as credenciais privadas de teste e a conexão. Consulte o guia específico de checkout. |
| Falha de banco ou API | Leia a mensagem na janela. Preserve `database/pixelvault.sqlite`; não recrie o banco sem backup. |

Para executar os gates de qualidade:

```powershell
npm run lint
npm run typecheck
npm test
```
