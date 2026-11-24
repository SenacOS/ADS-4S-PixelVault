# PixelVault — Integração da identidade visual branca e ouro

**Story:** 3.8. **Referência:** 21/11/2026. **Estado:** implementação e validação concluídas; 93 testes e 110 cenários web aprovados (36 visuais/interação e 74 regressões funcionais).

## Origem e recorte

A direção visual veio de `C:/PI4/ADS-4S-PixelVault`, cujo histórico contém a revisão visual e a limpeza da interface. Esse diretório foi consultado somente para leitura. O destino mantém a base funcional construída nas stories 3.1–3.7: persistência, API, fila de sincronização, exportação JSON, Checkout Pro em teste e catálogo ampliado.

A identidade foi portada seletivamente; não se substituíram o controlador, o banco ou as integrações pela implementação anterior da outra pasta. A coincidência dos números 3.1/3.2 nos dois históricos não representa histórias iguais. Esta integração recebe o identificador próprio 3.8.

## Resultado visual e textual

- Fundo branco, superfícies claras e conteúdo escuro. Ouro fosco nas ações e ouro escuro em preços, seleção e contornos.
- Estados pressionado, focado, desabilitado e destrutivo com cores semânticas, mantendo indicação textual e acessibilidade.
- Campos com foco visível e encaminhamento dos handlers recebidos; navegação, banners e resumo do pedido coerentes com o tema.
- Bordas dos botões primários em ouro escuro: o preenchimento ouro original sozinho não atingia 3:1 contra branco. Os testes verificam o contraste do contorno efetivamente usado, além de texto, superfícies e foco.
- Marcadores WF/ST e atalhos de preenchimento de perfis removidos da interface. O login usa os campos normais; rotas permanecem identificáveis apenas por metadados não perceptíveis para automação.
- Textos incidentais simplificados, preservando informações úteis: conta local e temporária, alterações pendentes, conflitos, simulação, ambiente de teste e chaves fictícias.
- Capas locais, proporção 16:9, fallback e os 32 produtos-base mantidos. Não se importaram as capas com iniciais nem a massa reduzida da outra versão.

## Preservação funcional

Nenhuma alteração em `server/`, `database/`, `src/persistence/`, `src/integrations/`, dados do catálogo, assets de capas, manifestos de dependências ou credenciais. No controlador, a alteração limita-se à mensagem de erro de login, remoção de uma indicação de apresentação e um `testID` de rota. Não altera autenticação, cálculo, sessão, autorização, pedido ou reconciliação.

As suítes web utilizam armazenamento e bancos isolados. A simulação do provedor nos testes de checkout não representa nova compra no serviço externo. A evidência da compra aprovada anteriormente continua preservada e identificada como registro daquela execução.

## Qualidade e evidências

Lint, typecheck e suíte completa foram executados. A suíte contém 93 testes, preservando a cobertura funcional anterior e incluindo verificações de tema, contraste e remoção de marcadores. Resultados finais, hashes e contagens web ficam em `docs/evidence/sprint-2-story-3.8/validation-summary.json`.

Evidências novas, sem substituir as rodadas anteriores:

- `docs/evidence/qa-visual-3.8/`: telas, estados, foco, fonte 130%, viewports de 320/360/390 px, mouse pressionado e navegação/ativação por teclado.
- `docs/evidence/qa-full-local-visual-3.8/`: fluxos locais, campos, validações, persistência, exportação e recuperação de falhas.
- `docs/evidence/qa-full-api-visual-3.8/`: CRUD, sincronização, conflito e autorização com API isolada.
- `docs/evidence/qa-full-payment-visual-3.8/`: contrato de checkout e biblioteca com provedor controlado para teste.
- `docs/evidence/qa-catalog-local-visual-3.8/` e `qa-catalog-api-visual-3.8/`: carregamento das 32 capas, filtros, rolagem até o último produto, detalhes/carrinho e fallback.

## Documentação de entrega

As capturas atuais da Sprint 2 foram atualizadas para representar o tema desta story; capturas e conteúdo históricos da Sprint 1 e da aprovação externa anterior permanecem identificados como históricos. A edição anterior do relatório foi preservada em `documentos/historico/story-3.7/`. A atualização não transforma a execução anterior em uma execução com o tema novo. HU-12, gravação do vídeo e pacote/submissão permanecem pendentes e não integram o aceite funcional desta mudança visual.
