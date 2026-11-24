# PixelVault — 2.7 Roteiro do pitch em vídeo

**Versão de preparação:** 21/11/2026. **Status:** roteiro pronto; ensaio, gravação e arquivo de vídeo pendentes. **Duração planejada:** 9 min, com 1 min de margem até o limite de 10 min. Todos os seis integrantes devem falar e aparecer com o rosto visível durante sua participação.

## Participantes preservados da capa original

| Integrante | RA | Papel na base |
| --- | --- | --- |
| Caio Henrique Oliveira |1143138824|Equipe de Desenvolvimento |
| Marcos Paulo Santos Boe |1143019958|Product Owner |
| Débora dos Santos da Silva |1143139012|Equipe de Desenvolvimento |
| Gabriel Silva Gomes |1143109276|Equipe de Desenvolvimento |
| Gabriel Rodrigues Fausto |1143142061|Scrum Master |
| Kayk Matheus de Siqueira Lima |1143138821|Equipe de Desenvolvimento |

A distribuição abaixo é proposta para a gravação; não é relato de apresentação já realizada nem atribuição retroativa de autoria.

## Sequência de 9 min

| Tempo | Participante | Tela/código e ação ao vivo | Mensagem principal |
| --- | --- | --- | --- |
|0:00–0:55|Marcos Paulo Santos Boe|Rosto+abertura e catálogo|Problema, público e valor: organizar descoberta, compatibilidade ilustrativa, compra de teste e biblioteca. Informar uso acadêmico e dados fictícios. |
|0:55–2:10|Gabriel Silva Gomes|Login de demonstração online; catálogo 32 itens, filtro, último item e detalhes|Mostrar jornada, capas locais e diferença entre loja de ativação e plataforma cloud. Abrir o componente/dado relevante no código sem secrets. |
|2:10–3:30|Débora dos Santos da Silva|Perfil admin; criar/editar/consultar/excluir item descartável; sincronizar|Mostrar CRUD, validação e confirmação de persistência na API; abrir rota/validador e consulta SQL parametrizada. Não excluir produto com histórico. |
|3:30–5:00|Caio Henrique Oliveira|Jogador; carrinho, total e botão de checkout; navegador de teste|Mostrar pedido no servidor e abertura do Checkout Pro; usar somente credenciais/cartões de teste. Retornar e consultar o estado. Abrir o gateway/reconciliação, sem exibir `.env` ou `.env.mercadopago`. |
|5:00–6:25|Kayk Matheus de Siqueira Lima|Consultar biblioteca; exportar JSON; executar `npm test` e mostrar resumo|Explicar liberação após aprovação validada e prevenção de duplicidade. Mostrar dados permitidos no JSON e resultados atuais dos testes. |
|6:25–8:10|Gabriel Rodrigues Fausto|Stories, matriz de testes e status; trecho de persistência/outbox|Mostrar tratamento de falha e retomada; explicar 16/17 itens,48/53 SP e HU-12 pendente. Relacionar riscos e lições às evidências. |
|8:10–9:00|Marcos Paulo Santos Boe|Rosto+fechamento; tela final e identificação do grupo|Sintetizar valor entregue e limites do recorte. Citar documentação e projeto que acompanharão a entrega. Não afirmar produto comercial pronto. |

## Preparação da demonstração

1. Abrir ambiente conhecido com API e app funcionando. Guardar dados de execução fora do pacote; não executar reset do banco de trabalho.
2. Conferir câmera, áudio, escala do texto e captura; usar Picture-in-Picture ou alternar rosto/tela sem deixar integrante sem aparecer.
3. Preparar contas e sessão sem mostrar senhas/token em tela. Fechar arquivos de ambiente, terminal com secrets, links OAuth e notificações pessoais.
4. Selecionar produto de teste e ID de pedido adequados. Cobrir sucesso somente se o backend confirmar aprovação; pendência no checkout deve ser anunciada como pendência.
5. Para contingência de indisponibilidade externa, explicar o erro observado e exibir a evidência sanitizada já existente da compra aprovada, identificando-a como registro anterior. Não apresentar evidência gravada como operação ao vivo.
6. Executar código/telas/testes durante a gravação conforme o roteiro. Se for preciso editar o vídeo, preservar continuidade e identificação dos resultados; não substituir resultado falho por afirmação de sucesso.
7. Gravar ensaio, conferir duração e encurtar transições antes da gravação final. A meta de 9 min é orçamento de fala, não duração já medida.

## Checklist de gravação e entrega

- [ ] Seis nomes/RAs conferidos e todos com rosto e fala.
- [ ] Duração final medida em no máximo 10 min.
- [ ] Código, telas e testes demonstrados de forma legível.
- [ ] Nenhuma credencial, dado de cartão real ou informação pessoal desnecessária visível.
- [ ] Fluxo de teste e limitações anunciados corretamente.
- [ ] Arquivo reproduzido do início ao fim, com áudio compreensível.
- [ ] Vídeo incluído/referenciado no pacote final conforme possibilidade do Blackboard.

**Fonte:** roteiro da segunda entrega, item 2.7; participantes/RAs do relatório da Sprint 1; capacidades e evidências das stories 3.1–3.6.
