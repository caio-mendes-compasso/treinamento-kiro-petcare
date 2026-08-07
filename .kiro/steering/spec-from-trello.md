---
inclusion: manual
---

# Gerar Spec a partir do Trello

## Comportamento

Quando o usuário pedir para criar uma spec baseada nos cards do Trello:

1. **Listar todos os cards** da lista/sprint indicada
2. **Ler cada card** — título, descrição, checklists, labels
3. **Consolidar** em uma spec estruturada com:
   - Visão geral do que será construído
   - Requisitos funcionais (extraídos das histórias)
   - Requisitos técnicos (extraídos dos critérios de aceite)
   - Regras de negócio (extraídas das descrições)
   - Endpoints/Interfaces (se backend)
   - Fluxos de navegação (se frontend)
4. **Não inventar** requisitos que não estão nos cards
5. **Sinalizar gaps** — se algum card está incompleto, avisar o usuário

## Formato da Spec

Seguir o formato de spec do Kiro:
- requirements.md — requisitos funcionais e não-funcionais
- design.md — decisões técnicas e arquiteturais
- tasks.md — tarefas de implementação derivadas dos cards
