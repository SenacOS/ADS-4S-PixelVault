# Story 3.10 — execução local simplificada

Validação em 21/11/2026, Windows, Node 22.18.0. Nenhum commit/push realizado.

## Implementação

- `Iniciar-PixelVault.cmd`: diretório relativo ao próprio arquivo, verificação de Node >=22.13/npm, instalação com `npm ci` se Expo local ausente, mensagens de erro e pausa.
- `scripts/start-local.mjs`: portas locais, bootstrap apenas para banco ausente, API pronta antes do Expo, URL pública explícita, credenciais privadas carregadas somente pelo processo backend, encerramento dos filhos com Ctrl+C. `--local` permite ignorar a configuração privada; `--no-open` evita abrir o navegador nos smokes. `API_PORT`, `PIXELVAULT_WEB_PORT` e `PIXELVAULT_DB_PATH` permitem isolar a validação.
- Guia e README orientam primeiro uso, parada, contas de acesso, pagamento opcional e alternativa manual.

## Resultados

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | PASS, sem warnings |
| `npm run typecheck` | PASS |
| `npm test` | PASS, 93/93 |
| `.cmd` real, banco ausente em `tmp/launcher-smoke/` | Banco inicial criado com 32 produtos; API 3310 e Expo 8310 iniciados |
| Web e bundle | HTTP 200 para `/` e `/index.bundle?platform=web&dev=true&hot=false`; bundle de 1.971.783 bytes contendo a URL da API isolada |
| Sem Mercado Pago | `/health`: status ok, paymentMode simulated, paymentAvailable true |
| Com arquivo privado existente e banco novo isolado | API 3311 e Expo 8311; `/health`: status ok, paymentMode mercadopago, paymentAvailable true; catálogo e página HTTP 200; nenhum pagamento solicitado |
| Reinício preservando edição | Nome de um produto alterado diretamente somente no banco temporário; após reiniciar, `/api/products` manteve `Preservacao launcher 3.10` |
| Porta ocupada | Segundo iniciador retorna código 1, identifica porta 3310; não cria `port-check-must-not-exist.sqlite` nem encerra o primeiro processo |
| Ctrl+C | Sessões reais encerradas; portas verificadas após parada |

O primeiro ensaio revelou que reservar a porta em IPv6 não detectava corretamente um serviço IPv4 no Windows. A versão final verifica conexões em IPv4/IPv6 antes de reservar a porta IPv4. O cenário de conflito foi repetido e passou.

Os testes iniciais dentro do sandbox falharam por EPERM ao renomear SQLite e restrições a sockets. A suíte final foi executada fora dessas restrições e passou integralmente; não houve mudança no código de domínio para contornar os testes.

Banco principal não utilizado pelos smokes. SHA256 conferido: `5FE47CFFAC178E2BA7CA440D897BAE3432A42A91668534E294A587A39A7553B0`.

## Limites da verificação

- Dependências já estavam instaladas. O ramo `npm ci` e os avisos de Node/npm ausentes foram revisados; não foi feita uma instalação limpa em outro computador.
- O `.cmd` foi executado pelo terminal real. Os smokes utilizaram `--no-open`; a abertura automática usa o parâmetro `--web` do Expo local, conferido em `start --help`. A interação por duplo clique no Explorador e a abertura visual do navegador não foram exercitadas nesta validação.
- Caminhos são passados com aspas no batch e por argumentos sem shell no Node; uma cópia integral em pasta com espaços não foi executada.
- A documentação do endereço Expo v54 redirecionou para latest. Foi consultada a fonte oficial versionada `expo/expo`, branch `sdk-54`, `docs/pages/versions/v54.0.0/index.mdx`, além do help do CLI instalado. Nenhum pacote Expo foi alterado.
- CodeRabbit não está disponível no PATH nem no caminho local configurado; sem alegação de aprovação dessa ferramenta. Revisão local e gates executados.

Artefatos de trabalho e logs ficam em `tmp/`, ignorados pelo Git. As evidências não contêm credenciais privadas.
