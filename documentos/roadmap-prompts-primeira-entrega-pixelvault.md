# Roadmap de prompts - Primeira entrega do PI IV

**Projeto:** PixelVault - Loja de Jogos e Serviços Gamer  
**Tecnologia obrigatória:** React Native  
**Marco desta entrega:** 24/09/2026  
**Equipe:** 6 integrantes, identificados neste roadmap como Integrante 1 a Integrante 6

## 1. Objetivo do roadmap

Organizar a futura criação dos prompts que conduzirão a primeira entrega do projeto, cobrindo exatamente os itens 1.1 a 1.6 do roteiro e apresentando as evidências na mesma ordem. O objetivo é produzir um trabalho acadêmico consistente, simples de executar e fácil de corrigir, sem acrescentar arquitetura ou funcionalidades desnecessárias.

Este roadmap termina no fechamento da **Sprint 1 em 24/09/2026**. Essa data não representa o encerramento do PixelVault: ao final da entrega, o aplicativo ainda estará em desenvolvimento e seguirá para a Sprint 2.

## 2. Diretrizes que todos os futuros prompts deverão seguir

- Usar o tema PixelVault: e-commerce de jogos digitais, DLCs e serviços gamer.
- Manter as cinco telas definidas no tema:
  1. Login e cadastro do usuário;
  2. Loja e catálogo geral, com CRUD de jogos e serviços;
  3. Carrinho de compras;
  4. Checkout e pagamento pelo Mercado Pago;
  5. Biblioteca de jogos adquiridos e chaves de ativação.
- Tratar a entrega como acadêmica: solução demonstrável, organizada e coerente, sem buscar robustez de produção.
- Usar React Native com Expo e JavaScript, conforme os exemplos das aulas.
- Privilegiar os conceitos já ensinados: componentes, propriedades, `StyleSheet`, Flexbox, `TextInput`, `Pressable`, `useState`, `FlatList` e navegação simples.
- Evitar Redux, microsserviços, arquitetura excessivamente abstrata, autenticação complexa, testes de carga e infraestrutura de produção.
- Usar dados fictícios e credenciais de teste. Nenhuma chave real ou dado pessoal deve ser colocado no código ou no relatório.
- Para o Mercado Pago, nesta primeira entrega é suficiente deixar a tela, o fluxo, o contrato de integração e a estrutura técnica preparados. A integração completa pode continuar na Sprint 2, desde que isso seja declarado com clareza.
- Todo texto que mencionar término, fechamento ou data final desta entrega deve apontar para **24/09/2026**.
- A conclusão do documento deve ser chamada de **conclusão parcial da Sprint 1** e indicar os próximos passos da Sprint 2.
- Não criar Documento de Encerramento do Projeto nesta etapa.
- Em todos os campos de nome e responsabilidade, usar os marcadores `Integrante 1` a `Integrante 6` até que o grupo forneça nomes e RAs reais.

## 3. Estrutura recomendada para facilitar a correção

O PDF da primeira entrega deve repetir a ordem e a numeração do roteiro:

1. Capa - seis nomes e RAs;
2. Sumário;
3. Introdução e apresentação do PixelVault;
4. **1.1 Definição do Escopo e Requisitos**;
5. **1.2 Estruturação do Planejamento Ágil**;
6. **1.3 Pesquisa de Mercado e Design de Interface (Wireframing)**;
7. **1.4 Configuração do Ambiente e Interface Inicial**;
8. **1.5 Modelagem, Estrutura do Banco de Dados e Node**;
9. **1.6 Monitoramento e Sprint Review**;
10. Conclusão parcial da Sprint 1;
11. Bibliografia;
12. Anexos, apenas quando forem necessários.

Cada seção deve terminar com uma pequena lista intitulada **Evidências produzidas**, apontando para tabelas, figuras, telas, arquivos ou links apresentados. Isso permitirá que o professor confirme rapidamente o atendimento ao roteiro.

## 4. Roadmap geral dos futuros prompts

O roadmap está dividido em seis fases e dezoito prompts futuros. Os textos dos prompts ainda não serão criados; abaixo está somente a função de cada um.

### Fase 1 - Base documental e escopo

**Período sugerido:** 13/09 a 14/09  
**Resultado da fase:** estrutura do relatório e conteúdo-base do item 1.1.

| Etapa | Item do roteiro | Responsável | O que o futuro prompt deverá fazer | Saída esperada |
|---|---|---|---|---|
| 1. Auditoria do roteiro e estrutura da entrega | Geral | Integrante 1 | Transformar os requisitos do roteiro em checklist e montar o esqueleto do documento na ordem de correção. Separar o que pertence à Sprint 1 do que continuará na Sprint 2. | Sumário, matriz requisito-evidência e lista de arquivos da entrega. |
| 2. Visão do produto e stakeholders | 1.1 | Integrante 2 | Definir problema, visão, proposta de valor, público-alvo e stakeholders do PixelVault em linguagem objetiva. | Seções 1.1 a 1.4 do Documento de Visão e Escopo, adaptadas ao tema. |
| 3. Escopo, MVP e limites | 1.1 | Integrante 3 | Definir escopo do produto, fora do escopo, objetivo do MVP, funcionalidades essenciais e uma Definition of Done adequada a um trabalho de graduação. | Escopo fechado, tabela do MVP e DoD verificável. |

### Fase 2 - Planejamento ágil

**Período sugerido:** 15/09 a 16/09  
**Resultado da fase:** histórias que completam o item 1.1 e planejamento ágil do item 1.2.

| Etapa | Item do roteiro | Responsável | O que o futuro prompt deverá fazer | Saída esperada |
|---|---|---|---|---|
| 4. Histórias de usuário e critérios de aceitação | 1.1 | Integrante 4 | Criar histórias pequenas e testáveis, seguindo o formato “Como..., quero..., para...”, cobrindo as cinco telas e o fluxo principal. Aplicar INVEST sem transformar o trabalho em um documento extenso. | Conjunto enxuto de histórias com prioridade e critérios de aceitação. |
| 5. Processo Scrum do grupo | 1.2 | Integrante 5 | Definir Product Owner, Scrum Master e equipe de desenvolvimento, além de artefatos e cerimônias usados pela equipe. Manter uma dinâmica realista para seis alunos. | Quadro de papéis, agenda curta de cerimônias e definição dos artefatos. |
| 6. Product Backlog, Planning Poker e roadmap | 1.2 | Integrante 6 | Organizar e priorizar as histórias, registrar uma estimativa Fibonacci consensual e separar o que cabe na Sprint 1 do que permanece para a Sprint 2. | Product Backlog priorizado, tabela de Planning Poker e roadmap até 24/09. |

### Fase 3 - Pesquisa e experiência do usuário

**Período sugerido:** 17/09 a 18/09  
**Resultado da fase:** pesquisa exploratória, fluxo e wireframes do item 1.3.

| Etapa | Item do roteiro | Responsável | O que o futuro prompt deverá fazer | Saída esperada |
|---|---|---|---|---|
| 7. Pesquisa exploratória de mercado | 1.3 | Integrante 1 | Comparar de dois a três concorrentes relevantes em poucos critérios: catálogo, carrinho, checkout, biblioteca, serviços e experiência mobile. A pesquisa deve apoiar decisões, não tentar ser um estudo comercial completo. | Tabela comparativa, aprendizados e decisões aplicadas ao PixelVault. |
| 8. Fluxo principal e wireframes de baixa fidelidade | 1.3 | Integrante 2 | Desenhar o percurso login/cadastro → catálogo → carrinho → checkout → biblioteca e especificar os wireframes das cinco telas. | Fluxo do usuário e cinco wireframes identificados e legíveis. |
| 9. Consistência de UX e rastreabilidade | 1.3 | Integrante 3 | Conferir se cada história prioritária aparece em uma tela e se a navegação, os formulários e as ações de CRUD são fáceis de demonstrar. | Matriz história-tela, ajustes de UX e critérios mínimos de responsividade. |

### Fase 4 - Ambiente React Native e interface inicial

**Período sugerido:** 19/09 a 20/09  
**Resultado da fase:** projeto executável e interfaces iniciais do item 1.4.

| Etapa | Item do roteiro | Responsável | O que o futuro prompt deverá fazer | Saída esperada |
|---|---|---|---|---|
| 10. Configuração do projeto e organização do código | 1.4 | Integrante 4 | Criar o projeto Expo/React Native, registrar comandos de instalação e execução e propor uma estrutura pequena de pastas para telas, componentes, dados e serviços. | Projeto que compila e inicia, README curto e evidência de execução. |
| 11. Componentes visuais e cinco telas iniciais | 1.4 | Integrante 5 | Implementar as cinco telas com identidade visual simples do PixelVault e componentes reutilizáveis somente onde houver repetição real. | Telas navegáveis usando `View`, `Text`, `Image`, `StyleSheet`, Flexbox, `TextInput`, `Pressable` e listas. |
| 12. Interações acadêmicas do protótipo | 1.4 | Integrante 6 | Adicionar estado local para login/cadastro, listagem, CRUD demonstrativo, carrinho e formulário de checkout. Validar telas pequenas e mensagens básicas ao usuário. | Fluxo demonstrável com `useState` e `FlatList`, sem exigir lógica de produção. |

### Fase 5 - Dados, Node e preparação das integrações

**Período sugerido:** 21/09 a 22/09  
**Resultado da fase:** modelagem e base técnica do item 1.5.

| Etapa | Item do roteiro | Responsável | O que o futuro prompt deverá fazer | Saída esperada |
|---|---|---|---|---|
| 13. Modelo de dados e DER | 1.5 | Integrante 1 | Definir entidades mínimas para usuários, jogos/produtos, serviços, agendamentos de serviços, carrinho, pedidos, itens de pedido e biblioteca/chaves. | DER legível, cardinalidades e breve dicionário de dados. |
| 14. Script SQL e banco local | 1.5 | Integrante 2 | Gerar um script SQL simples e coerente com o DER, além de preparar a estrutura local em SQLite com poucos dados fictícios para demonstração. | Script reproduzível, inicialização do banco e massa de teste reduzida. |
| 15. API Node e fronteira do Mercado Pago | 1.5 | Integrante 3 | Criar uma API Node mínima com rota de saúde e endpoints essenciais. Definir a rota/serviço de criação de pagamento e permitir uma resposta simulada enquanto a integração real não estiver concluída. | Backend executável, lista de endpoints, teste básico e pendências declaradas para a Sprint 2. |

### Fase 6 - Monitoramento, revisão e montagem da entrega

**Período sugerido:** 23/09 a 24/09  
**Resultado da fase:** item 1.6 completo e pacote da Sprint 1 pronto para correção.

| Etapa | Item do roteiro | Responsável | O que o futuro prompt deverá fazer | Saída esperada |
|---|---|---|---|---|
| 16. Sprint Review e tratamento do feedback | 1.6 | Integrante 4 | Preparar um roteiro curto de demonstração, registrar participantes, feedback, decisões e alterações feitas no backlog. | Ata objetiva da Sprint Review, evidências da demonstração e backlog revisado. |
| 17. Relatório de status e plano de riscos | 1.6 | Integrante 5 | Preencher o relatório de status com progresso real e produzir registro/matriz de riscos com mitigação e Plano B somente para riscos altos. Distribuir os responsáveis pelos riscos entre Integrantes 1 a 6. | Relatório de status datado até 24/09 e plano de mitigação enxuto. |
| 18. Consolidação, revisão final e passagem para Sprint 2 | Geral | Integrante 6 | Unir os conteúdos, revisar formatação, ortografia, numeração, bibliografia, figuras e matriz requisito-evidência. Confirmar que o texto não declara o projeto encerrado. | PDF da Sprint 1, código organizado e lista explícita de próximos passos da Sprint 2. |

## 5. Distribuição equilibrada da equipe

Cada integrante é responsável por três etapas do roadmap:

| Integrante | Etapas sob responsabilidade |
|---|---|
| Integrante 1 | 1, 7 e 13 |
| Integrante 2 | 2, 8 e 14 |
| Integrante 3 | 3, 9 e 15 |
| Integrante 4 | 4, 10 e 16 |
| Integrante 5 | 5, 11 e 17 |
| Integrante 6 | 6, 12 e 18 |

Essa divisão equilibra documentação, planejamento, UX, desenvolvimento e revisão. O responsável coordena a etapa, mas o resultado deve ser revisado por pelo menos outro integrante.

Nos campos formais dos documentos, os futuros prompts deverão auditar a distribuição de nomes. A capa sempre terá os seis integrantes; responsabilidades de relatório, risco, revisão, aprovação, tela e componente devem ser alternadas para evitar concentração em um único nome.

## 6. Escopo técnico recomendado para a primeira entrega

Para manter qualidade sem excesso de robustez, a primeira entrega pode usar:

- React Native com Expo e JavaScript;
- navegação simples entre cinco telas;
- `useState` para formulários, carrinho e CRUD demonstrativo;
- `FlatList` para catálogo, carrinho e biblioteca;
- `StyleSheet` e Flexbox para responsividade;
- dados fictícios locais para permitir demonstração mesmo sem internet;
- SQLite inicializado com esquema e pequena massa de teste;
- Node/Express com poucos endpoints e rota de saúde;
- serviço de pagamento isolado, com modo simulado e integração real marcada como continuidade quando necessário;
- Git com commits por etapa e um README curto.

Não é necessário nesta fase implementar painel administrativo separado, recomendação por IA, chat, avaliações complexas, estoque em tempo real, antifraude, notificações, analytics, publicação nas lojas ou segurança de produção.

## 7. Critérios de qualidade para os futuros prompts

Cada prompt futuro deverá informar:

1. qual item do roteiro atende;
2. quais arquivos ou informações recebe como entrada;
3. qual artefato deve produzir;
4. quais decisões não pode inventar;
5. como validar o resultado;
6. qual evidência será colocada no relatório;
7. qual integrante é o responsável;
8. quais pendências seguem para a Sprint 2.

Os prompts deverão preservar o conteúdo já aprovado nas etapas anteriores. Mudanças de escopo, nomes, entidades ou prioridades precisarão ser registradas para evitar contradições entre documento, wireframes, backlog e código.

## 8. Checklist de aceite em 24/09/2026

- [ ] Os itens 1.1 a 1.6 aparecem no sumário com a mesma numeração do roteiro.
- [ ] O Documento de Visão e Escopo está adaptado ao PixelVault.
- [ ] Há histórias de usuário, DoD, Scrum, backlog priorizado e Planning Poker.
- [ ] A pesquisa compara concorrentes e gera decisões objetivas.
- [ ] Existem fluxo principal e wireframes das cinco telas.
- [ ] O projeto React Native compila e inicia.
- [ ] As cinco telas iniciais podem ser demonstradas.
- [ ] O DER, o script SQL, a estrutura SQLite e a API Node estão documentados.
- [ ] A Sprint Review possui feedback registrado e backlog ajustado.
- [ ] O relatório de status apresenta progresso real, não números inventados.
- [ ] Os riscos altos possuem mitigação e contingência.
- [ ] Os seis integrantes aparecem na capa e têm responsabilidades equilibradas.
- [ ] A formatação segue as margens, fontes, tamanhos e espaçamento exigidos no roteiro.
- [ ] A conclusão é parcial e aponta a continuidade para a Sprint 2.
- [ ] Toda referência usada aparece na bibliografia.

## 9. Resultado esperado ao final deste roadmap

Em 24/09/2026, o grupo terá a Sprint 1 documentada e demonstrável: escopo definido, planejamento ágil, pesquisa, wireframes, interfaces iniciais, base de dados, estrutura Node, Sprint Review, relatório de status e riscos. O projeto PixelVault permanecerá em andamento, com integrações, refinamentos e funcionalidades pendentes organizados para a Sprint 2.
