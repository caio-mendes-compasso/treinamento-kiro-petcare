# Prompts — Semana 2: Arquitetura AWS + Backend Spring Boot 3.5

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
> | **Skill** | `java-spring-boot` | Padrões e boas práticas Spring Boot/Java |
> | **Skill** | `code-review-quality` | Revisar qualidade do código antes do PR |
> | **Skill** | `git-hygiene-enforcer` | Garantir commits e branches padronizados |
> | **Power** | `aws-cost-optimization` | Estimar custos AWS e otimizar arquitetura |

---

## Refinar um Card

```
@card-refiner Refine o card "[NOME_DO_CARD]" da lista "Sprint 2 - Arquitetura + Backend".
```

```
@card-refiner Refine o próximo card pendente na lista "Sprint 2 - Arquitetura + Backend".
```

---

## Implementar um Card

```
Implemente o card "[NOME_DO_CARD]" da lista "Sprint 2 - Arquitetura + Backend" do Trello.
```

```
Implemente o próximo card pendente da lista "Sprint 2 - Arquitetura + Backend".
```

```
Implemente o card ID [CARD_ID] do Trello.
```

---

## Diagrama de Arquitetura

```
Implemente o card de Diagrama de Arquitetura. Gere em draw.io e salve em /docs/architecture/.
```

---

## Precificação AWS

```
Implemente o card de Precificação. Use o power aws-cost-optimization para dados de preço reais.
Salve em /docs/architecture/custos.md.
```

---

## Gerar Spec do Backend

```
#spec-from-trello Gere uma spec a partir dos cards da lista "Sprint 2 - Arquitetura + Backend".
```

---

## Verificar Progresso

```
@sprint-reviewer Analise o progresso da lista "Sprint 2 - Arquitetura + Backend".
```

---

## Code Review antes do PR

```
Faça uma revisão de qualidade no código do backend antes de abrir o PR.
```

---

## PR Final

```
Implemente o card de Pull Request da lista "Sprint 2 - Arquitetura + Backend".
```

---

## Troubleshooting

```
@tech-troubleshooter Erro: [colar erro aqui]
```

```
@tech-troubleshooter JWT não valida: [colar erro]
```

```
@tech-troubleshooter Upload S3 falha: [colar erro]
```
