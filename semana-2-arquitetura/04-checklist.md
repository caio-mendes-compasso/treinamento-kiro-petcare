# Checklist de Entrega — Semana 2: Arquitetura AWS + Backend Spring Boot 3.5

> Use este checklist para validar que tudo foi entregue corretamente.

---

## Arquitetura

- [ ] Diagrama de arquitetura AWS gerado
- [ ] Todos os serviços necessários representados
- [ ] Fluxo de dados claro
- [ ] Estimativa de custo mensal documentada
- [ ] Decisões arquiteturais registradas

## Setup Backend

- [ ] Projeto Spring Boot 3.5 criado com Maven
- [ ] Docker-compose sobe sem erros (PostgreSQL + LocalStack)
- [ ] Swagger acessível em /swagger-ui/index.html
- [ ] Profile "local" funcional
- [ ] Dockerfile multi-stage funcional

## Entidades e Banco

- [ ] 6 entidades mapeadas (User, Pet, Plan, Subscription, Appointment, Invoice)
- [ ] Relacionamentos JPA corretos
- [ ] Tabelas criadas no PostgreSQL
- [ ] Dados iniciais carregados (data.sql)

## Endpoints

- [ ] POST /api/auth/register → 201
- [ ] POST /api/auth/login → 200 + tokens
- [ ] GET /api/users/me → 200
- [ ] CRUD /api/pets funcionando
- [ ] POST /api/pets/{id}/photo → upload funcional
- [ ] GET /api/plans → lista planos
- [ ] POST /api/subscriptions → 201
- [ ] CRUD /api/appointments funcionando
- [ ] GET /api/appointments/slots → slots corretos
- [ ] GET /api/invoices → paginado
- [ ] POST /api/invoices/{id}/pay → marca pago

## Regras de Negócio

- [ ] Limite 3 pets → erro 422
- [ ] Agendamento data passada → erro 422
- [ ] Agendamento slot ocupado → erro 422
- [ ] Upload > 5MB → erro 400
- [ ] Upload tipo inválido → erro 400
- [ ] Pagar fatura já paga → erro 422

## Segurança

- [ ] Endpoints protegidos → 401 sem token
- [ ] User só acessa seus dados
- [ ] CORS configurado
- [ ] Erros não expõem info sensível

## Qualidade

- [ ] Build sem erros (`mvn verify`)
- [ ] Testes unitários passando
- [ ] Error handling padronizado
- [ ] Swagger documenta todos endpoints

## Git & PR

- [ ] Branch `feat/backend-spring35` criada
- [ ] Commit seguindo conventional commits
- [ ] PR aberto com diagrama, custos e endpoints na descrição

---

## Problemas Comuns e Soluções

| Problema | Solução rápida (prompt) |
|---|---|
| Hibernate não cria tabelas | "Verificar ddl-auto: update no profile local e conexão com banco." |
| Circular reference JSON | "Usar @JsonManagedReference/@JsonBackReference ou DTOs para evitar loop." |
| CORS bloqueando frontend | "Corrigir configuração CORS no SecurityConfig para aceitar localhost:3000." |
| JWT inválido modo local | "Profile local deve aceitar tokens simples sem validação Cognito." |
| Upload falha LocalStack | "Verificar endpoint S3 como http://localhost:4566 e bucket criado pelo init script." |
| Slot retorna disponível errado | "Revisar query AppointmentRepository para filtrar por date+time+status CONFIRMED." |
| Bean circular dependency | "Usar @Lazy numa das injeções ou refatorar para quebrar ciclo." |
| Spring Boot 3.5 não resolve | "Verificar se o parent pom usa spring-boot-starter-parent 3.5.x e repositório Maven Central." |
