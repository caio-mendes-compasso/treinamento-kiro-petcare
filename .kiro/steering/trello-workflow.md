# Fluxo de Trabalho com Trello

## Contexto

Este projeto usa o Trello como ferramenta de gestão de tarefas. O board "Pet Care Portal" contém listas organizadas por sprint. Cada card representa uma história de usuário com critérios de aceite claros.

## Fluxo Padrão: Card → Implementação → PR

Sempre que receber uma solicitação para implementar um card do Trello, siga este fluxo:

### 1. Identificar o Card
- Buscar o card pelo nome ou ID no Trello (usar MCP Trello via power trello-to-pr)
- Ler título, descrição e critérios de aceite
- Identificar dependências com outros cards

### 2. Refinar (se necessário)
- Se o card não tiver critérios de aceite claros, usar o agent `@card-refiner` para refinar
- Validar que todos os requisitos técnicos estão explícitos
- Confirmar com o usuário antes de prosseguir

### 3. Implementar
- Criar/usar branch seguindo o padrão: `feat/nome-curto-do-card`
- Implementar seguindo os critérios de aceite do card
- Respeitar os steerings de stack e identidade visual do projeto
- Usar os skills disponíveis (java-spring-boot, react-nextjs-patterns)

### 4. Validar
- Rodar build/testes conforme a stack (frontend: `npm run test`, backend: `mvn test`)
- Verificar cada critério de aceite do card como checklist
- Corrigir problemas antes de prosseguir

### 5. Commit + PR
- Fazer commits com conventional commits: `feat(escopo): descrição curta`
- Abrir PR no GitHub via MCP com:
  - Título do card como título do PR
  - Critérios de aceite como checklist no body
  - Link para o card do Trello

## Regras

- **Nunca** implementar sem antes ler os critérios de aceite do card
- **Nunca** fazer commit direto na main/develop
- **Sempre** rodar validação antes de abrir PR
- **Sempre** usar conventional commits
- Se um card depende de outro que não foi implementado, avisar o usuário
- Se houver dúvida sobre escopo, perguntar antes de implementar

## Board do Trello

- **Nome:** PetCare
- **ID:** `6a7330ad716977a54e820595`
- **URL:** https://trello.com/b/jL159iqA/petcare

## Listas do Board

| Lista | Uso |
|-------|-----|
| Refinamento | Cards novos e épicos aguardando quebra/refinamento |
| A fazer | Cards refinados prontos para implementação |
| Em andamento | Card sendo implementado agora |
| Concluído | Cards entregues |

## Fluxo de Cards no Board

```
Refinamento → A fazer → Em andamento → Concluído
```

- Épico fica em "Refinamento" até ser quebrado em histórias
- Histórias refinadas vão para "A fazer"
- Ao iniciar implementação, mover para "Em andamento"
- Após PR aprovada/merged, mover para "Concluído"

## Labels

| Cor | Significado |
|-----|-------------|
| 🟠 Laranja | Arquitetura |
| 🔴 Vermelho | Backend |
| 🔵 Azul | Setup |
| 🟣 Roxo | Infra |
| 🟢 Verde | Frontend |
| 🟡 Amarelo | Teste |
