# Workflow: Card do Trello → Implementação

## Fluxo Obrigatório

Sempre que o usuário pedir para implementar um card do Trello, siga este fluxo:

1. **Buscar o card** no board do Trello (board: "Kiro Spec Driven", ID: `6a46731096111dc5fee99116`)
2. **Verificar a coluna** — o card DEVE estar na coluna "Refinamento" para iniciar
3. **Refinar** — ler título, descrição e checklists do card. Propor refinamento com:
   - História no formato: "Como [persona], eu quero [ação], para que [benefício]"
   - Critérios de aceite claros e testáveis
   - Considerações técnicas
4. **Atualizar o card** no Trello com o refinamento
5. **Validar com o usuário** — apresentar o refinamento e aguardar confirmação
6. **Mover o card** para "Em execucao"
7. **Implementar** seguindo os critérios de aceite aprovados
8. **Versionar** — criar feature branch, commitar (Conventional Commits), abrir PR
9. **Mover o card** para "Code Review"

## Regras

- Nunca commitar diretamente em main/master/develop
- Branch format: `feature/<descricao-curta>`
- Commit format: `tipo(escopo): descrição`
- PR com título < 70 chars e link para o card do Trello na descrição
- Os critérios de aceite do card são a fonte de verdade — não inventar requisitos extras
- Se o card não tiver informação suficiente, perguntar ao usuário antes de assumir
