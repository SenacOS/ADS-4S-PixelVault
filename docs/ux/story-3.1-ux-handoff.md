# UX Handoff — Story 3.1

**Data:** 2026-09-18  
**Origem:** auditoria de Uma (`@ux-design-expert`) consolidada em `docs/story-3.1-machine-handoff.md`  
**Destino:** implementação por `@dev`

## Objetivo e limite

Substituir a identidade provisória escura por uma interface predominantemente branca, com conteúdo preto/cinza muito escuro e destaque amarelo ouro fosco. A mudança é exclusivamente de apresentação: fluxos, rotas, dados, validações, textos funcionais, estado local e regras de negócio permanecem inalterados.

## Auditoria da base

- 11 arquivos visuais React Native inspecionados.
- 15 cores hexadecimais únicas: 13 centralizadas em `src/theme/tokens.js` e 2 fundos hardcoded em `FeedbackBanner`.
- 28 ocorrências estáticas de `AppButton`, 11 de `LabeledField` e um `TextInput` direto encapsulado por `LabeledField`.
- Escalas existentes a preservar: espaçamento `4, 8, 12, 16, 24, 32`; raios `8, 12, 18`; alvo preferencial de toque `48 dp`, nunca inferior a `44 dp`.

## Paleta aprovada

| Papel | Valor | Uso principal |
|---|---|---|
| `background` | `#FFFFFF` | Fundo predominante e área segura |
| `surface` | `#FAF9F6` | Cartões, campos, banners e painéis |
| `surfaceRaised` | `#F3F1EA` | Capas neutras e níveis secundários |
| `text` | `#171717` | Conteúdo principal |
| `textMuted` | `#4B5563` | Conteúdo secundário |
| `textSubtle` | `#6B7280` | Placeholder e conteúdo auxiliar |
| `border` | `#8A8178` | Contornos funcionais |
| `accent` | `#C49A32` | Preenchimento primário ouro fosco |
| `accentPressed` | `#AE8426` | Estado pressionado da ação primária |
| `accentDark` | `#745713` | Ouro textual, preço e indicador |
| `accentSurface` | `#FBF3DC` | Seleção e informação leves |
| `focus` | `#5A4310` | Foco visível de `3 dp` |
| `success` / `successSurface` | `#166534` / `#F0FDF4` | Sucesso |
| `warning` / `warningSurface` | `#7A4D00` / `#FFF8E6` | Aviso |
| `danger` / `dangerSurface` | `#B42318` / `#FEF3F2` | Erro e perigo |
| `disabled` / `disabledText` / `disabledBorder` | `#E7E5E4` / `#57534E` / `#78716C` | Estado desabilitado |
| `shadow` | `#171717` | Sombra sutil |

O ouro claro não deve ser usado como texto, ícone fino, foco ou borda isolada sobre branco. Botões primários usam `accent` com conteúdo `text`; preço, eyebrow e destaques lineares usam `accentDark`. As cores legadas `#70d6ff` e `#12324a` não permanecem como marca ou destaque ativo. Não usar gradientes, glow ou superfícies escuras extensas.

## Contrastes aprovados

| Combinação | Razão |
|---|---:|
| `text` / `background` | `17,93:1` |
| `text` / `surface` | `17,03:1` |
| `textMuted` / `background` | `7,56:1` |
| `textMuted` / `surface` | `7,18:1` |
| `textSubtle` / `background` | `4,83:1` |
| `border` / `background` | `3,82:1` |
| `border` / `surface` | `3,63:1` |
| `text` / `accent` | `6,84:1` |
| `text` / `accentPressed` | `5,23:1` |
| `accentDark` / `background` | `6,74:1` |
| `accentDark` / `accentSurface` | `6,08:1` |
| `focus` / `background` | `9,35:1` |
| `focus` / `accent` | `3,57:1` |
| `success` / `successSurface` | `6,81:1` |
| `warning` / `warningSurface` | `6,86:1` |
| `danger` / `dangerSurface` | `6,05:1` |
| branco / `danger` | `6,57:1` |
| `disabledText` / `disabled` | `6,08:1` |
| `disabledBorder` / `background` | `4,80:1` |

## Contrato visual dos componentes

- `ScreenShell`: fundo branco, status bar escura, safe area, teclado, scroll e largura máxima preservados.
- `AppText`: título/corpo em `text`, secundário/label em `textMuted`, eyebrow em `accentDark`.
- `AppButton`: primário `accent + text`; pressed `accentPressed`; secundário `surfaceRaised + border`; ghost transparente + borda; danger `danger + branco`; disabled com trio dedicado; foco `3 dp focus`.
- `LabeledField`: `surface`, `text`, `border`, placeholder `textSubtle`, foco `focus`, erro `danger` acompanhado por mensagem.
- `ProductCard`: superfície clara, borda, capa `surfaceRaised`, preço e iniciais em `accentDark`; ações podem quebrar linha.
- `FeedbackBanner`: sem hexadecimais locais; informação usa `accentSurface/accentDark`, e sucesso/erro usam seus pares semânticos.
- `EmptyState`: superfície clara, borda e espaço de `24`; título, descrição e ação explícitos.
- `BottomNavigation`: base clara; selecionado em `accentSurface`, indicador `accentDark`, texto “Ativo”, foco independente e alvos de `48 dp`.

Estados pressionados não dependem apenas de opacidade. Seleção, sucesso, erro, perigo, ativo e desabilitado mantêm texto ou semântica acessível além da cor.

## Cobertura e validação

- Cobrir `WF-01..WF-11` e `ST-01..ST-05` em `390 × 844`.
- Amostrar as cinco áreas em `360 × 844` e `320 × 568`, mantendo uma coluna e sem overflow horizontal.
- Verificar fonte a pelo menos `130%`, teclado aberto, safe area, rolagem, rodapé, foco visível e alvos de toque.
- Confirmar texto normal `≥4,5:1`, texto grande `≥3:1` e componentes/estados essenciais `≥3:1`.
- Comparar com `docs/evidence/prompt-11/` e `docs/evidence/prompt-12/` e registrar evidências novas sem alegar verificações não executadas.
- Executar `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.

## Ordem recomendada

1. Consultar a documentação versionada do Expo SDK 54.
2. Evoluir `src/theme/tokens.js`, sem criar tema paralelo.
3. Atualizar `StatusBar` e `ScreenShell`.
4. Refinar os oito componentes compartilhados.
5. Remover hardcodes de `FeedbackBanner` e usos inadequados de `accent`/`accentDark`.
6. Fazer somente os ajustes locais necessários em acesso, loja e administração.
7. Atualizar os testes estruturais e de contraste.
8. Capturar evidências reais e registrar qualquer ajuste final de paleta.

## Limitações herdadas

Na etapa UX original, o aplicativo e os gates não foram executados por limitações do ambiente WSL1; o ícone não foi inspecionado no app real e o checklist WCAG citado pela persona não existia no checkout. Essas verificações permanecem obrigatórias durante a implementação. O ambiente atual confirmou Node `22.18.0`, npm `11.5.2` e Expo `~54.0.36`.
