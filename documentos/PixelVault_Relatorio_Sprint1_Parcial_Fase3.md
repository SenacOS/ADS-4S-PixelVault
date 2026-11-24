# CENTRO UNIVERSITÁRIO SENAC

## Projeto Integrador IV - Desenvolvimento para Dispositivos Móveis

## PixelVault - Loja de Jogos para Cloud Gaming

**Integrante 1:** `[NOME]` - RA: `[RA-1]`  
**Integrante 2:** `[NOME]` - RA: `[RA-2]`  
**Integrante 3:** `[NOME]` - RA: `[RA-3]`  
**Integrante 4:** `[NOME]` - RA: `[RA-4]`  
**Integrante 5:** `[NOME]` - RA: `[RA-5]`  
**Integrante 6:** `[NOME]` - RA: `[RA-6]`

**São Paulo - 2026**

---

**Documento parcial da Sprint 1**  
**Conteúdo consolidado:** Prompts 1 a 9 - Fases 1, 2 e 3  
**Data do checkpoint:** 14/09/2026  
**Data de corte da Sprint 1:** 24/09/2026  
**Product Owner:** Integrante 2  
**Scrum Master:** Integrante 5  
**Versão:** 0.3 - escopo, planejamento ágil, pesquisa de mercado e wireframes

> Esta versão contém somente o conteúdo produzido até o checkpoint da Fase 3. Os dados do Planning Poker, da capacidade, dos responsáveis, das ferramentas e dos horários foram preenchidos como simulação acadêmica e deverão ser confirmados ou substituídos pelo grupo antes da entrega oficial. A pesquisa, o fluxo, os wireframes e a revisão de UX foram concluídos, mas não há, neste checkpoint, histórias de software declaradas como implementadas. Os recortes da exportação do Figma permanecem pendentes para a versão final do relatório.

# Sumário parcial

- Introdução
- 1. Desenvolvimento do Projeto
  - 1.1 Definição do Escopo e Requisitos
    - 1.1.1 Nome e visão do produto
    - 1.1.2 Problema a ser resolvido
    - 1.1.3 Público-alvo e perfis de usuário
    - 1.1.4 Stakeholders e valor esperado
    - 1.1.5 Escopo do produto
    - 1.1.6 Itens fora do escopo
    - 1.1.7 Objetivo e funcionalidades essenciais do MVP
    - 1.1.8 Histórias de usuário iniciais
    - 1.1.9 Critérios de aceitação
    - 1.1.10 Definição de Pronto (DoD)
  - 1.2 Estruturação do Planejamento Ágil
    - 1.2.1 Processo Scrum adotado
    - 1.2.2 Papéis e distribuição da equipe
    - 1.2.3 Artefatos do projeto
    - 1.2.4 Cerimônias e cadência
    - 1.2.5 Product Backlog priorizado
    - 1.2.6 Critério de priorização
    - 1.2.7 Planning Poker e escala utilizada
    - 1.2.8 Resultado das estimativas
    - 1.2.9 Objetivo e Sprint Backlog da Sprint 1
  - 1.3 Pesquisa de Mercado e Design de Interface (Wireframing)
    - 1.3.1 Método e referências pesquisadas
    - 1.3.2 Comparação de mercado
    - 1.3.3 Decisões de interface
    - 1.3.4 Fluxos do usuário
    - 1.3.5 Wireframes e estados representados
    - 1.3.6 Evidência visual
    - 1.3.7 Rastreabilidade
    - 1.3.8 Revisão, correções e aceite do Product Owner
    - 1.3.9 Critérios mínimos de responsividade
    - 1.3.10 Pendências desta etapa
- 2. Conclusão parcial
- 3. Referências

# Introdução

O PixelVault é a proposta de um aplicativo móvel de e-commerce especializado na venda de jogos digitais e conteúdos adicionais (DLCs) compatíveis com plataformas de cloud gaming. O produto busca reduzir a dificuldade de identificar essa compatibilidade antes da compra, reunindo catálogo, carrinho, checkout e biblioteca em uma única experiência móvel.

O projeto será desenvolvido em React Native com Expo e JavaScript. A Sprint 1, com data de corte em 24/09/2026, abrange concepção, escopo, planejamento ágil, pesquisa e wireframes, interfaces iniciais, modelagem e base técnica, além de Sprint Review, relatório de status e riscos. Neste checkpoint, foram concluídos a auditoria do roteiro, a visão do produto, a análise dos stakeholders, a delimitação do escopo e do Produto Mínimo Viável (MVP), as histórias iniciais, a estruturação do planejamento ágil, a pesquisa exploratória de mercado, o fluxo principal, os wireframes de baixa fidelidade e a revisão de consistência e rastreabilidade de UX.

O recorte acadêmico prioriza uma solução simples de executar, demonstrar e avaliar. GeForce NOW e Boosteroid são usados apenas como exemplos de plataformas; não há pressuposto de parceria ou integração oficial. O PixelVault comercializará jogos e DLCs, mas não executará jogos nem venderá assinaturas de cloud gaming.

# 1. Desenvolvimento do Projeto

## 1.1 Definição do Escopo e Requisitos

Esta seção consolida o **Documento de Visão e Escopo (Product Vision)** e as Histórias de Usuário iniciais solicitadas no item 1.1 do roteiro oficial.

**Responsáveis nesta etapa:** Integrante 1 - auditoria e estrutura; Integrante 2 - visão, stakeholders e Product Owner; Integrante 3 - escopo, MVP e limites; Integrante 4 - histórias de usuário e critérios de aceitação.

### 1.1.1 Nome e visão do produto

#### Nome do projeto

**PixelVault - Loja de Jogos para Cloud Gaming**

#### Breve apresentação

O PixelVault é um aplicativo móvel de e-commerce especializado em jogos digitais para execução por meio de plataformas de cloud gaming. Desenvolvido em React Native, o produto reunirá um catálogo de jogos, jogos independentes e conteúdos adicionais (DLCs), com indicação das plataformas compatíveis, como GeForce NOW e Boosteroid. A jornada prevista inclui cadastro e login, consulta ao catálogo e à compatibilidade de cada título, carrinho, checkout com Mercado Pago e uma biblioteca para acesso aos jogos adquiridos e às chaves de ativação.

#### Declaração de visão do produto

Oferecer aos usuários de cloud gaming uma experiência móvel simples, segura e integrada para descobrir e adquirir jogos digitais e DLCs compatíveis com as plataformas que utilizam, realizar o pagamento e acessar suas compras e chaves de ativação em um único aplicativo.

#### Proposta de valor

O principal valor do PixelVault é organizar o catálogo de acordo com a compatibilidade dos jogos com plataformas de cloud gaming. Antes da compra, o jogador poderá identificar em quais plataformas o título está disponível; depois da compra, poderá consultar o jogo e sua chave de ativação na biblioteca. Para o usuário, isso reduz dúvidas e torna a escolha mais objetiva. Para o pequeno negócio, cria um posicionamento especializado e um canal móvel direcionado a um público gamer bem definido.

### 1.1.2 Problema a ser resolvido

Jogadores que utilizam cloud gaming precisam verificar se um título está disponível na plataforma escolhida antes de comprá-lo. Quando as informações de compatibilidade, a compra e o acesso à chave de ativação estão separados, o usuário precisa pesquisar em diferentes canais e pode adquirir um jogo inadequado para a forma como pretende executá-lo. Ao mesmo tempo, lojas digitais generalistas nem sempre organizam a navegação a partir da plataforma de cloud gaming utilizada pelo cliente.

O PixelVault busca resolver esse problema ao reunir, em um único aplicativo, um catálogo direcionado a cloud gaming, a indicação das plataformas compatíveis, o processo de compra e a biblioteca do usuário.

### 1.1.3 Público-alvo e perfis de usuário

| Grupo | Definição | Necessidade principal |
|---|---|---|
| Público principal | Jogadores que já utilizam plataformas de cloud gaming, como GeForce NOW, Boosteroid ou alternativas semelhantes. | Encontrar e comprar jogos compatíveis com a plataforma que utilizam, com informação clara antes da compra. |
| Público secundário | Jogadores interessados em começar a utilizar cloud gaming para jogar em diferentes dispositivos sem depender exclusivamente do desempenho do equipamento local. | Conhecer títulos disponíveis para cloud gaming e escolher uma opção compatível com sua forma de jogar. |

Para a concepção inicial, serão considerados três perfis centrais:

- **Usuário de cloud gaming:** já utiliza uma ou mais plataformas e procura títulos compatíveis para comprar.
- **Novo usuário de cloud gaming:** deseja conhecer opções de jogos que possam ser executados remotamente em seus dispositivos.
- **Administrador/curador do catálogo:** mantém jogos, DLCs e informações de compatibilidade e acompanha os pedidos realizados.

### 1.1.4 Stakeholders e valor esperado

| Stakeholder | Interesse | Poder ou influência | Valor ou expectativa principal |
|---|---:|---:|---|
| Usuários de cloud gaming e avaliadores | Alto | Médio | Identificação clara de jogos compatíveis, compra simples e acesso às aquisições digitais. |
| Integrante 2 - Product Owner | Alto | Alto | Manter a visão do produto, representar o valor esperado, organizar prioridades e esclarecer os itens do Product Backlog. |
| Administradores e curadores do catálogo | Alto | Médio | Fluxos claros para manter jogos, DLCs, plataformas compatíveis e pedidos. |
| Plataformas de cloud gaming | Baixo | Alto sobre a compatibilidade do catálogo | Disponibilidade dos títulos e condições de execução que sirvam como referência para as informações exibidas pela loja. |
| Equipe do projeto - seis integrantes | Alto | Alto | Direção compartilhada para planejar, desenvolver, testar e documentar a solução. |
| Professor/orientador | Alto | Alto | Aderência ao roteiro, evidências verificáveis e aplicação adequada dos conteúdos da disciplina. |
| Mercado Pago, como provedor externo | Baixo | Alto no fluxo de pagamento | Compatibilidade técnica e uso correto da integração prevista para o checkout. |

Os stakeholders de alto interesse devem acompanhar as validações do produto. O Integrante 2, como Product Owner, manterá a visão e organizará as prioridades com base no valor esperado. Essa função não atribui autoridade técnica sobre os demais integrantes: decisões de implementação, estimativas e divisão do trabalho continuarão sendo construídas de forma colaborativa.

### 1.1.5 Escopo do produto

O PixelVault compreenderá os seguintes módulos e capacidades:

1. **Acesso do usuário:** cadastro e login de jogadores, com validações básicas dos campos.
2. **Catálogo especializado:** consulta de jogos digitais e DLCs, com nome, imagem, preço, descrição e plataformas de cloud gaming compatíveis.
3. **Consulta por compatibilidade:** identificação e filtro simples dos títulos de acordo com a plataforma de cloud gaming escolhida.
4. **Manutenção do catálogo:** inclusão, consulta, alteração e exclusão de jogos e DLCs por um perfil administrador ou curador.
5. **Carrinho de compras:** inclusão e remoção de itens, prevenção de duplicidade indevida e visualização do valor total.
6. **Checkout:** formulário de pagamento e preparação da integração com o Mercado Pago, usando ambiente ou dados de teste.
7. **Biblioteca do usuário:** exibição dos jogos e DLCs adquiridos, acompanhados de chaves de ativação fictícias para demonstração.
8. **Fluxo móvel integrado:** navegação entre acesso, catálogo, carrinho, checkout e biblioteca, com layout legível em telas pequenas.
9. **Base técnica acadêmica:** estrutura inicial de uma API Node e banco de dados local, como SQLite, coerentes com o fluxo do aplicativo e com a modelagem a ser detalhada no item 1.5.

#### Perfis contemplados

| Perfil | Capacidades previstas |
|---|---|
| Jogador | Cadastrar-se, entrar no aplicativo, consultar compatibilidade, selecionar itens, percorrer o checkout e acessar sua biblioteca. |
| Administrador/curador | Incluir, consultar, alterar e excluir jogos e DLCs e manter suas informações de compatibilidade. |

O controle desses perfis será simples e voltado à demonstração. Um sistema completo de autorização por papéis não é necessário para a Sprint 1.

#### Recorte mínimo da Sprint 1

Até 24/09/2026, o incremento deverá conter e evidenciar:

- Documento de Visão e Escopo, histórias iniciais, planejamento ágil e Product Backlog;
- pesquisa exploratória, fluxo do usuário e wireframes das áreas críticas;
- projeto React Native que compile e inicie corretamente;
- interfaces iniciais das cinco áreas funcionais e navegação demonstrável entre elas;
- interações básicas com dados fictícios e estado local, suficientes para demonstrar o fluxo;
- indicação visível da compatibilidade dos jogos com plataformas de cloud gaming;
- fluxo visual de inclusão, consulta, alteração e exclusão de jogos ou DLCs;
- tela de checkout preparada para o Mercado Pago, sem apresentar pagamento real como concluído;
- DER, script SQL, banco local e estrutura inicial da API Node, conforme o item 1.5 do roteiro;
- Sprint Review, feedback, atualização do backlog, relatório de status e registro de riscos.

### 1.1.6 Itens fora do escopo

#### Fora do escopo do PixelVault

Os itens abaixo não fazem parte do produto e não devem aparecer como funcionalidades, entidades ou fluxos planejados:

- otimização de computadores;
- montagem de setup gamer;
- agendamento de atendimentos;
- catálogo ou contratação de serviços;
- entidade `Serviço` ou entidade `Agendamento`;
- execução ou transmissão de jogos pelo próprio PixelVault;
- venda de assinaturas do GeForce NOW, Boosteroid ou de outras plataformas;
- integração oficial ou parceria comercial com plataformas de cloud gaming;
- venda e entrega física de equipamentos;
- marketplace com múltiplos vendedores.

#### Fora do incremento da Sprint 1, mas previsto para continuidade

Por limite de prazo e maturidade técnica, os itens abaixo não serão considerados concluídos em 24/09/2026:

- autenticação segura de produção, recuperação de senha e gerenciamento avançado de sessão;
- persistência completa de todos os fluxos do aplicativo na API Node e no banco;
- integração real ou homologada de ponta a ponta com o Mercado Pago;
- processamento financeiro real, estorno, reembolso ou conciliação de pagamentos;
- liberação automática de uma chave de ativação após a aprovação do pagamento;
- sincronização automática da compatibilidade com APIs externas;
- painel administrativo avançado, relatórios gerenciais ou métricas comerciais;
- notificações, avaliações, lista de desejos, recomendações e recursos sociais;
- publicação nas lojas de aplicativos, infraestrutura de produção, escalabilidade e testes de carga;
- suíte abrangente de testes automatizados e requisitos avançados de segurança.

Esses limites não impedem a criação de telas, contratos, dados fictícios ou respostas simuladas necessários para demonstrar o fluxo e orientar a implementação posterior.

### 1.1.7 Objetivo e funcionalidades essenciais do MVP

#### Objetivo do MVP

Validar se um usuário de cloud gaming consegue identificar jogos compatíveis com a plataforma que utiliza, selecionar um título, percorrer uma compra de demonstração e localizar a aquisição e sua chave fictícia na biblioteca, enquanto um administrador consegue manter o catálogo básico.

O MVP será considerado validado no contexto acadêmico quando o fluxo principal puder ser demonstrado de ponta a ponta com dados fictícios e sem erros bloqueantes. A Sprint 1 produzirá o primeiro incremento desse MVP; a conclusão das integrações e da persistência poderá ocorrer na Sprint 2.

#### Funcionalidades essenciais e prioridades

| Funcionalidade | Descrição essencial | Prioridade | Meta da Sprint 1 |
|---|---|---:|---|
| Cadastro e login | Permitir a entrada do jogador no fluxo do aplicativo com validações básicas. | Alta | Interface funcional com estado local e mensagens básicas. |
| Catálogo de jogos e DLCs | Listar títulos com imagem, preço, descrição resumida e tipo do item. | Alta | Lista com dados fictícios, implementada de forma legível. |
| Compatibilidade com cloud gaming | Exibir e filtrar os títulos pela plataforma compatível. | Alta | Compatibilidade visível e filtro simples demonstrável. |
| CRUD do catálogo | Incluir, consultar, alterar e excluir jogos ou DLCs. | Alta | Fluxo visual completo e pelo menos uma operação local demonstrável. |
| Carrinho | Adicionar e remover itens e apresentar o total da compra. | Alta | Comportamento básico controlado por estado local. |
| Checkout com Mercado Pago | Coletar os dados necessários e encaminhar a intenção de pagamento. | Alta | Formulário e resultado simulado, identificados como demonstração. |
| Biblioteca e chaves | Exibir aquisições do usuário e suas chaves de ativação. | Alta | Lista fictícia navegável, sem geração real de chaves. |
| Navegação e adaptação móvel | Conectar as áreas do fluxo e manter o conteúdo utilizável em tela pequena. | Alta | Navegação demonstrável e revisão visual básica. |

#### Fluxo essencial do MVP

1. O jogador realiza cadastro ou login.
2. Escolhe uma plataforma de cloud gaming ou consulta a compatibilidade exibida no catálogo.
3. Abre um jogo ou DLC e adiciona o item ao carrinho.
4. Confere os itens e o valor total.
5. Preenche o checkout e recebe um resultado de pagamento claramente identificado como simulado na Sprint 1.
6. Acessa a biblioteca de demonstração e consulta o título e a chave fictícia.
7. Em fluxo separado, o administrador demonstra a manutenção de um item do catálogo.

### 1.1.8 Histórias de usuário iniciais

As histórias foram escritas segundo o formato “Como..., quero..., para...” e separadas em ações pequenas e verificáveis. O conjunto inicial possui 15 histórias funcionais e duas histórias técnicas.

| ID | História | Prioridade | Planejamento atual |
|---|---|---|---|
| HU-01 | Como novo usuário de cloud gaming, quero criar uma conta com meus dados básicos para acessar o PixelVault. | Crítica | Sprint 1 |
| HU-02 | Como jogador cadastrado, quero entrar no aplicativo para consultar jogos compatíveis e acessar o fluxo de compra. | Crítica | Sprint 1 |
| HU-03 | Como usuário de cloud gaming, quero consultar jogos e DLCs e abrir seus detalhes para avaliar uma opção antes da compra. | Crítica | Sprint 1 |
| HU-04 | Como usuário de cloud gaming, quero filtrar o catálogo pela plataforma que utilizo para encontrar somente títulos compatíveis. | Crítica | Sprint 1 |
| HU-05 | Como administrador ou curador, quero cadastrar um jogo ou DLC para disponibilizá-lo no catálogo do PixelVault. | Alta | Sprint 1 |
| HU-06 | Como administrador ou curador, quero alterar os dados de um jogo ou DLC para manter o catálogo correto. | Alta | Sprint 1 |
| HU-07 | Como administrador ou curador, quero excluir um jogo ou DLC para retirar do catálogo um item que não deve mais ser oferecido. | Alta | Sprint 1 |
| HU-08 | Como jogador, quero adicionar um jogo ou DLC ao carrinho para preparar minha compra. | Crítica | Sprint 1 |
| HU-09 | Como jogador, quero conferir e remover itens do carrinho para controlar o conteúdo e o valor da minha compra. | Crítica | Sprint 1 |
| HU-10 | Como jogador, quero preencher o checkout e receber um resultado simulado para demonstrar a conclusão do fluxo de compra sem realizar cobrança real. | Crítica | Sprint 1 |
| HU-11 | Como jogador, quero consultar meus jogos adquiridos e suas chaves de ativação para localizar minhas compras digitais em um só lugar. | Crítica | Sprint 1 |
| HT-01 | Como equipe de desenvolvimento, queremos disponibilizar uma base React Native com Expo e navegação entre as áreas obrigatórias para implementar e demonstrar o incremento em um ambiente comum. | Crítica | Sprint 1 |
| HT-02 | Como equipe de desenvolvimento, queremos definir a estrutura inicial do banco local e da API Node para manter a modelagem coerente com os dados usados pelo aplicativo e preparar integrações posteriores. | Alta | Sprint 1 |
| HU-12 | Como jogador cadastrado, quero que meu acesso seja reconhecido entre utilizações autorizadas para não repetir o login sem necessidade. | Média | Candidata à Sprint 2 |
| HU-13 | Como administrador ou curador, quero que inclusões, alterações e exclusões do catálogo sejam persistidas para manter os dados depois de reiniciar o aplicativo. | Média | Candidata à Sprint 2 |
| HU-14 | Como jogador, quero encaminhar meu pedido ao Mercado Pago em ambiente de teste para validar o fluxo de pagamento sem movimentar dinheiro real. | Média | Candidata à Sprint 2 |
| HU-15 | Como jogador, quero que uma compra aprovada seja registrada na minha biblioteca para acessar o item adquirido e sua chave fictícia. | Média | Candidata à Sprint 2 |

As histórias `HU-01` a `HU-11`, `HT-01` e `HT-02` cobrem o recorte demonstrativo e técnico selecionado para a Sprint 1. As histórias `HU-12` a `HU-15` tratam persistência e integrações e permanecem sujeitas a refinamento e repriorização após a Sprint Review.

### 1.1.9 Critérios de aceitação

Os critérios abaixo resumem as condições observáveis definidas para cada história. Eles devem ser verificados em conjunto com a Definition of Done.

- **HU-01 - Cadastrar jogador:** permitir nome, e-mail e senha; validar campos obrigatórios; confirmar o cadastro de demonstração com dados válidos; não exigir dados pessoais reais.
- **HU-02 - Entrar no aplicativo:** permitir e-mail e senha; impedir avanço com campos vazios; abrir o catálogo com credenciais fictícias válidas; informar acesso inválido nos demais casos.
- **HU-03 - Consultar catálogo e detalhes:** listar jogos e DLCs fictícios com nome, imagem, preço e tipo; exibir descrição e plataformas compatíveis; distinguir jogo de DLC; apresentar estado vazio quando necessário.
- **HU-04 - Filtrar por plataforma compatível:** oferecer pelo menos duas plataformas fictícias; mostrar somente itens compatíveis com a opção selecionada; manter o filtro visível; restaurar a listagem completa ao limpar o filtro.
- **HU-05 - Cadastrar item do catálogo:** solicitar nome, tipo, preço, descrição e plataforma; validar campos e preço; confirmar a inclusão; atualizar a listagem local sem reiniciar o aplicativo.
- **HU-06 - Alterar item do catálogo:** abrir dados atuais para edição; reaplicar as validações do cadastro; confirmar a alteração; atualizar a listagem local imediatamente.
- **HU-07 - Excluir item do catálogo:** permitir solicitar exclusão; identificar o item e pedir confirmação; manter o item se houver cancelamento; remover e confirmar quando a ação for aceita.
- **HU-08 - Adicionar item ao carrinho:** disponibilizar ação de inclusão; confirmar a ação e atualizar o indicador do carrinho; preservar nome e preço; impedir cópias indevidas do mesmo produto digital.
- **HU-09 - Conferir e remover itens do carrinho:** listar itens e preços; calcular corretamente o total; atualizar lista e total após remoção; impedir checkout quando o carrinho estiver vazio.
- **HU-10 - Concluir checkout demonstrativo:** repetir itens e total do carrinho; validar os campos obrigatórios; exibir resultado de demonstração com dados fictícios válidos; identificar que não existe cobrança real; permitir seguir para a biblioteca.
- **HU-11 - Consultar biblioteca e chave fictícia:** listar aquisições do usuário fictício; apresentar nome, tipo e chave quando aplicável; identificar as chaves como fictícias; apresentar estado vazio quando necessário.
- **HT-01 - Disponibilizar base móvel executável:** instalar dependências, compilar e iniciar sem erro bloqueante; navegar entre as cinco áreas; registrar instruções de execução; manter legibilidade em tela pequena.
- **HT-02 - Disponibilizar base de dados e API:** produzir DER sem entidades fora do escopo; criar script SQL executável; disponibilizar estrutura inicial da API Node; manter coerência entre DER, SQL e API; não declarar integração completa sem evidência.
- **HU-12 - Manter acesso entre utilizações:** autenticar pela API; manter sessão válida ao reabrir o aplicativo; voltar a exigir login após encerramento; impedir acesso indevido em caso de falha.
- **HU-13 - Persistir a manutenção do catálogo:** executar o CRUD pela API e pelo banco; preservar dados após reinício; persistir compatibilidades; informar falhas sem apresentar operação malsucedida como concluída.
- **HU-14 - Realizar pagamento em ambiente de teste:** enviar o total correto; utilizar apenas credenciais e dados de teste; apresentar o estado retornado; tratar falhas sem gerar cobrança real.
- **HU-15 - Receber compra aprovada na biblioteca:** liberar itens somente após aprovação de teste; manter a aquisição vinculada ao usuário; apresentar chave fictícia; impedir duplicidade de item ou chave.

### 1.1.10 Definição de Pronto (DoD)

Uma história de software somente será considerada pronta quando todos os critérios aplicáveis abaixo forem atendidos:

- a implementação corresponde à história e aos seus critérios de aceitação aprovados;
- o fluxo pode ser iniciado e concluído sem erro bloqueante;
- a interface informa ao usuário o resultado da ação e trata campos obrigatórios quando houver formulário;
- a funcionalidade pode ser demonstrada no ambiente definido pelo projeto, preferencialmente Expo Go ou emulador;
- o conteúdo permanece legível e utilizável em uma tela de celular de dimensões reduzidas;
- os testes funcionais manuais previstos foram executados e o resultado foi registrado;
- dados simulados, pagamentos de teste e chaves fictícias estão identificados, sem uso de credenciais ou dados pessoais reais;
- o código foi versionado no repositório da equipe e integrado à versão corrente sem quebrar funcionalidades já aceitas;
- nomes, telas, dados e documentação permanecem coerentes com o domínio de jogos e DLCs para cloud gaming;
- instruções de execução ou documentação foram atualizadas quando a história alterou o uso ou a configuração do projeto;
- pelo menos um integrante diferente do autor revisou a entrega;
- o Product Owner confirmou o atendimento da história, e eventuais observações do professor ou da Sprint Review foram registradas no backlog.

Para histórias exclusivamente documentais ou de design, os critérios técnicos não aplicáveis deverão ser marcados como **não aplicáveis**, nunca ignorados sem justificativa. Wireframe ou interface estática não comprovam a conclusão de uma história que exija comportamento funcional.

## 1.2 Estruturação do Planejamento Ágil

**Responsáveis nesta etapa:** Integrante 5 - Processo Scrum do grupo e atuação como Scrum Master; Integrante 6 - Product Backlog, Planning Poker e roadmap da Sprint; Integrante 2 - validação como Product Owner; participação dos seis integrantes na estimativa e no planejamento simulados.

> Os registros de votos, capacidade, aceite, responsáveis, ferramentas e horários desta seção são uma simulação acadêmica solicitada pelo grupo. Eles deverão ser confirmados ou substituídos antes de serem apresentados como fatos da execução da Sprint.

### 1.2.1 Processo Scrum adotado

O PixelVault será conduzido por um Scrum Team de seis integrantes. O trabalho seguirá ciclos curtos de planejamento, execução, inspeção e adaptação, usando as histórias, seus critérios de aceitação e a Definition of Done como referência comum.

O processo adotado estabelece que:

1. o Product Owner ordena o Product Backlog por valor, obrigatoriedade acadêmica e dependências;
2. os seis integrantes participam da estimativa colaborativa por Planning Poker;
3. o trabalho da Sprint é selecionado segundo a capacidade disponível;
4. as histórias são divididas em tarefas pequenas e acompanhadas em quadro comum;
5. impedimentos e mudanças de escopo são registrados assim que identificados;
6. somente itens que atendam aos critérios de aceitação e à Definition of Done compõem o incremento;
7. a Sprint Review demonstra somente o que estiver concluído e gera adaptações no Product Backlog;
8. a retrospectiva registra ao menos uma melhoria objetiva para a Sprint seguinte.

### 1.2.2 Papéis e distribuição da equipe

| Integrante | Papel principal | Responsabilidades centrais |
|---|---|---|
| Integrante 1 | Equipe de Desenvolvimento | Estimar, executar, testar, revisar e documentar itens assumidos. |
| Integrante 2 | Product Owner | Manter a visão, ordenar o Product Backlog, esclarecer requisitos e validar resultados. |
| Integrante 3 | Equipe de Desenvolvimento | Estimar, executar, testar, revisar e documentar itens assumidos. |
| Integrante 4 | Equipe de Desenvolvimento | Estimar, executar, testar, revisar e documentar itens assumidos. |
| Integrante 5 | Scrum Master | Facilitar o processo, acompanhar impedimentos e proteger a Meta da Sprint. |
| Integrante 6 | Equipe de Desenvolvimento | Estimar, executar, testar, revisar e documentar itens assumidos. |

Product Owner e Scrum Master também poderão colaborar em tarefas acadêmicas. Essa colaboração não altera suas responsabilidades nem dispensa revisão por outro integrante. O Product Owner decide a prioridade de valor; a equipe avalia coletivamente quanto trabalho cabe na Sprint; o Scrum Master facilita o processo sem atuar como chefe.

### 1.2.3 Artefatos do projeto

| Artefato | Aplicação no PixelVault | Responsabilidade | Situação no checkpoint |
|---|---|---|---|
| Product Backlog | Lista ordenada das 15 histórias funcionais e 2 técnicas, com prioridade, dependências e estimativas. | Product Owner com contribuição do grupo. | Criado e priorizado. |
| Sprint Backlog | Meta, histórias selecionadas e pacotes de trabalho necessários para o incremento. | Equipe de Desenvolvimento com esclarecimentos do Product Owner. | Seleção simulada criada; itens ainda em “A fazer”. |
| Incremento | Soma das histórias realmente concluídas e integradas em condição de demonstração. | Todo o Scrum Team. | Ainda não produzido neste checkpoint. |

O Objetivo do Produto é validar uma experiência móvel de descoberta e compra demonstrativa de jogos e DLCs compatíveis com cloud gaming. A Definition of Done registrada no item 1.1.10 será aplicada em conjunto com os critérios específicos de cada história.

### 1.2.4 Cerimônias e cadência

| Evento ou acompanhamento | Participantes | Cadência ou duração | Registro esperado |
|---|---|---|---|
| Sprint Planning e Planning Poker | Seis integrantes | Simulação em 14/09/2026, das 22h às 23h | Meta, estimativas, capacidade e Sprint Backlog inicial. |
| Acompanhamento da Sprint | Scrum Team | Atualização assíncrona em dias úteis; reuniões de até 15 minutos às quartas-feiras, 22h40, e sábados, 10h | Quadro atualizado, próximo passo e impedimentos. |
| Refinamento do Backlog | Product Owner, Scrum Master e executores dos itens | Até 30 minutos, sob demanda | Histórias esclarecidas, divididas ou reestimadas. |
| Sprint Review | Scrum Team e stakeholders convidados | Prevista para 24/09/2026; até 45 minutos | Itens demonstrados, feedback real e adaptação do backlog. |
| Sprint Retrospective | Seis integrantes | Após a Sprint Review; até 30 minutos | Aprendizados e uma ação de melhoria para a Sprint 2. |

No cenário simulado, o grupo utilizará Trello para o quadro, WhatsApp para comunicação assíncrona e Google Meet para reuniões. As colunas do quadro serão **Product Backlog**, **A Fazer**, **Em Andamento**, **Em Revisão/Teste** e **Concluído**. Cada cartão deverá identificar história, tarefa, responsável, revisor, prazo, dependência ou impedimento e evidência.

### 1.2.5 Product Backlog priorizado

| Ordem | ID | Item | Prioridade | Dependências principais | Planejamento | Pontos |
|---:|---|---|---|---|---|---:|
| 1 | HT-01 | Disponibilizar base móvel executável | Crítica | Nenhuma | Sprint 1 | 3 |
| 2 | HU-01 | Cadastrar jogador | Crítica | HT-01 | Sprint 1 | 1 |
| 3 | HU-02 | Entrar no aplicativo | Crítica | HT-01; HU-01 para cadastro prévio | Sprint 1 | 1 |
| 4 | HU-03 | Consultar catálogo e detalhes | Crítica | HT-01 | Sprint 1 | 2 |
| 5 | HU-04 | Filtrar por plataforma compatível | Crítica | HU-03 | Sprint 1 | 2 |
| 6 | HU-08 | Adicionar item ao carrinho | Crítica | HU-03 | Sprint 1 | 1 |
| 7 | HU-09 | Conferir e remover itens do carrinho | Crítica | HU-08 | Sprint 1 | 2 |
| 8 | HU-10 | Concluir checkout demonstrativo | Crítica | HU-09 | Sprint 1 | 3 |
| 9 | HU-11 | Consultar biblioteca e chave fictícia | Crítica | HU-10 para o percurso demonstrativo | Sprint 1 | 2 |
| 10 | HU-05 | Cadastrar item do catálogo | Alta | HT-01; estrutura local do catálogo | Sprint 1 | 2 |
| 11 | HU-06 | Alterar item do catálogo | Alta | HU-03; HU-05 | Sprint 1 | 2 |
| 12 | HU-07 | Excluir item do catálogo | Alta | HU-03; HU-05 | Sprint 1 | 1 |
| 13 | HT-02 | Disponibilizar base de dados e API | Alta | Modelo de dados aprovado | Sprint 1 | 5 |
| 14 | HU-12 | Manter acesso entre utilizações | Média | HU-01; HU-02; HT-02 | Candidata à Sprint 2 | 5 |
| 15 | HU-13 | Persistir a manutenção do catálogo | Média | HU-03 a HU-07; HT-02 | Candidata à Sprint 2 | 8 |
| 16 | HU-14 | Realizar pagamento em ambiente de teste | Média | HU-09; HU-10; HT-02 | Candidata à Sprint 2 | 8 |
| 17 | HU-15 | Receber compra aprovada na biblioteca | Média | HU-11; HU-14; HT-02 | Candidata à Sprint 2 | 5 |

### 1.2.6 Critério de priorização

Os itens foram ordenados pelos seguintes critérios, nesta sequência:

1. **Obrigatoriedade acadêmica:** cobertura dos itens do roteiro, das cinco áreas funcionais e da base técnica.
2. **Valor para o MVP:** contribuição para demonstrar descoberta, compatibilidade e compra de jogos para cloud gaming.
3. **Dependências:** prioridade para bases e etapas que desbloqueiam outros itens.
4. **Continuidade do fluxo:** acesso, catálogo, carrinho, checkout e biblioteca.
5. **Risco e esforço:** itens grandes ou incertos devem ser discutidos, divididos e reestimados.

As prioridades Crítica, Alta e Média indicam valor e necessidade. A posição ordinal orienta a seleção, mas não modifica os critérios de aceitação.

### 1.2.7 Planning Poker e escala utilizada

A escala Fibonacci adotada foi `0, 1, 2, 3, 5, 8, 13, 21, 34, 100 e ?`. Os pontos representam esforço relativo, considerando complexidade, volume, risco e incerteza; não correspondem diretamente a horas.

Na dinâmica definida, o Product Owner lê cada item, o grupo esclarece dúvidas, os seis integrantes escolhem e revelam seus votos simultaneamente, os extremos justificam suas escolhas e o grupo realiza novas rodadas até alcançar consenso. Itens ainda incertos ou grandes devem ser refinados ou divididos antes de assumir compromisso.

### 1.2.8 Resultado das estimativas

O quadro abaixo registra o preenchimento simulado do Planning Poker. A coluna final apresenta o consenso usado na priorização.

| ID | Int. 1 | Int. 2 | Int. 3 | Int. 4 | Int. 5 | Int. 6 | Consenso |
|---|---:|---:|---:|---:|---:|---:|---:|
| HT-01 | 3 | 3 | 5 | 3 | 3 | 5 | 3 |
| HU-01 | 1 | 2 | 1 | 1 | 2 | 1 | 1 |
| HU-02 | 1 | 1 | 1 | 2 | 1 | 1 | 1 |
| HU-03 | 2 | 3 | 2 | 2 | 3 | 2 | 2 |
| HU-04 | 2 | 2 | 3 | 2 | 2 | 3 | 2 |
| HU-08 | 1 | 1 | 2 | 1 | 1 | 1 | 1 |
| HU-09 | 2 | 2 | 3 | 2 | 2 | 2 | 2 |
| HU-10 | 3 | 5 | 3 | 3 | 5 | 3 | 3 |
| HU-11 | 2 | 2 | 3 | 2 | 2 | 2 | 2 |
| HU-05 | 2 | 3 | 2 | 2 | 3 | 2 | 2 |
| HU-06 | 2 | 3 | 2 | 2 | 3 | 2 | 2 |
| HU-07 | 1 | 2 | 1 | 1 | 2 | 1 | 1 |
| HT-02 | 5 | 8 | 5 | 8 | 5 | 8 | 5 |
| HU-12 | 3 | 5 | 5 | 5 | 8 | 5 | 5 |
| HU-13 | 8 | 13 | 8 | 8 | 13 | 8 | 8 |
| HU-14 | 8 | 13 | 8 | 13 | 8 | 8 | 8 |
| HU-15 | 5 | 8 | 5 | 5 | 8 | 5 | 5 |

As principais divergências envolveram configuração e navegação inicial, extensão das validações, filtro múltiplo, base de dados e API, persistência do CRUD e integração externa de pagamento. Como respostas, o grupo limitou a Sprint 1 ao nível acadêmico demonstrativo, adotou filtro de uma plataforma por vez, manteve pagamento simulado e dividiu `HT-02` em tarefas de modelagem/banco e API. `HU-13` deverá ser dividida por operação antes da Sprint 2.

#### Capacidade simulada

| Integrante | Papel principal | Horas disponíveis | Eventos e revisão | Capacidade líquida | Restrição principal |
|---|---|---:|---:|---:|---|
| Integrante 1 | Equipe de Desenvolvimento | 7 h | 1,5 h | 5,5 h | Trabalho diurno e aulas à noite |
| Integrante 2 | Product Owner | 6 h | 2 h | 4 h | Trabalho diurno, aulas e validações do PO |
| Integrante 3 | Equipe de Desenvolvimento | 7 h | 1,5 h | 5,5 h | Trabalho diurno e aulas à noite |
| Integrante 4 | Equipe de Desenvolvimento | 7 h | 1,5 h | 5,5 h | Trabalho diurno e aulas à noite |
| Integrante 5 | Scrum Master | 6 h | 2 h | 4 h | Trabalho diurno, aulas e facilitação do Scrum |
| Integrante 6 | Equipe de Desenvolvimento | 7 h | 1,5 h | 5,5 h | Trabalho diurno e aulas à noite |
| **Equipe** | - | **40 h** | **10 h** | **30 h** | Disponibilidade após aulas e no fim de semana |

A seleção considera limite de 27 story points e uma reserva coletiva de 3 horas para correções, integração e documentação. Pontos e horas foram analisados em conjunto, sem fórmula de conversão. As 13 histórias selecionadas totalizam 27 pontos; as quatro candidatas à Sprint 2 totalizam 26 pontos e deverão ser reestimadas antes do próximo compromisso.

### 1.2.9 Objetivo e Sprint Backlog da Sprint 1

#### Meta da Sprint 1

> Até 24/09/2026, disponibilizar um incremento demonstrável do PixelVault que cubra acesso, consulta e filtro de jogos e DLCs por compatibilidade com cloud gaming, carrinho, checkout simulado, biblioteca com chaves fictícias e manutenção local do catálogo, acompanhado da base React Native, da modelagem, do SQL, do SQLite e da estrutura inicial da API Node exigidos pelo roteiro.

A Meta foi aprovada na Sprint Planning simulada de 14/09/2026, condicionada à manutenção do escopo demonstrativo, ao uso de dados fictícios e à ausência de cobrança real.

#### Sprint Backlog inicial

| Pacote | Histórias | Resultado esperado | Responsável(is) | Revisor | Estado no checkpoint |
|---:|---|---|---|---|---|
| 1 | HT-01 | Projeto Expo executável, navegação básica e instruções de execução | Integrantes 4 e 6 | Integrante 5 | A fazer |
| 2 | HU-01 e HU-02 | Cadastro e login de demonstração com validações básicas | Integrante 4 | Integrante 2 | A fazer |
| 3 | HU-03 e HU-04 | Catálogo, detalhes e filtro por plataforma compatível | Integrante 5 | Integrante 3 | A fazer |
| 4 | HU-08 e HU-09 | Inclusão, conferência e remoção de itens no carrinho | Integrante 6 | Integrante 4 | A fazer |
| 5 | HU-10 e HU-11 | Checkout simulado e biblioteca com chaves fictícias | Integrantes 5 e 6 | Integrante 2 | A fazer |
| 6 | HU-05, HU-06 e HU-07 | Inclusão, alteração e exclusão local de jogos ou DLCs | Integrante 3 | Integrante 1 | A fazer |
| 7 | HT-02 | DER, SQL, SQLite e estrutura inicial executável e documentada da API Node | Integrantes 1 e 2 | Integrante 3 | A fazer |
| 8 | Todos os itens | Integração, testes manuais, revisão, evidências e validação do Product Owner | Todos | Integrante 2 para aceite final | A fazer |

Cada pacote será decomposto em tarefas de interface ou estrutura, implementação, dados fictícios, estados aplicáveis, teste manual, revisão, evidência e validação. Uma história somente poderá passar para **Concluído** quando cumprir seus critérios e a Definition of Done.

#### Roadmap de execução até 24/09/2026

| Período | Fase ou atividade | Foco | Critério de saída |
|---|---|---|---|
| 13/09 | Fase 2 - Prompts 4 a 6 e início do Prompt 7 | Histórias, Scrum, Product Backlog, estimativa e pesquisa exploratória | Documentos da Fase 2 e pesquisa de mercado concluídos |
| 14/09 | Sprint Planning, Planning Poker e conclusão da Fase 3 | Votos, capacidade, fluxo, wireframes, revisão de UX e aceite do Product Owner | Sprint Backlog simulado e especificação de UX aprovados |
| 15/09 a 16/09 | Preparação documental e início da Fase 4 | Recortes pendentes do Figma e configuração do projeto | Evidências organizadas e projeto Expo validado |
| 17/09 a 18/09 | Fase 4 - Prompts 10 a 12 | Projeto React Native, áreas visuais e interações locais | Aplicativo inicia, navega e demonstra o fluxo planejado |
| 21/09 a 22/09 | Fase 5 - Prompts 13 a 15 | DER, SQL, SQLite, API Node e fronteira do Mercado Pago | Base técnica coerente e executável quando aplicável |
| 23/09 | Integração e preparação da Review | Testes, correções, revisão e evidências | Itens prontos separados de pendências |
| 24/09 | Fase 6 - Prompts 16 a 18 | Sprint Review, feedback, status, riscos e consolidação | Entrega parcial consolidada com evidências reais |

## 1.3 Pesquisa de Mercado e Design de Interface (Wireframing)

Esta seção atende ao item 1.3 do roteiro oficial. O trabalho foi executado em três etapas: pesquisa exploratória de concorrentes, definição do fluxo e dos wireframes de baixa fidelidade e revisão de consistência e rastreabilidade. A revisão foi aceita pelo Product Owner em 14/09/2026 e está aprovada para orientar a implementação da Sprint 1.

**Responsáveis nesta etapa:** Integrante 1 - pesquisa exploratória; Integrante 2 / Product Owner - fluxo e wireframes; Integrante 3 - revisão de consistência, rastreabilidade e responsividade.

### 1.3.1 Método e referências pesquisadas

A pesquisa utilizou observação de páginas públicas e documentação oficial, sem criação de contas, testes com usuários ou realização de compras. Foram escolhidas três referências complementares:

| Referência | Papel na comparação | Contribuição ao PixelVault |
|---|---|---|
| Steam | Loja e biblioteca de jogos digitais | Hierarquia do catálogo, página de detalhes, carrinho, DLCs e biblioteca. |
| Green Man Gaming | Loja de jogos e chaves digitais | Separação entre produto, plataforma de ativação, região e consulta posterior da chave. |
| GeForce NOW | Serviço de cloud gaming, não utilizado como loja de jogos | Forma de apresentar compatibilidade cloud e relação com a loja digital correspondente. |

Os critérios observados foram: descoberta no catálogo, conteúdo dos cartões e detalhes, plataforma de ativação, compatibilidade com cloud gaming, carrinho, checkout, biblioteca, entrega de chaves e adequação a telas pequenas. A pesquisa é exploratória e registra apenas o que foi encontrado nas páginas consultadas em 13/09/2026; catálogos, preços e compatibilidades podem mudar.

### 1.3.2 Comparação de mercado

| Critério | Steam | Green Man Gaming | GeForce NOW | Aplicação no PixelVault |
|---|---|---|---|---|
| Descoberta | Busca, ordenação, categorias e cartões ricos | Ofertas, categorias, busca e plataforma | Catálogo de jogos executáveis no serviço | Catálogo enxuto com cartões e um filtro cloud por vez. |
| Detalhes | Descrição, mídia, preço, recursos e DLCs | DRM/ativação, região, edição, preço e requisitos | Compatibilidade e versão ligada à loja do usuário | Separar `Compatível com` de `Ativação em`. |
| Carrinho e checkout | Presentes | Presentes | Não se aplicam à compra do jogo | Carrinho simples e checkout explicitamente simulado. |
| Biblioteca ou histórico | Jogos vinculados à conta | Compras e chaves vinculadas à conta | Coleções de lojas conectadas | Aquisições demonstrativas com chave fictícia. |
| Limite de adaptação | Evitar excesso de filtros, promoções e comunidade | Não confundir DRM com cloud | Não copiar assinatura ou execução de jogos | Manter o MVP acadêmico, móvel e sem integrações externas reais. |

Os padrões considerados úteis foram: cartões para decisão rápida, detalhes concentrando informações antes da compra, estados visíveis, continuidade entre compra e biblioteca e separação conceitual entre loja digital e serviço cloud. Ficaram fora do MVP recomendações personalizadas, avaliações, comunidade, lista de desejos, assinatura de cloud, execução de jogos, vinculação real de contas e pagamento real.

### 1.3.3 Decisões de interface

| ID | Decisão aprovada |
|---|---|
| `UX-01` | Cartões exibem imagem, nome, tipo (`Jogo` ou `DLC`), preço e compatibilidade cloud. |
| `UX-02` | O catálogo usa seleção única entre `Todos`, `GeForce NOW` e `Boosteroid`. |
| `UX-03` | Os detalhes separam `Compatível com` de `Ativação em`, sempre com texto. |
| `UX-04` | A tela de detalhes informa que a disponibilidade no serviço cloud pode mudar. |
| `UX-05` | O carrinho mostra itens, remoção e total atualizado e bloqueia o checkout vazio. |
| `UX-06` | O checkout repete o resumo e informa antes da confirmação que nenhuma cobrança será realizada. |
| `UX-07` | A biblioteca apresenta item, tipo, loja de ativação e chave explicitamente fictícia. |
| `UX-08` | Inclusão e edição reutilizam o mesmo formulário; exclusão exige confirmação nominal. |
| `UX-09` | Compatibilidade, seleção, erro e resultado não dependem somente de cor. |
| `UX-10` | Produto, loja de ativação, plataforma cloud e compatibilidade permanecem conceitos distintos. |

### 1.3.4 Fluxos do usuário

**Fluxo revisado do jogador:**

1. Login ou cadastro demonstrativo.
2. Catálogo com filtro de compatibilidade.
3. Detalhes do jogo ou DLC, distinguindo cloud e loja de ativação.
4. Inclusão única no carrinho e conferência do total.
5. Checkout simulado com validação dos campos.
6. Resultado demonstrativo sem cobrança.
7. Biblioteca com todos os itens da compra e chaves fictícias aplicáveis.

O cadastro válido retorna ao login com confirmação. O login de jogador abre o catálogo; uma credencial fictícia de administrador ou curador abre a manutenção do catálogo; dados inválidos mantêm o usuário no login com mensagem de erro.

**Fluxo administrativo:** consultar a lista → incluir ou editar por formulário compartilhado → validar e salvar → retornar à lista com confirmação. A exclusão exige confirmação com o nome do item, permite cancelar e atualiza apenas a lista local.

### 1.3.5 Wireframes e estados representados

Os wireframes foram produzidos no Figma em referência móvel de `390 × 844 px` e organizados em quatro seções: fluxo principal; acesso e descoberta; compra e pós-compra; administração e estados.

| ID | Tela | Conteúdo e ação principal | Histórias |
|---|---|---|---|
| `WF-01` | Login | Credenciais fictícias; entrada de jogador ou administrador; acesso ao cadastro. | `HU-02`; apoio a `HU-01`, `HU-05` a `HU-07` |
| `WF-02` | Cadastro | Nome, e-mail, senha, validação e retorno confirmado ao login. | `HU-01` |
| `WF-03` | Catálogo | Filtros cloud, cartões, contador do carrinho e acesso a detalhes. | `HU-03`, `HU-04` |
| `WF-04` | Detalhes | Descrição, preço, compatibilidade, ativação e ação de adicionar. | `HU-03`, `HU-04`, `HU-08` |
| `WF-05` | Carrinho | Itens, preços, remoção, total e acesso ao checkout. | `HU-08`, `HU-09` |
| `WF-06` | Checkout simulado | Mesmo resumo do carrinho, campos obrigatórios e aviso de não cobrança. | `HU-10` |
| `WF-07` | Resultado | Status de teste, total, pedido fictício e acesso à biblioteca. | `HU-10` |
| `WF-08` | Biblioteca | Todos os itens adquiridos, ativação e chaves fictícias aplicáveis. | `HU-11` |
| `WF-09` | Manutenção do catálogo | Consulta e ações de incluir, editar e excluir localmente. | `HU-05`, `HU-06`, `HU-07` |
| `WF-10` | Formulário do catálogo | Modos distintos de inclusão e edição com validação. | `HU-05`, `HU-06` |
| `WF-11` | Confirmação de exclusão | Nome do item, cancelar e confirmar exclusão. | `HU-07` |

Também foram definidos cinco estados alternativos: `ST-01` login com erro, `ST-02` catálogo sem resultado para o filtro, `ST-03` carrinho vazio, `ST-04` biblioteca vazia e `ST-05` checkout com erro. Cada estado explica a situação e oferece recuperação adequada.

### 1.3.6 Evidência visual

O arquivo de trabalho está disponível no [Figma - PixelVault: Fluxo e Wireframes de Baixa Fidelidade](https://www.figma.com/design/QPBzR7eMxHLNh7XSqWCbN8). A exportação integral de `962 × 2048 px` reúne os dois fluxos, os onze wireframes e os cinco estados alternativos.

![Fluxo principal e conjunto completo de wireframes de baixa fidelidade do PixelVault](<SENAC - PI4 - React e gerenciamento de projetos/PixelVault - Fluxo e Wireframes de Baixa Fidelidade.png>)

**Figura 1 — Fluxo principal e conjunto completo de wireframes de baixa fidelidade do PixelVault.** Fonte: elaboração do grupo no Figma, 2026.

A imagem integral foi considerada adequada como visão geral digital e pode ser ampliada. Quando reduzida para uma página A4, os textos internos ficam pequenos; por isso, os recortes de fluxo, acesso/descoberta, compra/biblioteca e administração/estados deverão ser preparados para o relatório final.

### 1.3.7 Rastreabilidade

| Área | Histórias da Sprint 1 | Telas e estados relacionados | Ação demonstrável |
|---|---|---|---|
| Acesso | `HU-01`, `HU-02` | `WF-01`, `WF-02`, `ST-01` | Cadastrar e entrar com resultado válido ou erro. |
| Catálogo e compatibilidade | `HU-03`, `HU-04` | `WF-03`, `WF-04`, `ST-02` | Listar, filtrar, limpar filtro e consultar detalhes. |
| CRUD de jogos e DLCs | `HU-05` a `HU-07` | `WF-09` a `WF-11` | Incluir, consultar, editar, cancelar e excluir localmente. |
| Carrinho | `HU-08`, `HU-09` | `WF-04`, `WF-05`, `ST-03` | Adicionar sem duplicidade, remover e atualizar total. |
| Checkout | `HU-10` | `WF-06`, `WF-07`, `ST-05` | Validar e concluir uma simulação sem cobrança. |
| Biblioteca | `HU-11` | `WF-08`, `ST-04` | Consultar todos os itens e chaves fictícias. |
| Base móvel | `HT-01` | Fluxo completo e critérios `RESP-01` a `RESP-16` | Depende de compilação, navegação e testes posteriores. |
| Base de dados e API | `HT-02` | Separação visual dos conceitos do domínio | Depende de DER, SQL, SQLite e API posteriores. |

A revisão confirmou cobertura visual das 11 histórias funcionais e representação transversal das duas histórias técnicas da Sprint 1. Essa cobertura de design não conclui funcionalmente nenhuma história; o aceite técnico continua dependente das próximas fases e da Definition of Done.

### 1.3.8 Revisão, correções e aceite do Product Owner

| ID | Lacuna identificada | Correção incorporada à especificação |
|---|---|---|
| `COR-01` | A biblioteca mostrava somente um dos dois itens usados no checkout. | `WF-08` deverá receber todos os itens da compra demonstrada. |
| `COR-02` | O fluxo administrativo não possuía origem de navegação. | O login distingue perfis fictícios de jogador e administrador/curador. |
| `COR-03` | O destino após cadastro válido não estava fixado. | Mostrar confirmação e retornar ao login. |
| `COR-04` | A prevenção de duplicidade no carrinho não era observável. | Atualizar contador e mostrar `Já está no carrinho` sem alterar total. |
| `COR-05` | Inclusão, edição e retornos do CRUD não estavam suficientemente distintos. | Diferenciar títulos e ações e mostrar confirmação após salvar ou excluir. |
| `COR-06` | A figura geral perde legibilidade quando reduzida para A4. | Manter a figura geral e preparar recortes legíveis por seção. |

**Resultado da revisão:** aprovado com ajustes obrigatórios incorporados. O Product Owner, Integrante 2, registrou o aceite em 14/09/2026 para que a implementação da Sprint 1 seja iniciada. Em caso de divergência, `PixelVault_Consistencia_UX_Rastreabilidade.md`, versão 1.0, prevalece sobre `PixelVault_Fluxo_Principal_Wireframes_Baixa_Fidelidade.md`, versão 0.2.

### 1.3.9 Critérios mínimos de responsividade

| Grupo | Critérios definidos |
|---|---|
| Dimensões | Referência em `390 × 844 px`; testes posteriores em `360 px` e `320 × 568 px`; orientação retrato. |
| Layout | Sem rolagem horizontal; cartões em uma coluna a `320 px`; grupos quebram linha ou passam para coluna; respeito às áreas seguras. |
| Conteúdo | Rolagem vertical quando necessária; navegação inferior não cobre o conteúdo; textos variáveis aceitam quebra de linha. |
| Texto e toque | Texto secundário a partir de `14`, corpo e botões com referência `16`; área de toque mínima de `44 × 44 dp`, preferencialmente `48 × 48 dp`. |
| Formulários | Rótulos visíveis, teclado apropriado, conteúdo final alcançável com o teclado aberto e erros ligados aos campos. |
| Acessibilidade básica | Estados combinam texto e tratamento visual; verificação posterior com fonte ampliada a pelo menos `130%`. |

Os casos `UXT-01` a `UXT-14` foram definidos para verificar cadastro, login dos dois perfis, filtro, carrinho, checkout, biblioteca, CRUD e comportamento em telas pequenas. Os resultados não são declarados neste checkpoint porque dependem do aplicativo implementado.

### 1.3.10 Pendências desta etapa

- [x] Pesquisa de mercado, decisões de UX, fluxos e wireframes concluídos.
- [x] Revisão de rastreabilidade e aceite do Product Owner registrados.
- [x] Regra de prevalência documental registrada.
- [ ] Preparar os recortes da exportação do Figma definidos em `COR-06`.
- [ ] Confirmar a continuidade dos dados durante a implementação.
- [ ] Executar e registrar `UXT-01` a `UXT-14` após a implementação.
- [ ] Aceitar funcionalmente `HT-01` e `HT-02` somente após as evidências técnicas.

# 2. Conclusão parcial

As Fases 1, 2 e 3 estabeleceram a base documental, o planejamento inicial e a especificação de experiência do PixelVault. O produto foi delimitado como uma loja móvel de jogos digitais e DLCs direcionada a usuários de cloud gaming, com destaque para a compatibilidade dos títulos. Foram definidos problema, proposta de valor, públicos, stakeholders, escopo, objetivo do MVP, funcionalidades essenciais, limites, histórias de usuário, critérios de aceitação e Definition of Done.

O Processo Scrum foi adaptado à rotina de seis integrantes que trabalham durante o dia e estudam à noite. Também foram criados o Product Backlog com 17 itens, o registro simulado do Planning Poker, a capacidade líquida simulada de 30 horas, a Meta da Sprint e o Sprint Backlog inicial com 13 itens e 27 story points. Quatro histórias, somando 26 pontos, permaneceram como candidatas à Sprint 2.

A pesquisa de mercado comparou Steam, Green Man Gaming e GeForce NOW e originou dez decisões de interface. A partir delas, foram definidos o fluxo do jogador, o fluxo administrativo, onze wireframes e cinco estados alternativos. A revisão confirmou a rastreabilidade das histórias selecionadas, incorporou seis correções e definiu critérios mínimos de responsividade. O Product Owner aceitou a especificação revisada em 14/09/2026, que passa a prevalecer sobre o wireframe versão 0.2 em caso de divergência.

Este documento ainda não representa a conclusão da Sprint 1. As histórias selecionadas permanecem em estado inicial “A fazer”, e nenhuma implementação, teste funcional ou incremento foi declarado como concluído neste checkpoint. Os dados simulados deverão ser confirmados pelo grupo. Os recortes do Figma continuam pendentes, sem bloquear o código. Os itens 1.4 a 1.6 serão incluídos somente após a produção de suas evidências reais, até o marco de 24/09/2026; a evolução posterior permanecerá registrada no Product Backlog da Sprint 2.

# 3. Referências

- SENAC. *Primeira entrega - Roteiro PI IV - Desenvolvimento para dispositivos móveis*. 2026.
- SENAC. *Tema do trabalho - PixelVault*. 2026.
- SENAC. *Template - Documento de Visão e Escopo*. 2026.
- SENAC. *Exemplo documento de visão*. 2026.
- SENAC. *Aula 01 - Documento de Visão e Escopo, Histórias de Usuário, Scrum e Planning Poker*. 2026.
- SENAC. *Aulas 02 a 05 - React Native, Expo, componentes, estados, Flexbox e inputs*. 2026.
- PIXELVAULT. *Histórias de Usuário e Critérios de Aceitação*. Versão 0.1, 2026.
- PIXELVAULT. *Processo Scrum do Grupo*. Versão 0.1, 2026.
- PIXELVAULT. *Product Backlog, Planning Poker e Roadmap da Sprint*. Versão 0.2, 2026.
- PIXELVAULT. *Pesquisa Exploratória de Mercado*. Versão 0.1, 2026.
- PIXELVAULT. *Fluxo Principal e Wireframes de Baixa Fidelidade*. Versão 0.2, 2026.
- PIXELVAULT. *Consistência de UX e Rastreabilidade*. Versão 1.0, 2026.
- STEAM. *Busca e página pública de produto*. Acesso em 13 set. 2026.
- GREEN MAN GAMING. *Página pública de produto e Game Key FAQ*. Acesso em 13 set. 2026.
- NVIDIA. *GeForce NOW Games e documentação de compatibilidade entre jogo e loja*. Acesso em 13 set. 2026.
