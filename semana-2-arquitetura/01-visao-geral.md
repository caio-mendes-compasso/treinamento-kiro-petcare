# 🏗️ Semana 2 — Arquitetura AWS + Backend com IA

## O que vamos fazer hoje?

Criar **toda a arquitetura cloud e o backend** do Portal Pet Care usando **apenas IA** — sem escrever código manualmente, sem abrir o console AWS na mão.

> Ferramentas: Kiro IDE + MCPs (Trello, GitHub, AWS Pricing, draw.io) + Terraform

---

## 🎯 Entregas desta sessão

| # | Entrega | Como | Tempo |
|---|---------|------|-------|
| 1 | Diagrama de Arquitetura AWS | draw.io (gerado pela IA) | ~5 min |
| 2 | Estimativa de Custos | MCP AWS Pricing (preços reais) | ~5 min |
| 3 | Infraestrutura real na AWS | Terraform (gerado + apply) | ~10 min |
| 4 | Histórias no Trello | IA quebra o Épico em cards | ~5 min |
| 5 | Backend Spring Boot 3.5 completo | IA implementa card por card | ~40 min |
| 6 | Testes + PRs | Uma PR por história | ~10 min |

**Tempo total: ~1h15**

---

## 🏛️ Arquitetura Alvo

```
Browser → Route 53 → CloudFront → ALB → ECS Fargate (Spring Boot) → RDS PostgreSQL
                                                                    → S3 (fotos)
                                                                    → Cognito (auth)
                                                                    → SQS (agendamentos)
```

| Serviço AWS | Função |
|-------------|--------|
| ECS Fargate | Backend Java (Spring Boot 3.5) |
| RDS PostgreSQL | Banco de dados relacional |
| S3 | Fotos de pets + frontend estático |
| Cognito | Autenticação JWT |
| CloudFront | CDN |
| SQS | Fila de agendamentos |
| CloudWatch | Logs e alarmes |
| Route 53 | DNS |

---

## 🔌 API REST — Endpoints

| Recurso | Método | Path | Auth |
|---------|--------|------|------|
| Auth | POST | /api/auth/login, /register, /refresh | Público |
| Usuários | GET, PUT | /api/users/me | Protegido |
| Pets | CRUD | /api/pets, /api/pets/{id}/photo | Protegido |
| Planos | GET | /api/plans | Público |
| Assinaturas | POST | /api/subscriptions | Protegido |
| Agenda | CRUD | /api/appointments, /slots | Protegido |
| Financeiro | GET, POST | /api/invoices, /invoices/{id}/pay | Protegido |

---

## ⚙️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Spring Boot 3.5 |
| Linguagem | Java 17 |
| Build | Maven |
| Banco | PostgreSQL 15 |
| ORM | Spring Data JPA |
| Auth | Spring Security + JWT |
| Storage | AWS S3 SDK v2 |
| Docs | Swagger (SpringDoc OpenAPI) |
| Testes | JUnit 5 + Mockito |
| IaC | Terraform |
| Container | Docker + docker-compose |

---

## 🤖 Ferramentas de IA usadas

| Tipo | Nome | O que faz |
|------|------|-----------|
| **Power** | aws-cost-optimization | Consulta preços reais AWS |
| **Power** | trello-to-pr | Cria cards e PRs automaticamente |
| **Skill** | java-spring-boot | Gera código Spring Boot correto |
| **Skill** | terraform-skill | Boas práticas de IaC |
| **Agent** | @sprint-executor | Implementa card por card (spec → código → PR) |
| **Agent** | @card-refiner | Refina histórias de usuário |
| **MCP** | draw.io | Gera diagramas de arquitetura |

---

## 📐 Fluxo da Apresentação

```
┌─────────────────────────────────────────────────────────────┐
│  1. DIAGRAMA       → IA gera arquitetura em draw.io         │
│  2. CUSTOS         → IA consulta pricing real da AWS        │
│  3. TERRAFORM      → IA gera IaC + aplica na AWS           │
│  4. MOSTRAR AWS    → Ver recursos criados no console        │
│  5. ÉPICO → CARDS  → IA quebra épico em histórias          │
│  6. IMPLEMENTAÇÃO  → @sprint-executor executa tudo          │
│  7. BACKEND RODANDO→ Swagger + curl ao vivo                 │
│  8. PRs NO GITHUB  → Uma PR por história                   │
│  9. DESTROY        → terraform destroy (zero custo)         │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Momentos de impacto (pra audiência)

1. **Diagrama gerado em segundos** — draw.io abre com arquitetura completa
2. **Preços reais** — MCP retorna valores atualizados da AWS
3. **Infra criada na AWS** — `terraform apply` provisiona tudo, mostrar no console
4. **Épico vira 10+ histórias** — IA lê o épico e cria cards no Trello
5. **Backend completo sem digitar** — @sprint-executor implementa tudo
6. **Swagger funcionando** — endpoints testáveis ao vivo
7. **PRs abertas** — cada card com sua PR no GitHub
8. **Destruição em 1 comando** — `terraform destroy` limpa tudo

---

## 📋 Pré-requisitos (já validados ✅)

- [x] Java 17+ (`java -version`)
- [x] Maven 3.9+ (`mvn -version`)
- [x] Terraform 1.9+ (`terraform -version`)
- [x] Docker rodando (`docker ps`)
- [x] AWS SSO autenticado (`aws sts get-caller-identity --profile petcare`)
- [x] Kiro com powers/skills/agents instalados
- [x] Board "PetCare" no Trello com Épico criado
- [x] Repo no GitHub pronto
