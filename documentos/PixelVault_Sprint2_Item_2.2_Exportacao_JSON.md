# PixelVault — Item 2.2: exportação JSON

**Data:** 20/11/2026. **Story:** 3.3. **Escopo autorizado:** botão para gerar JSON; dashboard dispensado pelo usuário.

**Status:** Done. QA CONCERNS, 90/100: 63 testes, exports Android/web e 25 jornadas E2E aprovados; única ressalva é escrita/compartilhamento nativos sem aparelho disponível.

## Implementação

O botão **Exportar dados em JSON** está no catálogo e na administração. Usa o estado local carregado e funciona sem backend. Gera arquivo `.json` com formato versionado, instante ISO, moeda BRL e contexto demonstrativo/local.

O documento contém catálogo atual e somente carrinho, biblioteca e último pedido da conta ativa. Preços e totais são inteiros em centavos, calculados a partir dos itens; frações de centavo são recusadas com orientação para correção. Metadados indicam alterações locais e quantidade de operações pendentes, sem afirmar confirmação remota.

A serialização possui campos permitidos explícitos: exclui credenciais, identidade, dados do formulário financeiro, chaves de ativação, outras contas e conteúdo da fila interna. Sem perfil ativo, não exporta dados pessoais de uma conta demonstrativa padrão.

## Entrega do arquivo

| Plataforma | Comportamento |
| --- | --- |
| Web | Blob JSON e download pelo navegador, com liberação da URL temporária. |
| Android/iOS | Arquivo no cache com `expo-file-system` e opções de compartilhamento com `expo-sharing`, ambos do SDK 54. |

Uma trava impede exportações simultâneas; falhas permitem nova tentativa. O fechamento do compartilhamento recebe mensagem neutra, pois não comprova envio ou salvamento pelo usuário. O banco, a fila e os formulários não são modificados.

## Qualidade e continuidade

Contrato, comandos, arquivos reais baixados e resultados ficam em `docs/evidence/sprint-2-story-3.3/README.md`. Decisão técnica: `docs/architecture/project-decisions/3.3-exportacao-json.md`. Parecer: `docs/qa/gates/3.3-exportacao-json.yml`.

A verificação nativa de arquivo/compartilhamento permanece pendente enquanto não houver aparelho/emulador disponível. Testes com adaptadores injetados e download web não são apresentados como execução nativa. Não foi criado dashboard, exportação automática, upload ou envio a terceiros.
