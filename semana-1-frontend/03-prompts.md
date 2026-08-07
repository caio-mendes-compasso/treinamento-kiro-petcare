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
