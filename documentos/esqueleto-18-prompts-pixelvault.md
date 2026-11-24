# Esqueleto dos 18 prompts - Primeira entrega do PI IV

**Projeto:** PixelVault - Loja de Jogos para Cloud Gaming  
**Tecnologia:** React Native com Expo e JavaScript  
**Entrega parcial:** Sprint 1, em 24/09/2026  
**Equipe:** Integrante 1 a Integrante 6  
**Product Owner:** Integrante 2  
**Versão:** 1.4 - revisada após a consolidação dos artefatos dos Prompts 1 a 9  
**Data do checkpoint:** 14/09/2026

## 1. Finalidade deste documento

Este documento define a estrutura dos 18 prompts que orientarão a primeira entrega do PI IV. Os Prompts 1 a 9 já foram executados; os Prompts 10 a 18 permanecem como esqueletos a serem detalhados após a aprovação das entradas da fase anterior. Para cada prompt, este documento registra:

- o objetivo;
- as dependências;
- as entradas esperadas;
- o resultado esperado.

Os prompts deverão ser detalhados e executados na ordem apresentada. Os resultados aprovados de uma etapa serão utilizados como entradas nas etapas seguintes, evitando contradições entre escopo, histórias, backlog, wireframes, código e relatório. O estado de execução é controlado no roadmap do projeto.

Para reduzir a quantidade de arquivos de fonte, os nove artefatos concluídos dos Prompts 1 a 9 foram reunidos integralmente em `PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md`. Os códigos `A01` a `A09` e os links internos da seção 3.1 identificam a localização exata de cada artefato. Os nomes dos arquivos individuais permanecem registrados apenas para rastreabilidade histórica.

## 2. Contexto fixo para todos os prompts

- O PixelVault é um aplicativo móvel de e-commerce especializado na venda de jogos digitais e DLCs compatíveis com plataformas de cloud gaming.
- O aplicativo contemplará cinco áreas funcionais principais:
  1. Login e cadastro do usuário;
  2. Loja e catálogo, com indicação de compatibilidade e CRUD de jogos e DLCs;
  3. Carrinho de compras;
  4. Checkout e pagamento pelo Mercado Pago;
  5. Biblioteca de jogos adquiridos e chaves de ativação.
- GeForce NOW e Boosteroid serão usados apenas como exemplos de plataformas. O projeto não pressupõe parceria nem integração oficial com essas empresas.
- O PixelVault venderá jogos e DLCs; não executará jogos e não venderá assinaturas de cloud gaming.
- Otimização de PC, montagem de setup, agendamentos, catálogo de serviços e as entidades `Serviço` e `Agendamento` estão fora do escopo e não devem reaparecer nos prompts ou artefatos.
- A solução deve ser acadêmica, simples de executar, fácil de demonstrar e fácil de corrigir.
- Devem ser usados prioritariamente os conteúdos ensinados nas aulas: componentes básicos, propriedades, `StyleSheet`, Flexbox, `TextInput`, `Pressable`, `useState`, `FlatList` e navegação simples.
- Dados, usuários, produtos, chaves e pagamentos usados na demonstração serão fictícios.
- A integração real com o Mercado Pago pode ficar parcialmente pendente, desde que exista uma estrutura demonstrável ou simulada e que a pendência seja registrada para a Sprint 2.
- O projeto não será declarado encerrado em 24/09/2026. A data representa apenas o fechamento parcial da Sprint 1.
- O Scrum Team é composto pelo Integrante 2 como Product Owner, pelo Integrante 5 como Scrum Master e pelos Integrantes 1, 3, 4 e 6 como Equipe de Desenvolvimento, sem impedir a colaboração técnica dos seis integrantes.
- O Product Backlog inicial possui 17 itens: `HU-01` a `HU-15`, `HT-01` e `HT-02`. O Sprint Backlog simulado da Sprint 1 contém `HU-01` a `HU-11`, `HT-01` e `HT-02`, totalizando 27 story points; `HU-12` a `HU-15` permanecem candidatas à Sprint 2, totalizando 26 pontos sujeitos a refinamento.
- A capacidade líquida inicial foi simulada em 30 horas. Trello, WhatsApp e Google Meet foram adotados no cenário simulado de acompanhamento. Esses dados deverão ser confirmados ou substituídos pelo grupo antes de serem tratados como registros oficiais.
- A pesquisa exploratória comparou Steam, Green Man Gaming e GeForce NOW e consolidou as decisões `UX-01` a `UX-10`. Essas decisões deverão orientar as próximas etapas sem copiar recursos fora do escopo.
- Loja de ativação, plataforma de cloud gaming e compatibilidade são conceitos distintos. Essa separação deverá permanecer na interface, nos dados e na API.
- A jornada revisada do jogador é: login/cadastro → catálogo → detalhes → carrinho → checkout simulado → resultado → biblioteca. O fluxo administrativo separado cobre consulta, inclusão, edição e exclusão local de jogos e DLCs.
- O conjunto de baixa fidelidade está na seção [`A08` - Prompt 8](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p08>) e possui `WF-01` a `WF-11` e `ST-01` a `ST-05`. A especificação da seção [`A09` - Prompt 9](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p09>), versão 1.0, prevalece sobre o documento de fluxo e wireframes versão 0.2 em caso de divergência.
- As correções `COR-01` a `COR-06` e os critérios `RESP-01` a `RESP-16` são entradas obrigatórias da implementação. A preparação dos recortes da exportação do Figma prevista em `COR-06` permanece aberta, mas não bloqueia o início do código.
- A referência de desenho é `390 × 844 px`; a implementação deverá ser verificada também em `360 px` e `320 × 568 px`, em orientação retrato, sem rolagem horizontal, com tratamento do teclado e fonte ampliada.
- Nomes e RAs reais não poderão ser inventados. Até serem informados, deverão ser utilizados os marcadores `Integrante 1` a `Integrante 6` e `[RA do Integrante]`.
- Informações sobre execução, progresso, testes, feedback, bugs ou decisões não poderão ser inventadas. Quando ainda não existirem, deverão ser apresentadas como campos a preencher. Simulações somente poderão ser usadas quando solicitadas pelo grupo e deverão permanecer claramente identificadas até sua confirmação.

## 3. Fontes gerais

Os prompts completos deverão considerar, conforme a finalidade de cada etapa:

- `Primeira entrega - Roteiro PI IV - Desenvolvimento para dispositivos móveis.pdf`;
- `Tema do trabalho.pdf`;
- `Template - Documento De Visão E Escopo.pdf`;
- `exemplo documento de visao.pdf`;
- `Template - Relatório de status.pdf`;
- `exemplo relatorio de status.pdf`;
- `exemplo e Template - Plano de Mitigação de Riscos.pdf`;
- materiais das aulas 01 a 05;
- resultados aprovados dos prompts anteriores;
- arquivos reais do projeto, à medida que forem produzidos.

Para os resultados já concluídos dos Prompts 1 a 9, deverá ser usado prioritariamente o arquivo `PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md`, com indicação do código de seção necessário. Os PDFs de roteiro, tema, templates e aulas não foram incorporados ao consolidado porque são referências externas, não artefatos produzidos pelos prompts.

### 3.1 Mapa dos artefatos concluídos no arquivo unificado

| Seção | Prompt | Artefato original preservado | Localização no arquivo unificado |
|---|---|---|---|
| `A01` | Prompt 1 | `PixelVault_Auditoria_Roteiro_Estrutura_Entrega.md` | [Abrir `A01`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p01>) |
| `A02` | Prompt 2 | `PixelVault_Visao_Produto_Stakeholders.md` | [Abrir `A02`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p02>) |
| `A03` | Prompt 3 | `PixelVault_Escopo_MVP_Limites.md` | [Abrir `A03`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p03>) |
| `A04` | Prompt 4 | `PixelVault_Historias_Usuario_Criterios_Aceitacao.md` | [Abrir `A04`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p04>) |
| `A05` | Prompt 5 | `PixelVault_Processo_Scrum_Grupo.md` | [Abrir `A05`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p05>) |
| `A06` | Prompt 6 | `PixelVault_Product_Backlog_Planning_Poker_Roadmap_Sprint.md` | [Abrir `A06`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p06>) |
| `A07` | Prompt 7 | `PixelVault_Pesquisa_Exploratoria_de_Mercado.md` | [Abrir `A07`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p07>) |
| `A08` | Prompt 8 | `PixelVault_Fluxo_Principal_Wireframes_Baixa_Fidelidade.md`, versão 0.2 | [Abrir `A08`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p08>) |
| `A09` | Prompt 9 | `PixelVault_Consistencia_UX_Rastreabilidade.md`, versão 1.0 | [Abrir `A09`](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p09>) |

Ao preparar um prompt futuro, deve-se anexar o arquivo unificado e citar somente as seções necessárias. Exemplo: o Prompt 10 depende principalmente de `A03`, `A06`, `A08` e `A09`.

## 4. Visão das dependências

| Fase | Prompts | Base necessária | Resultado que alimenta a próxima fase |
|---|---:|---|---|
| 1. Base documental, visão e escopo | 1 a 3 | Roteiro, tema e modelos | Estrutura do relatório, visão, escopo e MVP |
| 2. Histórias e planejamento ágil | 4 a 6 | Resultados da Fase 1 | Histórias, Scrum, backlog e plano da Sprint 1 |
| 3. Pesquisa de mercado e experiência do usuário | 7 a 9 | Escopo, histórias e backlog | Decisões `UX-01` a `UX-10`, fluxo, wireframes e especificação revisada |
| 4. Ambiente React Native e interfaces iniciais | 10 a 12 | Especificação de UX aprovada, correções e histórias prioritárias | Projeto executável e protótipo navegável e responsivo |
| 5. Modelagem, banco local e API Node | 13 a 15 | Escopo, interações e estruturas de dados do protótipo | DER, SQL, SQLite e API Node |
| 6. Sprint Review, monitoramento e entrega | 16 a 18 | Artefatos e evidências reais das fases anteriores | Review, status, riscos e pacote da Sprint 1 |

---

# Fase 1 - Base documental, visão e escopo

## Prompt 1 - Auditoria do roteiro e estrutura da entrega

**Responsável:** Integrante 1  
**Item atendido:** Organização geral e cobertura dos itens 1.1 a 1.6  
**Status:** Concluído - artefato integral em [`A01` - Prompt 1](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p01>)

### Objetivo

Interpretar o roteiro da primeira entrega, convertê-lo em uma estrutura de documento e em uma lista objetiva de verificação. Separar claramente o que precisa estar pronto na Sprint 1 do que continuará na Sprint 2.

### Dependências

- Não depende de outro prompt.
- Deve ser executado antes de todos os demais.

### Entradas esperadas

- Roteiro oficial da primeira entrega;
- tema PixelVault;
- roadmap de prompts já aprovado;
- exigências de formatação do trabalho;
- data de referência de 24/09/2026;
- marcadores dos seis integrantes e respectivos RAs ainda não informados.

### Resultado esperado

- esqueleto do relatório na mesma ordem dos itens 1.1 a 1.6;
- sumário preliminar;
- checklist de conteúdo e formatação;
- matriz ligando cada requisito à evidência esperada;
- inventário dos arquivos que deverão compor a entrega;
- separação entre entregas da Sprint 1 e pendências da Sprint 2.

## Prompt 2 - Visão do produto e stakeholders

**Responsável:** Integrante 2  
**Item atendido:** 1.1 - Definição do Escopo e Requisitos  
**Status:** Concluído - artefato integral em [`A02` - Prompt 2](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p02>)

### Objetivo

Produzir a visão inicial do PixelVault, descrevendo o problema, a proposta de valor, o público-alvo e os stakeholders de forma curta, coerente com o tema e adequada ao modelo acadêmico fornecido.

### Dependências

- Depende do Prompt 1 para conhecer a estrutura e os limites da entrega.

### Entradas esperadas

- resultado aprovado do Prompt 1;
- tema PixelVault;
- template e exemplo de Documento de Visão e Escopo;
- conteúdo da Aula 01 sobre visão, escopo, valor e stakeholders;
- decisão do grupo de designar o Integrante 2 como Product Owner;
- eventuais decisões reais fornecidas pelo grupo.

### Resultado esperado

- nome e breve apresentação do projeto;
- problema a ser resolvido;
- declaração de visão do produto;
- proposta de valor;
- público-alvo principal e secundário;
- lista ou matriz enxuta de stakeholders;
- texto pronto para compor a parte inicial do item 1.1.

## Prompt 3 - Escopo, MVP e limites

**Responsável:** Integrante 3  
**Item atendido:** 1.1 - Definição do Escopo e Requisitos  
**Status:** Concluído - artefato integral em [`A03` - Prompt 3](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p03>)

### Objetivo

Fechar o escopo acadêmico do PixelVault, definindo as funcionalidades essenciais do MVP, o que ficará fora da Sprint 1 e os critérios mínimos para considerar uma história pronta.

### Dependências

- Depende dos resultados aprovados dos Prompts 1 e 2.

### Entradas esperadas

- estrutura da entrega criada no Prompt 1;
- visão, público e stakeholders definidos no Prompt 2;
- cinco áreas funcionais obrigatórias do tema;
- template de Visão e Escopo;
- exigências técnicas do roteiro;
- conteúdos das aulas já ministradas;
- limitações reais de prazo, conhecimento e equipe.

### Resultado esperado

- escopo do produto;
- itens explicitamente fora do escopo desta entrega;
- objetivo do MVP;
- tabela enxuta de funcionalidades essenciais e prioridades;
- Definition of Done verificável e compatível com graduação;
- lista inicial de pendências previstas para a Sprint 2.

---

# Fase 2 - Histórias e planejamento ágil

## Prompt 4 - Histórias de usuário e critérios de aceitação

**Responsável:** Integrante 4  
**Item atendido:** 1.1 - Definição do Escopo e Requisitos  
**Status:** Concluído - artefato integral em [`A04` - Prompt 4](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p04>)

### Objetivo

Transformar o escopo aprovado em histórias de usuário pequenas, priorizáveis e testáveis, cobrindo as cinco áreas funcionais e o fluxo principal sem aumentar indevidamente o MVP.

### Dependências

- Depende dos resultados aprovados dos Prompts 2 e 3.

### Entradas esperadas

- visão, públicos e stakeholders;
- escopo, MVP, prioridades e Definition of Done;
- cinco áreas funcionais obrigatórias;
- conteúdo da Aula 01 sobre histórias, INVEST e critérios de aceitação;
- decisões já aprovadas pelo grupo.

### Resultado esperado

- 15 histórias funcionais e 2 histórias técnicas no formato aplicável, com `HU-01` a `HU-15`, `HT-01` e `HT-02`;
- IDs únicos e prioridades;
- critérios de aceitação objetivos para cada história;
- indicação da tela ou do fluxo relacionado;
- identificação de histórias técnicas somente quando necessárias;
- 11 histórias funcionais e 2 técnicas candidatas à Sprint 1;
- 4 histórias funcionais candidatas à Sprint 2.

## Prompt 5 - Processo Scrum do grupo

**Responsável:** Integrante 5  
**Item atendido:** 1.2 - Estruturação do Planejamento Ágil  
**Status:** Concluído - artefato integral em [`A05` - Prompt 5](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p05>)

### Objetivo

Definir uma aplicação simples e realista do Scrum para uma equipe acadêmica de seis pessoas, registrando papéis, artefatos, eventos, frequência e forma de acompanhamento.

### Dependências

- Depende do escopo do Prompt 3 e das histórias do Prompt 4.

### Entradas esperadas

- composição da equipe com seis integrantes;
- período planejado da Sprint 1 até 24/09/2026;
- histórias iniciais;
- conteúdo da Aula 01 sobre Scrum;
- definição já aprovada do Integrante 2 como Product Owner;
- disponibilidade e forma real de trabalho do grupo, quando informadas.

### Resultado esperado

- confirmação do Integrante 2 como Product Owner, do Integrante 5 como Scrum Master e dos Integrantes 1, 3, 4 e 6 como Equipe de Desenvolvimento;
- responsabilidades dos papéis;
- agenda curta de Sprint Planning, acompanhamento, Sprint Review e retrospectiva;
- descrição do Product Backlog, Sprint Backlog e incremento;
- método de acompanhamento com atualização assíncrona e duas reuniões semanais de até 15 minutos;
- campos de disponibilidade, ferramentas e horários encaminhados para preenchimento e consolidação no Prompt 6;
- distribuição compatível com os seis integrantes.

## Prompt 6 - Product Backlog, Planning Poker e roadmap da Sprint

**Responsável:** Integrante 6  
**Item atendido:** 1.2 - Estruturação do Planejamento Ágil  
**Status:** Concluído - artefato integral em [`A06` - Prompt 6](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p06>)

### Objetivo

Organizar as histórias em um Product Backlog priorizado, preparar a estimativa colaborativa e selecionar um conjunto realista de itens para a Sprint 1, deixando a continuidade claramente indicada para a Sprint 2.

### Dependências

- Depende dos resultados aprovados dos Prompts 3, 4 e 5.

### Entradas esperadas

- escopo e limites do MVP;
- histórias e critérios de aceitação;
- processo Scrum definido;
- estimativas individuais dos participantes ou campos para registrá-las;
- critérios de prioridade, dependências e capacidade real do grupo;
- data de fechamento parcial em 24/09/2026.

### Resultado esperado

- Product Backlog priorizado com 17 itens e suas dependências;
- tabela de Planning Poker com escala Fibonacci e votos simulados dos seis integrantes;
- divergências, riscos e consensos simulados claramente identificados;
- capacidade líquida simulada de 30 horas;
- Sprint Backlog inicial com 13 itens e 27 story points, organizado em oito pacotes de trabalho;
- Meta da Sprint 1;
- roadmap resumido até 24/09/2026;
- quatro histórias candidatas à Sprint 2, totalizando 26 story points sujeitos a refinamento;
- responsáveis, revisores, Trello, WhatsApp e Google Meet registrados no cenário simulado.

### Resultado consolidado da Fase 2

- histórias iniciais e critérios de aceitação concluídos;
- Processo Scrum definido para os seis integrantes;
- Product Backlog, Planning Poker, capacidade, Meta e Sprint Backlog preenchidos;
- dados simulados mantidos com indicação explícita de confirmação obrigatória antes da entrega oficial;
- item 1.2 - Estruturação do Planejamento Ágil preparado para consolidação no relatório da Sprint 1.

---

# Fase 3 - Pesquisa de mercado e experiência do usuário

## Prompt 7 - Pesquisa exploratória de mercado

**Responsável:** Integrante 1  
**Item atendido:** 1.3 - Pesquisa de Mercado e Design de Interface  
**Status:** Concluído - artefato integral em [`A07` - Prompt 7](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p07>)

### Objetivo

Orientar uma pesquisa breve de concorrentes para identificar padrões úteis de catálogo, indicação de compatibilidade com cloud gaming, carrinho, checkout e biblioteca, convertendo as observações em decisões práticas para o PixelVault.

### Dependências

- Depende da visão e do escopo dos Prompts 2 e 3.
- Deve considerar as histórias e o Product Backlog consolidados nos Prompts 4 e 6.

### Entradas esperadas

- visão, público-alvo, proposta de valor e escopo;
- critérios de comparação definidos pelo grupo;
- dois ou três concorrentes realmente pesquisados;
- links, capturas ou anotações obtidas na pesquisa;
- histórias `HU-01` a `HU-11`, `HT-01` e `HT-02` selecionadas para a Sprint 1;
- Product Backlog priorizado e Meta da Sprint 1.

### Resultado esperado

- tabela comparativa de dois ou três concorrentes;
- fontes e data da pesquisa;
- pontos fortes, limitações e padrões encontrados;
- aprendizados aplicáveis ao PixelVault;
- decisões de interface justificadas;
- evidências identificadas para inclusão no relatório.

## Prompt 8 - Fluxo principal e wireframes de baixa fidelidade

**Responsável:** Integrante 2  
**Item atendido:** 1.3 - Pesquisa de Mercado e Design de Interface  
**Status:** Concluído - artefato integral em [`A08` - Prompt 8](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p08>), versão 0.2

### Objetivo

Definir o fluxo principal do usuário e orientar a criação de wireframes simples e legíveis para as cinco áreas funcionais obrigatórias, priorizando navegação clara e facilidade de demonstração.

### Dependências

- Depende dos Prompts 3, 4, 6 e 7.

### Entradas esperadas

- escopo e funcionalidades essenciais;
- histórias priorizadas e Sprint Backlog;
- decisões derivadas da pesquisa de mercado;
- fluxo obrigatório entre login, catálogo, carrinho, checkout e biblioteca;
- ações mínimas de CRUD de jogos e DLCs;
- ferramenta escolhida pelo grupo para desenhar os wireframes.

### Resultado esperado

- diagrama simples do fluxo principal;
- especificação de conteúdo e ações de cada tela;
- conjunto de wireframes de baixa fidelidade cobrindo as cinco áreas funcionais, com telas adicionais quando necessárias para login/cadastro ou CRUD;
- caminhos de navegação entre as telas;
- estados básicos relevantes, como vazio, preenchido e erro;
- lista das imagens ou figuras que entrarão no relatório.

## Prompt 9 - Consistência de UX e rastreabilidade

**Responsável:** Integrante 3  
**Item atendido:** 1.3 - Pesquisa de Mercado e Design de Interface  
**Status:** Concluído - artefato integral em [`A09` - Prompt 9](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p09>), versão 1.0

### Objetivo

Revisar o fluxo e os wireframes para confirmar que as histórias prioritárias estão representadas, que as ações são demonstráveis e que a interface planejada pode funcionar em telas móveis pequenas.

### Dependências

- Depende dos resultados aprovados dos Prompts 4, 6, 7 e 8.

### Entradas esperadas

- histórias e critérios de aceitação;
- Product Backlog e Sprint Backlog;
- decisões da pesquisa de mercado;
- fluxo e wireframes;
- critérios mínimos de legibilidade e adaptação para telas pequenas.

### Resultado esperado

- matriz ligando histórias a telas e ações;
- checklist de navegação e consistência;
- lista de lacunas, conflitos e correções necessárias;
- versão revisada das especificações dos wireframes;
- critérios mínimos de responsividade para orientar a implementação;
- aprovação ou pendências antes do início do código.

### Resultado consolidado da Fase 3

- pesquisa exploratória concluída com Steam, Green Man Gaming e GeForce NOW, fontes oficiais, limitações e decisões `UX-01` a `UX-10`;
- fluxo do jogador e fluxo administrativo definidos;
- onze wireframes principais (`WF-01` a `WF-11`) e cinco estados alternativos (`ST-01` a `ST-05`) produzidos no Figma;
- exportação integral de `962 × 2048 px` incorporada ao artefato de wireframes e considerada adequada como visão geral digital;
- rastreabilidade de `HU-01` a `HU-11`, `HT-01` e `HT-02` revisada;
- correções `COR-01` a `COR-06`, critérios `RESP-01` a `RESP-16` e casos de verificação `UXT-01` a `UXT-14` definidos;
- aceite do Product Owner registrado em 14/09/2026 para início da implementação;
- seção [`A09` - Prompt 9](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p09>), versão 1.0, definida como especificação prevalente sobre a seção [`A08` - Prompt 8](<PixelVault_Artefatos_Consolidados_Prompts_1_a_9.md#artefato-p08>), versão 0.2;
- recortes da exportação do Figma mantidos em aberto para a consolidação do relatório final, sem bloquear a Fase 4;
- item 1.3 - Pesquisa de Mercado e Design de Interface (Wireframing) preparado para consolidação no relatório da Sprint 1.

---

# Fase 4 - Ambiente React Native e interfaces iniciais

## Prompt 10 - Configuração do projeto e organização do código

**Responsável:** Integrante 4  
**Item atendido:** 1.4 - Configuração do Ambiente e Interface Inicial

### Objetivo

Orientar a criação ou a verificação do projeto Expo/React Native, definir uma estrutura pequena de arquivos e registrar instruções reproduzíveis para instalar, iniciar e demonstrar o aplicativo.

### Dependências

- Depende dos Prompts 3, 6, 8 e 9.
- Deve anteceder os Prompts 11 e 12.
- Deve adotar a especificação revisada do Prompt 9 quando houver divergência com o wireframe versão 0.2.

### Entradas esperadas

- escopo técnico aprovado;
- histórias selecionadas para a Sprint 1;
- fluxo e wireframes revisados;
- correções `COR-01` a `COR-06`, critérios `RESP-01` a `RESP-16` e roteiro `UXT-01` a `UXT-14`;
- ambiente real da equipe e versões instaladas;
- materiais das Aulas 02 e 03;
- estado atual do repositório, se o projeto já tiver sido iniciado.

### Resultado esperado

- projeto Expo/React Native criado ou validado;
- estrutura enxuta de pastas para telas, componentes, dados e integrações;
- dependências mínimas justificadas;
- comandos reais de instalação e execução;
- README curto;
- evidência de que o aplicativo compila e inicia;
- preparação para testes em `390 × 844 px`, `360 px` e `320 × 568 px`;
- registro de problemas reais encontrados, sem inventar resultados.

## Prompt 11 - Componentes visuais e cinco áreas funcionais iniciais

**Responsável:** Integrante 5  
**Item atendido:** 1.4 - Configuração do Ambiente e Interface Inicial

### Objetivo

Orientar a implementação visual das cinco áreas funcionais do PixelVault com identidade simples, navegação compreensível e componentes reutilizáveis apenas onde houver repetição real.

### Dependências

- Depende dos Prompts 8, 9 e 10.
- Deve seguir a especificação revisada do Prompt 9, inclusive a entrada dos dois perfis fictícios pelo login e a continuidade dos dados da jornada.

### Entradas esperadas

- wireframes e fluxo revisados;
- critérios mínimos de responsividade;
- decisões `UX-01` a `UX-10` e correções `COR-01` a `COR-06`;
- projeto Expo em funcionamento;
- paleta, tipografia, imagens e textos fictícios aprovados pelo grupo;
- materiais das Aulas 02, 03 e 05;
- restrições técnicas e componentes já existentes no repositório.

### Resultado esperado

- interfaces das cinco áreas funcionais implementadas e navegáveis;
- uso coerente de `View`, `Text`, `Image`, `StyleSheet`, Flexbox, `TextInput`, `Pressable` e listas;
- componentes reutilizáveis essenciais;
- identidade visual consistente;
- adaptação a telas pequenas conforme `RESP-01` a `RESP-16`;
- capturas reais das telas para o relatório;
- lista de diferenças justificadas entre wireframe e implementação.

## Prompt 12 - Interações acadêmicas do protótipo

**Responsável:** Integrante 6  
**Item atendido:** 1.4 - Configuração do Ambiente e Interface Inicial

### Objetivo

Adicionar interações suficientes para demonstrar o fluxo acadêmico: formulário de login/cadastro, catálogo e CRUD, carrinho, checkout simulado e biblioteca, utilizando estado local e dados fictícios.

### Dependências

- Depende dos Prompts 4, 6, 10 e 11.
- Deve preservar as regras, os estados e os retornos definidos no Prompt 9.

### Entradas esperadas

- histórias e critérios de aceitação da Sprint 1;
- projeto e interfaces das cinco áreas funcionais implementadas;
- dados fictícios iniciais;
- regras simples do carrinho, checkout e biblioteca;
- contrato de continuidade dos dados entre catálogo, carrinho, checkout, resultado e biblioteca;
- feedbacks `FB-01` a `FB-06` e casos de verificação `UXT-01` a `UXT-14`;
- materiais das Aulas 04 e 05;
- Definition of Done.

### Resultado esperado

- fluxo demonstrável com `useState`;
- listas implementadas preferencialmente com `FlatList`;
- CRUD demonstrativo de jogos e DLCs;
- adição e remoção de itens do carrinho, prevenção de duplicidade indevida e atualização do valor total;
- formulário de checkout com validações básicas e pagamento simulado;
- inclusão simulada de compra na biblioteca;
- mensagens básicas de sucesso e erro;
- distinção demonstrável entre login de jogador e de administrador/curador fictício;
- verificação da ausência de duplicidade no carrinho e da continuidade de itens, quantidades e total;
- roteiro de teste manual baseado em `UXT-01` a `UXT-14` e resultados reais registrados.

---

# Fase 5 - Modelagem, banco local e API Node

## Prompt 13 - Modelo de dados e DER

**Responsável:** Integrante 1  
**Item atendido:** 1.5 - Modelagem, Estrutura do Banco de Dados e Node

### Objetivo

Transformar o escopo e os dados usados pelo protótipo em um modelo relacional mínimo, coerente com usuários, jogos e DLCs, plataformas de cloud gaming, compatibilidades, carrinho, pedidos, pagamentos, biblioteca e chaves de ativação.

### Dependências

- Depende dos Prompts 3, 4, 6, 9 e 12.

### Entradas esperadas

- escopo e funcionalidades do MVP;
- histórias e critérios de aceitação;
- estruturas de dados realmente utilizadas no protótipo;
- requisitos do item 1.5 do roteiro;
- decisões do grupo sobre a representação de jogos, DLCs, plataformas e compatibilidades;
- decisão `UX-10`, que separa produto, loja de ativação, plataforma cloud e compatibilidade.

### Resultado esperado

- lista de entidades essenciais;
- atributos mínimos e identificadores;
- relacionamentos e cardinalidades;
- regras simples de integridade;
- DER legível;
- dicionário de dados resumido;
- rastreabilidade entre entidades e funcionalidades;
- ausência de tabelas ou campos sem uso no escopo.

## Prompt 14 - Script SQL e banco local

**Responsável:** Integrante 2  
**Item atendido:** 1.5 - Modelagem, Estrutura do Banco de Dados e Node

### Objetivo

Converter o DER aprovado em um script SQL reproduzível e preparar uma base SQLite local simples, com pequena massa de dados fictícios suficiente para demonstração.

### Dependências

- Depende do Prompt 13.
- Deve estar alinhado aos dados usados no Prompt 12.

### Entradas esperadas

- DER e dicionário de dados aprovados;
- estruturas de dados do protótipo;
- ambiente real do projeto;
- regras mínimas de integridade;
- exemplos fictícios de usuários, jogos, DLCs, plataformas compatíveis e pedidos.

### Resultado esperado

- script SQL de criação das tabelas;
- chaves primárias e estrangeiras coerentes;
- script ou procedimento simples de inicialização do SQLite;
- pequena massa de teste fictícia;
- instruções para recriar o banco;
- testes básicos reais de criação, inserção e consulta;
- evidências do esquema e dos testes para o relatório.

## Prompt 15 - API Node e fronteira do Mercado Pago

**Responsável:** Integrante 3  
**Item atendido:** 1.5 - Modelagem, Estrutura do Banco de Dados e Node

### Objetivo

Orientar a criação de uma API Node mínima para apoiar o protótipo e definir uma fronteira segura e demonstrável para o Mercado Pago, permitindo resposta simulada quando a integração real não estiver pronta.

### Dependências

- Depende dos Prompts 4, 12, 13 e 14.

### Entradas esperadas

- histórias e critérios de aceitação relacionados a dados e pagamento;
- fluxo funcional do protótipo;
- DER, dicionário e banco SQLite;
- ambiente Node real da equipe;
- endpoints estritamente necessários;
- documentação oficial consultada do Mercado Pago;
- definição sobre uso de credenciais de teste ou modo simulado.

### Resultado esperado

- backend Node executável;
- organização mínima do código;
- rota de saúde;
- endpoints essenciais documentados;
- acesso simples aos dados locais quando aplicável;
- contrato da rota ou operação de criação de pagamento;
- modo simulado sem credenciais reais;
- testes básicos reais dos endpoints;
- limitações e pendências registradas para a Sprint 2.

---

# Fase 6 - Sprint Review, monitoramento e entrega

## Prompt 16 - Sprint Review e tratamento do feedback

**Responsável:** Integrante 4  
**Item atendido:** 1.6 - Monitoramento e Sprint Review

### Objetivo

Preparar a primeira Sprint Review, orientar uma demonstração curta das interfaces e registrar somente feedback, decisões e mudanças que realmente ocorrerem.

### Dependências

- Depende dos Prompts 6, 9, 11, 12 e 15.
- Só poderá ser finalizado após a reunião ou validação real.

### Entradas esperadas

- meta e Sprint Backlog;
- versão executável disponível para demonstração;
- estado real das interfaces, interações e backend;
- participantes reais da Review;
- anotações ou gravações da reunião;
- feedback recebido;
- itens concluídos, incompletos e não iniciados;
- resultados reais dos casos `UXT-01` a `UXT-14` e das correções `COR-01` a `COR-06` aplicáveis.

### Resultado esperado

- pauta e roteiro de demonstração;
- registro da data e dos participantes;
- ata objetiva da Sprint Review;
- lista de funcionalidades efetivamente demonstradas;
- feedback real agrupado por tema;
- decisões de aceitar, alterar, priorizar ou adiar;
- Product Backlog revisado;
- lições aprendidas e ações para a Sprint 2.

## Prompt 17 - Relatório de status e plano de riscos

**Responsável:** Integrante 5  
**Item atendido:** 1.6 - Monitoramento e Sprint Review

### Objetivo

Consolidar o estado real da Sprint 1 em um relatório curto e produzir um registro de riscos adequado ao PixelVault, detalhando mitigação e contingência somente para riscos de alta prioridade.

### Dependências

- Depende dos Prompts 1, 6, 10, 12, 14, 15 e 16.
- Só poderá usar percentuais, entregas, bugs e riscos confirmados pelo grupo.

### Entradas esperadas

- template e exemplo de Relatório de Status;
- template e exemplo de Plano de Mitigação de Riscos;
- Product Backlog e Sprint Backlog atualizados;
- evidências reais de progresso e testes;
- impedimentos, bugs e riscos identificados;
- resultados e decisões da Sprint Review;
- responsáveis distribuídos entre Integrantes 1 a 6;
- data de referência até 24/09/2026.

### Resultado esperado

- Relatório de Status da Sprint 1;
- status geral justificado;
- cálculo verificável do progresso;
- entregas realizadas e próximas entregas;
- registro de riscos com categoria, probabilidade, impacto, prioridade e status;
- plano de mitigação preventiva e Plano B para riscos altos;
- responsáveis equilibrados entre os seis integrantes;
- frequência de monitoramento;
- pendências e próximos passos da Sprint 2.

## Prompt 18 - Consolidação, revisão final e passagem para a Sprint 2

**Responsável:** Integrante 6  
**Item atendido:** Organização geral da primeira entrega

### Objetivo

Reunir os documentos, evidências e código da Sprint 1, revisar a aderência ao roteiro e preparar um pacote acadêmico coerente, sem declarar o projeto encerrado.

### Dependências

- Depende da conclusão e aprovação dos Prompts 1 a 17.
- É o último prompt da sequência.

### Entradas esperadas

- relatório estruturado e matriz requisito-evidência;
- todos os textos aprovados das seções 1.1 a 1.6;
- histórias, backlogs, estimativas, pesquisa, wireframes e DER;
- especificação revisada de UX, registro do aceite do Product Owner e regra de prevalência documental;
- código real do aplicativo, banco e backend;
- capturas, testes e evidências reais;
- exportação integral do Figma e os recortes previstos em `COR-06`, caso já preparados;
- Sprint Review, Relatório de Status e Plano de Riscos;
- nomes e RAs reais, se já fornecidos;
- normas de formatação e bibliografia;
- lista de pendências da Sprint 2.

### Resultado esperado

- relatório completo na ordem do roteiro;
- capa, sumário, introdução, desenvolvimento, conclusão parcial, bibliografia e anexos necessários;
- itens 1.1 a 1.6 claramente identificados;
- matriz final de requisitos e evidências;
- revisão de consistência entre documentação e implementação;
- revisão de ortografia, numeração, figuras, fontes e datas;
- conferência da continuidade dos dados e da aplicação das correções `COR-01` a `COR-06`;
- registro explícito dos recortes do Figma como concluídos ou pendentes, sem ocultar a situação real;
- checklist final preenchido;
- pacote da Sprint 1 organizado para entrega;
- seção explícita de próximos passos da Sprint 2;
- nenhuma declaração de encerramento definitivo do PixelVault.

---

## 5. Distribuição dos responsáveis

| Integrante | Prompts sob responsabilidade |
|---|---|
| Integrante 1 | 1, 7 e 13 |
| Integrante 2 | 2, 8 e 14 |
| Integrante 3 | 3, 9 e 15 |
| Integrante 4 | 4, 10 e 16 |
| Integrante 5 | 5, 11 e 17 |
| Integrante 6 | 6, 12 e 18 |

Cada integrante coordena três prompts, mas todo resultado deverá ser revisado por pelo menos outro membro antes de ser considerado entrada aprovada para a etapa seguinte.

## 6. Regra para detalhar os prompts posteriormente

Ao transformar cada esqueleto em um prompt operacional, deverão ser acrescentados:

- papel que a IA deverá assumir;
- instruções detalhadas de execução;
- formato exato da resposta;
- critérios de validação;
- restrições sobre informações que não podem ser inventadas;
- nomes dos arquivos de entrada e saída;
- evidências que deverão ser guardadas para o relatório;
- códigos das seções `A01` a `A09` do arquivo unificado que serão usadas como entrada, evitando solicitar novamente os nove arquivos individuais;
- pergunta final de confirmação quando faltar uma decisão do grupo.

O prompt completo de uma nova fase somente deverá ser fechado depois que as entradas produzidas pela fase anterior forem revisadas e aprovadas.
