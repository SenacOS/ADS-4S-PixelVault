# Handoff entre máquinas — Story 3.1

**Data:** 2026-09-18  
**Story:** `docs/stories/3.1.revisao-identidade-visual-paleta.md`  
**Situação:** Story aprovada pelo PO e pronta para implementação; etapa UX concluída conceitualmente, mas o artefato UX ainda não foi gravado por bloqueio do ambiente WSL1.

## Instrução de retomada

1. Ler `AGENTS.md`, `.aiox-core/constitution.md` e a Story 3.1.
2. Preservar o worktree existente: havia muitas alterações preexistentes e não relacionadas quando este handoff foi criado.
3. Antes de escrever código Expo/React Native, ler a documentação exata do Expo SDK 54 em `https://docs.expo.dev/versions/v54.0.0/`, conforme `AGENTS.md`.
4. Materializar a especificação UX deste handoff em `docs/ux/story-3.1-ux-handoff.md` ou usar este próprio documento como fonte de implementação.
5. Registrar na Story 3.1 a conclusão UX `0.2.0` descrita na seção “Alterações documentais pendentes”.
6. Encaminhar para `@dev` implementar a Story 3.1; depois executar o quality gate `@dev` e a validação de `@qa` prevista no fluxo.
7. Antes de iniciar qualquer novo agente, avisar o usuário com agente, tarefa e impacto esperado de tokens, aguardando autorização, salvo quando o usuário já tiver autorizado explicitamente aquele fluxo.

## Histórico do fluxo AIOX

### Criação pelo Scrum Master

- A Story 3.1 foi criada por River (`@sm`) para revisar identidade visual e paleta.
- Direção solicitada: branco predominante, texto preto/cinza muito escuro e amarelo ouro fosco.
- Escopo limitado à apresentação; fluxos, funcionalidades, dados e estrutura devem permanecer estáveis.
- A story cobre `WF-01..WF-11`, `ST-01..ST-05`, responsividade, acessibilidade, componentes compartilhados e quality gates.

### Primeira avaliação do Product Owner

- Resultado inicial: **NO-GO — 6/10, confiança alta**.
- Bloqueio: `quality_gate: "@qa"` não atendia à matriz vigente para Design/UI, que exige `quality_gate: "@dev"`.
- A Story permaneceu `Draft`.

### Correção e reavaliação

- `@sm` alterou `quality_gate` para `@dev`.
- Foram registrados no Change Log da story:
  - `0.1.1`: NO-GO do PO;
  - `0.1.2`: correção do quality gate.
- O PO reavaliou a story com resultado **GO — 9/10, confiança alta**.
- A versão `0.1.3` registrou `Draft → Ready`.
- Estado confirmado no arquivo: `status: "Ready"` e seção Status `Ready`.

## Trabalho concluído pelo UX Design Expert

Uma (`@ux-design-expert`) concluiu uma auditoria estática e definiu a direção visual e o handoff para desenvolvimento. Nenhum código da aplicação foi alterado.

### Auditoria da base atual

Escopo inspecionado: `App.js`, `src/theme/`, `src/components/` e `src/screens/`.

| Evidência | Resultado | Consequência |
|---|---:|---|
| Arquivos visuais React Native | 11 | Mudança pequena e centralizável. |
| Cores hexadecimais únicas | 15 | 13 em `tokens.js`; 2 hardcoded em `FeedbackBanner`. |
| Ocorrências estáticas de `AppButton` | 28 | Refinar o componente propaga a direção para todas as áreas. |
| Ocorrências de `LabeledField` | 11 | Normal, foco e erro devem ser resolvidos no componente. |
| `TextInput` direto | 1 | Encapsulado por `LabeledField`; não criar outro padrão. |
| Espaçamentos | `4, 8, 12, 16, 24, 32` | Preservar a escala única. |
| Raios | `8, 12, 18` | Preservar e aplicar semanticamente. |
| Alvo de toque | `48 dp` | Preservar; nunca reduzir abaixo de `44 dp`. |

Principais causas do peso atual:

- `background`, `surface` e `surfaceRaised` são escuros e ocupam praticamente toda a área útil;
- resumo do pedido e navegação selecionada usam `accentDark` escuro;
- sucesso e erro introduzem fundos escuros hardcoded `#123c2c` e `#4a1f2a`;
- o azul é usado simultaneamente como preenchimento, texto, preço, indicador e borda;
- `StatusBar style="light"` pressupõe fundo escuro;
- não existem tokens explícitos para foco, fundos semânticos ou sombra.

## Paleta aprovada para implementação

| Papel | Valor | Uso |
|---|---|---|
| `background` | `#FFFFFF` | Fundo predominante e área segura. |
| `surface` | `#FAF9F6` | Cartões, campos, banners e painéis. |
| `surfaceRaised` | `#F3F1EA` | Capas neutras e níveis secundários. |
| `text` | `#171717` | Títulos, corpo, ícones e conteúdo principal. |
| `textMuted` | `#4B5563` | Texto secundário e metadados. |
| `textSubtle` | `#6B7280` | Placeholder e conteúdo auxiliar. |
| `border` | `#8A8178` | Contornos funcionais. |
| `accent` | `#C49A32` | Preenchimento primário ouro fosco. |
| `accentPressed` | `#AE8426` | Ouro pressionado. |
| `accentDark` | `#745713` | Preço, eyebrow, texto e indicador sobre claro. |
| `accentSurface` | `#FBF3DC` | Seleção e informação leves. |
| `focus` | `#5A4310` | Foco de `3 dp` sobre branco e ouro. |
| `success` | `#166534` | Conteúdo/borda de sucesso. |
| `successSurface` | `#F0FDF4` | Fundo de sucesso. |
| `warning` | `#7A4D00` | Conteúdo/borda de aviso. |
| `warningSurface` | `#FFF8E6` | Fundo de aviso. |
| `danger` | `#B42318` | Conteúdo, borda e ação destrutiva. |
| `dangerSurface` | `#FEF3F2` | Fundo de erro/confirmação destrutiva. |
| `disabled` | `#E7E5E4` | Fundo desabilitado. |
| `disabledText` | `#57534E` | Conteúdo desabilitado. |
| `disabledBorder` | `#78716C` | Limite desabilitado. |
| `shadow` | `#171717` | Cor única de sombra com baixa opacidade. |

Regras da paleta:

1. `accent #C49A32` não pode ser texto, ícone fino, foco ou borda isolada sobre branco: contraste de apenas `2,62:1`.
2. Botão ouro usa conteúdo `text #171717`, nunca branco.
3. Preço, eyebrow, indicador e destaques lineares usam `accentDark`.
4. `#70d6ff` e `#12324a` não permanecem como marca ou destaque ativo.
5. Não usar gradientes, glow ou superfícies escuras extensas.
6. Estados semânticos permanecem acompanhados por texto/semântica além da cor.
7. Pequenos ajustes são permitidos se os contrastes forem recalculados e a direção branco + conteúdo escuro + ouro fosco for preservada.

## Contrastes calculados

| Combinação | Razão | Uso |
|---|---:|---|
| `#171717` / `#FFFFFF` | `17,93:1` | Texto principal. |
| `#171717` / `#FAF9F6` | `17,03:1` | Texto em superfícies. |
| `#4B5563` / `#FFFFFF` | `7,56:1` | Texto secundário. |
| `#4B5563` / `#FAF9F6` | `7,18:1` | Metadados. |
| `#6B7280` / `#FFFFFF` | `4,83:1` | Placeholder/auxiliar. |
| `#8A8178` / `#FFFFFF` | `3,82:1` | Borda sobre fundo. |
| `#8A8178` / `#FAF9F6` | `3,63:1` | Borda sobre superfície. |
| `#171717` / `#C49A32` | `6,84:1` | Botão primário. |
| `#171717` / `#AE8426` | `5,23:1` | Botão pressionado. |
| `#745713` / `#FFFFFF` | `6,74:1` | Ouro textual/linear. |
| `#745713` / `#FBF3DC` | `6,08:1` | Seleção/informação. |
| `#5A4310` / `#FFFFFF` | `9,35:1` | Foco sobre branco. |
| `#5A4310` / `#C49A32` | `3,57:1` | Foco sobre ouro. |
| `#166534` / `#F0FDF4` | `6,81:1` | Sucesso. |
| `#7A4D00` / `#FFF8E6` | `6,86:1` | Aviso. |
| `#B42318` / `#FEF3F2` | `6,05:1` | Erro. |
| `#FFFFFF` / `#B42318` | `6,57:1` | Botão destrutivo. |
| `#57534E` / `#E7E5E4` | `6,08:1` | Conteúdo desabilitado. |
| `#78716C` / `#FFFFFF` | `4,80:1` | Borda desabilitada. |

## Fundação visual

### Espaçamento

Preservar `xs 4`, `sm 8`, `md 12`, `lg 16`, `xl 24`, `xxl 32`.

- `ScreenShell`: `16` horizontal, `24` no topo e `16` na base.
- Cabeçalho para conteúdo: `24`.
- Grupos de formulário e cartões: `16`.
- Interior de cartões: `16`; banners: `12`.
- Label para campo e metadados relacionados: `8`.
- Em `320 px`, manter no mínimo `16` horizontal e preferir quebra/coluna.

### Bordas e raios

- `8`: banners e elementos compactos.
- `12`: botões, campos e seções.
- `18`: cartões, estados vazios, marca e confirmação.
- Borda padrão: `1 dp`.
- Erro e foco: `2–3 dp`.
- O foco não pode alterar a geometria externa nem cortar conteúdo.

### Sombras

Sombras são opcionais e secundárias à borda/espaço. Quando úteis em cartões ou navegação fixa:

- `shadowColor: #171717`;
- `shadowOpacity: 0.08`;
- `shadowRadius: 8`;
- `shadowOffset: { width: 0, height: 2 }`;
- `elevation: 2` como teto inicial.

Não aplicar em todos os painéis nem criar glow colorido.

### Tipografia

Preservar fonte do sistema, tamanhos `14/16/24/34`, pesos e escala nativa.

- Títulos/corpo: `text`.
- Secundário/label: `textMuted`.
- Eyebrow/preço/destaque curto: `accentDark`.
- Não reduzir fonte ou line-height para acomodar escala de `130%`.

## Contrato dos componentes

| Componente | Direção |
|---|---|
| `ScreenShell` | Fundo branco, status bar escura, safe area, teclado, scroll e largura máxima preservados. Rodapé não cobre conteúdo. |
| `AppText` | Título/corpo `text`; secundário/label `textMuted`; eyebrow `accentDark`; sem truncamento crítico a 130%. |
| `AppButton` | Primário `accent + text`; pressed `accentPressed`; secundário `surfaceRaised + border`; ghost transparente + borda; danger `danger + branco`; disabled usa trio dedicado; foco `3 dp focus`. |
| `LabeledField` | `surface`, `text`, `border`; placeholder `textSubtle`; foco `focus`; erro `danger` e mensagem textual; mínimo `48 dp`. |
| `ProductCard` | Superfície clara, borda, sombra opcional; capa `surfaceRaised`; preço/iniciais `accentDark`; ações quebráveis. |
| `FeedbackBanner` | Remover hex hardcoded. Informação usa `accentSurface/accentDark`; sucesso e erro usam seus pares semânticos. Prefixos e live region permanecem. |
| `EmptyState` | Superfície clara, borda e espaço `24`; título, descrição e ação explícitos. |
| `BottomNavigation` | Base clara; selecionado `accentSurface`, indicador `accentDark`, texto “Ativo”; foco independente; alvos ≥48 dp. |

Estados pressionados não devem depender somente de opacidade. A mudança de token é preferencial; opacidade pode ser complementar se o contraste permanecer válido.

## Cobertura de telas e estados

| Inventário | Aplicação |
|---|---|
| `WF-01`, `WF-02`, `ST-01` | Painel de marca claro, campos e ações consistentes, erro em `dangerSurface`, status bar escura. Conferir ícone no app real. |
| `WF-03`, `ST-02` | Filtros selecionados em ouro fosco com texto explícito; cartões e estado vazio claros. |
| `WF-04` | Capa neutra, preço `accentDark`, seções claras e ações preservadas. |
| `WF-05`, `ST-03` | Itens e resumo claros; total em alto contraste; ação desabilitada legível. |
| `WF-06`, `ST-05` | Resumo, aviso e campos claros; teclado não cobre confirmação; erro textual. |
| `WF-07` | Sucesso em fundo semântico claro; pedido e total preservam hierarquia. |
| `WF-08`, `ST-04` | Cartões e estado vazio consistentes; chave fictícia legível e quebrável. |
| `WF-09` | Lista administrativa usa o mesmo sistema visual do catálogo. |
| `WF-10` novo/edição | Escolhas selecionadas usam o padrão dos filtros; campos e mensagens preservados. |
| `WF-11` | `dangerSurface` com borda/texto `danger`; Cancelar precede visualmente Confirmar; `alert` permanece. |

Nenhuma exceção escura está aprovada. Uma necessidade real deve ser registrada na story com função, área ocupada e contraste.

## Responsividade e acessibilidade

- Validar `390 × 844`, `360 × 844` e `320 × 568` em retrato.
- Em `320 px`, manter uma coluna; grupos e título/preço podem quebrar, sem rolagem horizontal.
- Verificar safe area, scroll, rodapé e teclado aberto.
- Testar fonte ≥`130%`, sem corte de conteúdo essencial.
- Manter alvo preferencial `48 × 48 dp`, mínimo `44 × 44 dp`.
- Garantir foco visível em botão, campo e aba.
- Seleção, sucesso, erro, perigo, ativo e desabilitado mantêm texto/semântica além da cor.
- Texto normal ≥`4,5:1`; texto grande ≥`3:1`; componentes, foco e limites essenciais ≥`3:1`.
- Preservar ordem de leitura, foco, ações e navegação.

## Ordem de implementação para o Dev

1. Ler a documentação Expo SDK 54 exigida pelo `AGENTS.md`.
2. Evoluir somente `src/theme/tokens.js`; não criar tema paralelo.
3. Atualizar `StatusBar` e `ScreenShell`.
4. Refinar os oito componentes compartilhados antes das telas.
5. Remover os hardcodes de `FeedbackBanner` e usos inadequados de `accent/accentDark`.
6. Fazer apenas ajustes locais necessários em acesso, loja e administração.
7. Adaptar testes de contraste, ausência do azul legado, inventário e contratos existentes.
8. Capturar evidências reais e só então ajustar levemente a paleta, registrando razões.
9. Rodar `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
10. Atualizar checkboxes, Change Log, Completion Notes e File List.

Arquivos esperados:

- `App.js`;
- `src/theme/tokens.js`;
- os oito arquivos em `src/components/`;
- `src/screens/AccessScreens.js`;
- `src/screens/StorefrontScreens.js`;
- `src/screens/AdminScreens.js`;
- `tests/project-structure.test.cjs`.

`PixelVaultApp.js`, domínio, dados e integrações normalmente ficam fora do escopo.

## Evidências esperadas na implementação

- `WF-01..WF-11` e `ST-01..ST-05` em `390 × 844`.
- Amostras das cinco áreas em `360 × 844` e `320 × 568`.
- Fonte `130%`, foco e teclado aberto.
- Comparação com `docs/evidence/prompt-11/` e `docs/evidence/prompt-12/`.
- Tabela final de contraste baseada na implementação real.
- Ausência de `#70d6ff` e `#12324a` como destaque ativo.
- Nenhuma regressão nos fluxos existentes.

## Alterações documentais pendentes

Adicionar ao Change Log da Story 3.1:

```markdown
| 2026-09-18 | 0.2.0 | Auditoria UX concluída e direção visual documentada com paleta por papéis, contrastes, estados, cobertura WF/ST e handoff para implementação. | Uma (@ux-design-expert) |
```

Adicionar à Story 3.1:

```markdown
## UX Design Record

- Handoff: `docs/ux/story-3.1-ux-handoff.md` ou este handoff entre máquinas.
- Inventário: 15 cores hexadecimais, 13 tokens centralizados, 2 fundos hardcoded, 28 ocorrências de `AppButton` e 11 de `LabeledField`.
- Direção fechada: branco `#FFFFFF`, conteúdo `#171717`, ouro fosco `#C49A32`, ouro textual `#745713` e foco `#5A4310`.
- Escalas existentes de espaçamento, raios, tipografia e alvo de toque preservadas.
- `WF-01..WF-11`, `ST-01..ST-05`, componentes, responsividade e acessibilidade mapeados no handoff.
- Limitações: app/gates não executados por ausência de `node`; ícone não inspecionado devido ao WSL1; checklist WCAG declarado inexistente.
- Próximo responsável: `@dev`. O status permanece `Ready` até a implementação começar.
```

## Bloqueios e limitações encontrados

1. O ambiente atual usa WSL1. O sandbox do Codex depende de bubblewrap/user namespaces, indisponíveis no WSL1.
2. `apply_patch` falhou antes de qualquer escrita, inclusive quando chamado por execução escalada.
3. Não foi permitido contornar a falha com `cat`, redirecionamento, Python ou outros mecanismos de escrita, conforme as regras do workspace.
4. O executável Linux `node` não estava disponível. `node.exe` existia, mas o gerador AIOX falhou por ausência do módulo `execa`.
5. O checklist `accessibility-wcag-checklist.md` declarado pela persona UX não existe neste checkout; foram usados os limiares já aprovados na Story 3.1.
6. A inspeção de `assets/icon.png` foi bloqueada pela incompatibilidade do ambiente; deve ser refeita no app real.
7. Figma não foi necessário nem acessado.
8. Não foram geradas capturas da nova direção porque nenhum código foi implementado.
9. Nenhum gate de código foi executado nesta etapa documental.

## Estado exato ao encerrar

- Story 3.1: `Ready`, GO do PO registrado, quality gate `@dev`.
- Auditoria UX: concluída conceitualmente.
- Handoff UX: conteúdo consolidado neste documento.
- Código da aplicação: não alterado pela etapa UX.
- Testes e capturas da nova paleta: ainda não executados.
- Próximo responsável planejado: `@dev`.
- Antes de implementar: confirmar que este arquivo foi preservado após a mudança de máquina e que o ambiente permite `apply_patch` e execução do Node/npm.
