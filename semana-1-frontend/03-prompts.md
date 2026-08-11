# Prompts — Semana 1: Frontend

> Prompts curtos para o Kiro. Os detalhes e critérios de aceite vêm dos cards do Trello.
>
> ## Recursos do Kiro usados nesta semana
>
> | Tipo | Nome | Quando usar |
> |------|------|-------------|
> | **Steering** (always) | `trello-workflow` | Ativo automaticamente — guia o fluxo card → refinar → implementar → PR |
> | **Steering** (manual) | `#spec-from-trello` | Para gerar uma spec consolidada dos cards |
> | **Agent** | `@card-refiner` | Refinar um card do Trello antes de implementar |
> | **Agent** | `@sprint-reviewer` | Relatório de progresso da sprint |
> | **Agent** | `@tech-troubleshooter` | Diagnosticar e corrigir erros |
> | **Skill** | `react-nextjs-patterns` | Padrões e boas práticas Next.js/React |
> | **Skill** | `vitest` | Guia para escrever testes com Vitest |
> | **Skill** | `code-review-quality` | Revisar qualidade do código antes do PR |
> | **Skill** | `git-hygiene-enforcer` | Garantir commits e branches padronizados |

---

## Setup Inicial (único, antes dos cards)

```
Crie o monorepo petcare-portal com Next.js 14+ (TypeScript, Tailwind, App Router) em /frontend.
Estrutura: /frontend, /backend, /infra, /docs.
Pastas do frontend: /app, /components, /contexts, /types, /mocks.
Fonte Inter, ESLint, .gitignore para monorepo.
```

---

## Refinar um Card

```
@card-refiner Refine o card "[NOME_DO_CARD]" da lista "Sprint 1 - Frontend".
```

```
@card-refiner Refine o próximo card pendente na lista "Sprint 1 - Frontend".
```

---

## Implementar um Card

```
Implemente o card "[NOME_DO_CARD]" da lista "Sprint 1 - Frontend" do Trello.
```

```
Implemente o próximo card pendente da lista "Sprint 1 - Frontend".
```

```
Implemente o card ID [CARD_ID] do Trello.
```

---

## Gerar Spec da Sprint

```
#spec-from-trello Gere uma spec a partir dos cards da lista "Sprint 1 - Frontend".
```

---

## Verificar Progresso

```
@sprint-reviewer Analise o progresso da lista "Sprint 1 - Frontend".
```

---

## Testes

```
Implemente o card de Testes da lista "Sprint 1 - Frontend".
```

---

## Code Review antes do PR

```
Faça uma revisão de qualidade no código do frontend antes de abrir o PR.
```

---

## PR Final

```
Implemente o card de Pull Request da lista "Sprint 1 - Frontend".
```

---

## Troubleshooting

```
@tech-troubleshooter Erro: [colar erro aqui]
```

```
@tech-troubleshooter A página [nome] não está responsiva no mobile.
```

## Prompts para criação dos steerings e agents


### Criação dos steering de tech e estrutura
```
Crie um steering file para definir a stack e estrutura do projeto:

Stack do projeto:
Next.js 14+ com App Router e TypeScript
Estrutura: /app, /components, /contexts, /types, /mocks
Tailwind
Fonte Inter
ESLint
Responsivo (mobile-first)
Validação de formulários com Zod
```

### Criação dos steering de entidade visual
```
Crie um steering file para entidade visual do meu projeto:

Tailwind CSS
Tema: azul petróleo (#0D7377) como primário, branco como fundo
```

```
Crie a estrutura inicial do projeto
```

### Criação do agent de refinamento
```
Tenho o prompt abaixo para a criação de um custom-agent para refinamento de historias.
Melhore esse prompt.

Prompt:
Agente especializado em refinamento técnico e quebra de histórias escrita pelo time de produtos.

Esse agent deve ter a capacidade de acessar um board do trello, analisar um card e fazer o refinamento tecnico da historia que consta na coluna de Refinamento. O input para o agent pode ser o ID do card, titulo ou descrição.
O agent deve ter a capacidade também de navegar no diretorio do projeto, analisar os arquivos já existentes.
Mas não deve em hipotese nenhuma criar, alterar ou remover arquivos, apenas leitura.
Deve ter acesso a MCPs.

Passos:

1. Entender a demanda de produto, incrementar informações faltantes e respeitar os critérios de aceites definidos na historia.
2. Entender se é possível fazer a quebra dessa historias em várias historias menores para cada funcionalidade.
3. Para cada funcionalidade da historia, criar um card com o refinamento tecnico referente a essa funcionalidade. 
O refinamento deve conter:
	a. O problema de negócio que a história propõe a resolver
	b. Componentes dos sistemas que serão criados ou modificados.
	c. Cenários de testes
	d. Demais informações relevanetes para que qualquer desenvolvedor sem contexto consiga executar o desenvolvimento da tarefa. 
5. Antes de criar o card, peça a validação do usuario para ver se o refinamento está de acordo com o esperado.
6. Os cards devem ser criados na coluna A Fazer do board do trello. Seu titulo deve conter a numeração da ordem que as historias devem ser executadas.
7. O agente deve extrair uma lista explícita de TODOS os requisitos, funcionalidades, rotas, itens de menu e comportamentos descritos no card original** — usar essa lista como checklist de referência obrigatória
8. Todos os criterios de aceite devem estar cobertos no card refinado! Isso é uma premissa e é obrigatório!
```

### Criação do agent de refinamento de git flow
```
Crie um custom-agent responsavel por seguir o gitflow do meu projeto:
1. Nunca commit na main, develop ou master
2. Crie sempre uma feature branch a partir da develop usando boas praticas de nomenclatura
3. Analise o que foi criado/alterado e faça o commit utilizando boas praticas de mensagem de commit
4. Faça o push da nova branch para o remote
5. Abra uma PR apontando para a develop, na PR descreva um resumo do que foi modificado, adicione os arquivos que foram alterados e mais o que achar pertinente
6. Pode ser usado o MCP do github quando necessario.
7. Nunca alterar nenhum codigo do projeto, deletar repositorios, deletar pullrequests.
```