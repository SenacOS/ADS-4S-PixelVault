# Decision Log: Story 1.1

**Início:** 2026-09-14T11:10:14.4930589-03:00  
**Conclusão:** 2026-09-14T11:19:30.9154845-03:00  
**Agente:** @dev (Dex)  
**Modo:** yolo  
**Story:** `docs/stories/1.1.configuracao-projeto-expo.md`  
**Commit de referência:** `859f2a2c39a79a577ae0ab174803aaa1ece34fee`

## Contexto

O registrador automático citado por `dev-develop-story.md` não existe em `.aiox-core/scripts/decision-recorder.js`; por isso, as decisões desta execução são registradas manualmente. Alterações preexistentes no worktree não fazem parte desta story.

## Decisões

1. Manter Expo SDK 54, React 19.1 e React Native 0.81, pois a auditoria e a documentação oficial confirmaram compatibilidade.
2. Usar apenas componentes React Native e `expo-status-bar` no runtime; bibliotecas de navegação e estado ficam para as stories que realmente as consumirem.
3. Usar ESLint/`eslint-config-expo` para lint e TypeScript em `checkJs` somente como analisador estático, mantendo todo o código do aplicativo em JavaScript.
4. Usar `node:test` para as regressões mínimas, evitando Jest e dependências adicionais.
5. Usar `expo export --platform android` como build reproduzível no Windows, pois compilação nativa local exigiria Android Studio/dispositivo e iOS exigiria macOS/Xcode.
6. Criar arquivos ativos nos quatro limites mínimos de `src/`, ligados à entrada, sem implementar navegação ou fluxos dos Prompts 11 e 12.

## Alternativas descartadas

- Expo Router/React Navigation, Redux e backend: sem consumidor nesta story e fora do incremento.
- Migração para TypeScript: proibida pelo AC 2; `checkJs` entrega análise estática sem alterar a linguagem do projeto.
- `npm audit fix --force`: propõe atualização incompatível do Expo e violaria o SDK 54 obrigatório.

## Arquivos e verificações

Arquivos de implementação: `App.js`, `package.json`, `package-lock.json`, `README.md`, `eslint.config.js`, `jsconfig.json`, `src/components/StatusCard.js`, `src/data/projectSetup.js`, `src/integrations/paymentGateway.js`, `src/screens/ProjectReadyScreen.js` e `tests/project-structure.test.cjs`.

Verificações concluídas: instalação limpa por `npm ci`; compatibilidade de dependências; Expo Doctor 18/18; lint; análise estática de JavaScript; quatro testes automatizados; export Android de 577 módulos; Metro pronto em modo offline e encerrado por `Ctrl+C`; revisão manual sem segredo encontrado no código do aplicativo.

Para reversão, revisar o diff e restaurar seletivamente apenas os arquivos listados pela Story 1.1; não alterar os arquivos preexistentes fora do escopo.
