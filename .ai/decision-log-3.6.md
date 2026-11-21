# Story 3.6 — catálogo ampliado com capas locais

21/11/2026. Usuário autorizou30novos jogos com imagem e validação da lista. Contexto acadêmico mantido: nomes/preços/compatibilidades fictícios. Auxiliares @sm, @architect e @qa sequenciais.

- Fonte compartilhada JSON para30extras; originais preservados. Base32itens=31 JOGO+1 DLC.
- Capas originais PNG 768×432 produzidas por gerador Node/zlib de pixel art;32 específicas+1 genérica. Mapeamento estático por ID, sem API URL/novas dependências.
- Migração de banco aditiva uma vez com marcador transacional; não modifica IDs preexistentes/compatibilidades. Banco de trabalho2→32 com dados protegidos e segundaabertura idempotente comprovados.
- Cachev2 com catalogEdition2 opcional; migração sóextras, respeita outbox/DELETE e não restaura originais excluídos. Cache v1/legacyDirty preservado.
- Review encontrou acesso herdado no mapa de capas: corrigido Object.hasOwn e testado constructor no navegador. Erro de carregamento aciona fallback acessível e recupera após reload.
- E2E detectou descrição ausente nos detalhes e altura intrínseca do Image na web: descrição exibida e moldura16:9 com preenchimento 100% corrigiram a apresentação.
- Regressões antigas recebem fixtures2explícitas; catálogo default32 tem suítes próprias e comparação canônica de todos os campos. Sem nova compra ou mudança em credenciais; sem commit/push.

Fechamento QA: CONCERNS90/100, story Done.89 testes e74 jornadas web PASS, zero overflow; único item aberto é validação nativa.
