# Semana 2 — Arquitetura AWS + Backend Spring Boot 3.5

## Objetivo

Desenhar a arquitetura cloud do Portal Pet Care, estimar custos, provisionar a infra na AWS com Terraform e criar o backend completo com Spring Boot 3.5 — tudo guiado pelo Kiro em ~1h15.

---

## O que será feito

| Etapa | Entrega | Tempo |
|---|---|---|
| Diagrama de Arquitetura | Desenho completo da infra AWS | 5 min |
| Precificação | Estimativa mensal de custos | 5 min |
| Terraform | Infra provisionada na AWS (IaC) | 10 min |
| Quebrar Épico em Histórias | Cards no Trello gerados pela IA | 5 min |
| Backend Spring Boot 3.5 | API REST completa (via @sprint-executor) | 40 min |
| Testes + PR | Testes, commit e PRs por card | 10 min |
| Encerramento | terraform destroy + recap | 5 min |

---

## Arquitetura AWS (base para discussão)

| Necessidade | Possível serviço AWS |
|---|---|
| Hospedar frontend (Next.js) | Amplify / S3 + CloudFront |
| API Backend (Java) | ECS Fargate / Lambda / Elastic Beanstalk |
| Banco de dados | RDS (PostgreSQL) / DynamoDB |
| Autenticação | Cognito |
| Armazenamento de fotos | S3 |
| Fila/Eventos (agendamentos) | SQS / EventBridge |
| Monitoramento | CloudWatch |
| DNS | Route 53 |
| CDN | CloudFront |

> **Importante:** A arquitetura final será definida ao vivo no treinamento.
> Os participantes vão propor e decidir juntos.

---

## Backend — Endpoints

| Recurso | Endpoints | Complexidade |
|---|---|---|
| Auth (Cognito) | POST /auth/login, POST /auth/register, POST /auth/refresh | Média |
| Usuários | GET /users/me, PUT /users/me | Baixa |
| Pets | CRUD /pets | Média |
| Planos | GET /plans, POST /subscriptions | Média |
| Agenda | CRUD /appointments, GET /slots | Alta |
| Financeiro | GET /invoices, POST /invoices/:id/pay | Média |
| Upload | POST /uploads/photo | Média |

---

## Stack do Backend

| Componente | Tecnologia |
|---|---|
| Framework | Spring Boot 3.5 |
| Linguagem | Java 17+ |
| Build | Maven |
| Banco | PostgreSQL (RDS) |
| ORM | Spring Data JPA / Hibernate |
| Auth | Spring Security + AWS Cognito |
| Storage | AWS S3 SDK v2 |
| Docs | SpringDoc OpenAPI (Swagger) |
| Testes | JUnit 5 + Mockito |
| Container | Docker + docker-compose |

---

## Momentos Complexos

1. **Trade-offs de custo vs complexidade** — Fargate vs Lambda para o backend
2. **Decisão de banco** — SQL vs NoSQL para os dados do Pet Care
3. **Integração com Cognito** — validação de JWT, extração de claims
4. **Upload para S3** — presigned URLs, validação de tipo/tamanho
5. **Lógica de Agenda** — conflitos de horário, slots disponíveis
6. **Relacionamentos JPA** — User → Pets (1:N), Pet → Appointments (1:N)

---

## Divisão do Tempo (~1h15)

| Tempo | Atividade |
|---|---|
| 0-5min | Recap semana 1 + contexto |
| 5-10min | Diagrama de arquitetura (draw.io) |
| 10-15min | Precificação AWS (MCP pricing) |
| 15-25min | Terraform: gerar código + apply na AWS |
| 25-30min | Quebrar épico em histórias (IA + Trello) |
| 30-65min | @sprint-executor implementa card por card (spec → código → testes → PR) |
| 65-70min | Validação final (Swagger, curl, testes) |
| 70-75min | terraform destroy + recap + gancho semana 3 |

---

## Ferramentas Kiro utilizadas

| Tipo | Nome | Uso |
|------|------|-----|
| Power | `aws-cost-optimization` | Precificação real dos serviços AWS |
| Power | `trello-to-pr` | Gestão de cards e PRs |
| Skill | `java-spring-boot` | Padrões Spring Boot |
| Skill | `terraform-skill` | Boas práticas Terraform |
| Agent | `@sprint-executor` | Implementação automática card por card |
| Agent | `@card-refiner` | Refinamento de histórias |
| MCP | draw.io | Diagramas de arquitetura |
| MCP | GitHub | Commits e PRs |

---

## Pré-requisitos

- Java 17+ instalado
- Maven instalado
- Terraform instalado
- Docker + docker-compose
- Conta AWS com acesso (SSO configurado, profile "petcare")
- AWS CLI configurada
- Kiro IDE pronto com powers e skills instalados
- Repo com frontend da Semana 1
