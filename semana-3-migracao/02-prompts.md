# Prompts — Semana 3: Migração Spring Boot 4.0 + Integração

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
> | **Agent** | `@tech-troubleshooter` | Diagnosticar e corrigir erros (especialmente migração) |
> | **Skill** | `java-spring-boot` | Padrões Spring Boot (incluindo migração 4.0) |
> | **Skill** | `react-nextjs-patterns` | Padrões Next.js para integração frontend |
> | **Skill** | `vitest` | Testes frontend com Vitest |
> | **Skill** | `code-review-quality` | Revisar qualidade antes do PR final |
> | **Skill** | `git-hygiene-enforcer` | Garantir commits e branches padronizados |

---

## Refinar um Card

```
@card-refiner Refine o card "[NOME_DO_CARD]" da lista "Sprint 3 - Migração + Integração".
```

```
@card-refiner Refine o próximo card pendente na lista "Sprint 3 - Migração + Integração".
```

---

## Implementar um Card

```
Implemente o card "[NOME_DO_CARD]" da lista "Sprint 3 - Migração + Integração" do Trello.
```

```
Implemente o próximo card pendente da lista "Sprint 3 - Migração + Integração".
```

```
Implemente o card ID [CARD_ID] do Trello.
```

---

## Gerar Spec da Sprint

```
#spec-from-trello Gere uma spec a partir dos cards da lista "Sprint 3 - Migração + Integração".
```

---

## Verificar Progresso

```
@sprint-reviewer Analise o progresso da lista "Sprint 3 - Migração + Integração".
```

---

## Code Review antes do PR

```
Faça uma revisão de qualidade no código (frontend + backend) antes de abrir o PR final.
```

---

## PR Final

```
Implemente o card de Pull Request Final da lista "Sprint 3 - Migração + Integração".
```

---

## Troubleshooting

```
@tech-troubleshooter Erro: [colar erro aqui]
```

```
@tech-troubleshooter Jackson serializa diferente: antes [X] agora [Y]
```

```
@tech-troubleshooter Security não funciona após migração: [erro]
```

```
@tech-troubleshooter Frontend não conecta ao backend: [erro]
```
