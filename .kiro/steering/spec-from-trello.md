---
inclusion: manual
---

# Gerar Spec a partir de Cards do Trello

## Objetivo

Quando invocado com `#spec-from-trello`, consolide os cards de uma lista do Trello em uma spec estruturada pronta para implementação no Kiro.

## Instruções

### 1. Buscar Cards
- Usar o MCP Trello (via power trello-to-pr) para listar os cards da lista indicada pelo usuário
- Ordenar por prioridade/sequência lógica de implementação
- Ignorar cards já marcados como "Done"

### 2. Estrutura da Spec

Gerar a spec no formato Kiro (`.kiro/specs/{nome-da-feature}/`) com:

#### requirements.md
- Cada card vira um requisito numerado
- Título do card → título do requisito
- Descrição do card → descrição do requisito
- Critérios de aceite do card → critérios de aceite do requisito

#### design.md
- Analisar os cards em conjunto e propor:
  - Arquitetura de alto nível (componentes, camadas)
  - Entidades e relacionamentos
  - Endpoints/interfaces
  - Tecnologias e padrões a usar (conforme steerings do projeto)

#### tasks.md
- Quebrar em tasks implementáveis:
  - Cada task deve ser atômica (completável em 1 sessão)
  - Incluir critério de "done" claro
  - Ordenar por dependência (tasks que bloqueiam outras vêm primeiro)
  - Agrupar por camada: setup → model → service → controller → security → test

### 3. Regras

- Respeitar os steerings existentes (project-stack, visual-identity, backend-stack)
- Manter rastreabilidade: cada requisito deve referenciar o card de origem
- Não inventar requisitos que não estejam nos cards
- Se detectar gaps nos cards (ex: falta endpoint que o frontend precisa), listar como "Requisitos Implícitos" e confirmar com o usuário
- Priorizar completude sobre perfeição — a spec pode ser refinada depois

### 4. Output

Salvar em:
```
.kiro/specs/{nome-da-spec}/
├── requirements.md
├── design.md
└── tasks.md
```

Onde `{nome-da-spec}` é derivado do nome da lista/sprint (ex: `backend-spring35`, `arquitetura-aws`).

## Exemplo de Uso

```
#spec-from-trello Gere uma spec a partir dos cards da lista "Sprint 2 - Arquitetura + Backend".
```

Resultado esperado: spec completa em `.kiro/specs/backend-spring35/` com requirements, design e tasks prontos para execução sequencial.
