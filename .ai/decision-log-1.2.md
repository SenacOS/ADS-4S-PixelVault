# Decision Log: Story 1.2

**Data:** 2026-09-14  
**Agente:** @dev (Dex)  
**Modo:** yolo  
**Story:** `docs/stories/1.2.componentes-visuais-cinco-areas.md`

## Contexto

O registrador automático citado por `dev-develop-story.md` não existe em `.aiox-core/scripts/decision-recorder.js`; por isso, as decisões desta execução foram registradas manualmente. O worktree já continha alterações da configuração AIOX e da Story 1.1, preservadas sem commit ou push.

## Decisões

1. Manter navegação local por estado React e `Pressable`, sem roteador ou estado global, porque o Prompt 11 exige apresentação navegável e reserva regras completas ao Prompt 12.
2. Centralizar os dois produtos, perfis, pedido e feedbacks em `src/data/`, usando marcadores explicitamente fictícios quando os artefatos não aprovam valores exatos.
3. Usar `react-native-safe-area-context ~5.6.0` e `SafeAreaProvider`, versão e composição recomendadas para Expo SDK 54.
4. Reutilizar somente shell, texto, botão, campo, feedback, estado vazio, cartão e navegação inferior, todos motivados por repetição real.
5. Usar blocos neutros como capas e o ícone Expo local apenas na marca provisória; nenhum ativo externo foi baixado.
6. Adicionar o suporte web mínimo oficial exclusivamente para execução e evidência reproduzível, mantendo o bundle Android como gate principal.
7. Capturar cada WF/ST por query local `?screen=` e validar o marcador renderizado via CDP antes de gravar a PNG; a rota padrão continua `WF-01`.
8. Implementar `fontScale=1.3` somente no runtime web de evidência para ampliar textos/inputs sem zoom de página. O runtime nativo continua com `allowFontScaling`.

## Alternativas descartadas

- Expo Router, React Navigation, Redux e biblioteca visual: abstrações desnecessárias para o incremento.
- Credenciais, loja, capas ou chaves apresentadas como reais: não aprovadas nos artefatos.
- Imagens externas: ausência de aprovação e risco de atribuição/licença.
- Captura baseada no Metro: a primeira execução perdeu conexão no meio do lote; foi substituída por export web estático com validação por rota.
- `npm audit fix --force`: exigiria Expo 57 e violaria o SDK 54 obrigatório.

## Verificações

- `npx expo install --check`: dependências atualizadas (repetição online após falha de rede restrita).
- `npx expo-doctor`: 18/18 checks.
- `npm run lint`, `npm run typecheck`, `npm test` (8/8) e `npm run build`: aprovados.
- Metro offline: alcançou `Metro waiting` na porta 8099 e encerrou normalmente.
- Evidência inicial: 25 PNGs com dimensões reais; UXT-03 e UXT-04 comprovados por clique.
- Pós-auditoria UX: lote regenerado com 27 PNGs, 27/27 sem overflow horizontal; contraste mínimo automatizado, foco explícito e semântica de heading adicionados.
- `npm audit --audit-level=critical`: nenhuma crítica; permanecem 16 transitivas (7 moderadas, 9 altas) já associadas à árvore Expo/Metro SDK 54, com correção apenas via mudança incompatível.

## Limite conhecido

Nenhum dispositivo ADB estava conectado e o Chrome headless não abre teclado virtual móvel. Foco, rolagem, `KeyboardAvoidingView` e insets foram verificados; o teclado nativo aberto deve ser repetido em Expo Go/emulador no Prompt 12 ou assim que houver dispositivo disponível.
