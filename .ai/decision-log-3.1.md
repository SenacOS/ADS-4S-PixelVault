# Decisões — Story 3.1

Data: 20/11/2026. Execução autorizada pelo usuário para o primeiro incremento da Sprint 2.

- Story criada por River (@sm), arquitetura revisada por Aria (@architect), implementação por Dex (@dev) e parecer delegado a Quinn (@qa).
- Escopo e decisões: `docs/architecture/project-decisions/3.1-persistencia-local.md`.
- Banco servidor preservado; novo cache móvel independente, sem migrar o DER relacional para o aparelho.
- `expo-sqlite ~16.0.10` conforme SDK 54; adaptador web explícito evita apresentar localStorage como SQLite.
- Writes serializados, whitelist de campos e dirty guard preservam dados confirmados e alterações locais não enviadas.
- Review identificou risco de resposta atrasada após cleanup; corrigido com dispose, guarda dentro da fila e teste de duas instâncias. Fechamento idempotente evita close duplicado.
- Gates, comandos e limitações: `docs/evidence/sprint-2-story-3.1/README.md`. Não houve commit, push, publicação ou alteração de credenciais.
