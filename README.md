# PixelVault

> Loja de jogos digitais e DLCs para usuários de cloud gaming, com catálogo organizado por compatibilidade de plataforma (ex: GeForce NOW, Boosteroid), carrinho, checkout e biblioteca de itens adquiridos.

## Contexto Acadêmico

- **Instituição:** Senac
- **Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas
- **Semestre:** 4º Semestre
- **Disciplina(s):** Projeto Integrador IV — Desenvolvimento para Dispositivos Móveis

O desenvolvimento segue o ciclo de Sprints definido pelo roteiro da disciplina:

- **Sprint 1** (corte em 24/09/2026): concepção, escopo, planejamento ágil, pesquisa/wireframes, interfaces iniciais, modelagem de dados e estrutura base da API.
- **Sprint 2**: continuidade das integrações, persistência e refinamentos.

## Integrantes da Equipe

| Nome | GitHub | Papel/Foco |
|---|---|---|
| [Nome do Colega] | [@usercolega](https://github.com/usercolega) | Product Owner |
| [Nome do Colega] | [@usercolega](https://github.com/usercolega) | Scrum Master |
| [Nome do Colega] | [@usercolega](https://github.com/usercolega) | Equipe de Desenvolvimento |
| [Nome do Colega] | [@usercolega](https://github.com/usercolega) | Equipe de Desenvolvimento |
| [Nome do Colega] | [@usercolega](https://github.com/usercolega) | Equipe de Desenvolvimento |
| [Nome do Colega] | [@usercolega](https://github.com/usercolega) | Equipe de Desenvolvimento |

## Tecnologias Utilizadas

- **App:** React Native com Expo, JavaScript
- **Navegação:** React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`)
- **Persistência local:** `expo-sqlite`
- **Ícones:** `@expo/vector-icons`
- **Backend:** API Node/Express com SQLite — pendente, previsto para a Sprint 2
- **Pagamento:** integração com Mercado Pago — tela e contrato de integração preparados nesta Sprint; integração real prevista para a Sprint 2
- **Ferramentas:** GitHub Projects

## Arquitetura e Documentação

Este repositório segue a estrutura:

```
pixelvault/
├── App.js
├── index.js
├── app.json
├── assets/
├── src/
│   ├── screens/
│   │   ├── auth/          # login e cadastro
│   │   ├── catalog/       # catálogo e detalhes do jogo/DLC
│   │   ├── cart/          # carrinho de compras
│   │   ├── checkout/      # checkout e pagamento
│   │   └── library/       # biblioteca de itens adquiridos
│   ├── components/        # componentes reutilizáveis
│   ├── navigation/        # configuração de rotas (Stack Navigator)
│   ├── context/           # estado global simples, quando necessário
│   ├── data/               # dados fictícios usados para demonstração
│   ├── database/           # schema e setup do SQLite local
│   ├── styles/             # estilos e tokens compartilhados
│   └── utils/               # funções auxiliares
├── backend/                 # API Node — pendente (Sprint 2)
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── db/
└── docs/                     # documentação técnica do projeto
```

Na pasta `/docs` você encontrará a documentação técnica, incluindo:
- Estrutura Analítica do Projeto (EAP/WBS) e Product Backlog
- Modelagem do Banco de Dados (DER)
- Wireframes e fluxo de navegação

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- App [Expo Go](https://expo.dev/go) no celular, ou emulador Android/iOS configurado

### Passo a Passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/SenacOS/ADS-4S-PixelVault.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npx expo start
   ```
4. Escaneie o QR code exibido no terminal com o Expo Go, ou pressione `a` / `i` para abrir em um emulador.

## Contribuição

As convenções de commits, branches e Rulesets deste repositório seguem o [`GUIA_DE_CONTRIBUICAO.md`](https://github.com/SenacOS/core/blob/main/GUIA_DE_CONTRIBUICAO.md), em especial a seção [`4. Padrões de Desenvolvimento e Git Flow (Commits, Branches e Rulesets)`](https://github.com/SenacOS/core/blob/main/GUIA_DE_CONTRIBUICAO.md#4-padr%C3%B5es-de-desenvolvimento-e-git-flow-commits-branches-e-rulesets). Consulte o guia completo antes de abrir um Pull Request.

## Capturas de Tela

<!-- Prints das telas do app, conforme forem implementadas -->

## Licença

Este projeto está sob a licença MIT — veja o arquivo [`LICENSE`](./LICENSE) para mais detalhes.

---

*Projeto acadêmico desenvolvido como parte da formação em tecnologia no Senac Brasil, hospedado na organização [SenacOS](https://github.com/SenacOS).*
