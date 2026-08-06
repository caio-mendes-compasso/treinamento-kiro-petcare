# Prompts — Semana 2: Arquitetura AWS + Backend Spring Boot 3.5

> Prompts prontos para copiar e colar no Kiro durante o treinamento.
> Adapte conforme as decisões tomadas pelo time ao vivo.

---

## 1. Diagrama de Arquitetura

### Gerar diagrama inicial

```
Crie um diagrama de arquitetura AWS para o Portal Pet Care com os seguintes componentes:

Frontend:
- Next.js hospedado no AWS Amplify (ou S3 + CloudFront se decidirem)

Backend:
- API Java Spring Boot rodando em ECS Fargate (ou Lambda se decidirem)
- API Gateway como entry point

Dados:
- RDS PostgreSQL para dados de usuários, pets, agendamentos e faturas
- S3 para armazenamento de fotos dos animais

Autenticação:
- AWS Cognito para gerenciamento de usuários

Mensageria:
- SQS para processamento assíncrono de agendamentos

Infraestrutura:
- Route 53 para DNS
- CloudFront para CDN
- VPC com subnets públicas e privadas
- CloudWatch para monitoramento

Gere o diagrama em formato Mermaid.
Inclua as conexões entre os serviços e o fluxo de dados.
```

### Diagrama alternativo (se escolherem serverless)

```
Crie um diagrama de arquitetura serverless na AWS para o Portal Pet Care:

- Frontend: S3 + CloudFront (static hosting)
- API: API Gateway + Lambda (Java)
- Auth: Cognito
- Banco: DynamoDB
- Fotos: S3 com presigned URLs
- Eventos: EventBridge + SQS
- Monitoramento: CloudWatch + X-Ray

Mostre as conexões e o fluxo de uma requisição desde o browser até o banco.
```

---

## 2. Precificação / Análise de Custos

### Estimativa geral

```
Faça uma estimativa de custos mensais na AWS para o Portal Pet Care com a seguinte arquitetura:

Premissas:
- 1000 usuários ativos/mês
- 5000 requisições/dia à API
- 500MB de fotos armazenadas no S3
- Banco de dados com ~10GB de dados
- Ambiente: 1 (produção apenas)

Serviços a precificar:
- Amplify (hosting frontend)
- ECS Fargate (1 task, 0.5 vCPU, 1GB RAM)
- RDS PostgreSQL (db.t3.micro, 20GB)
- S3 (armazenamento + transferência)
- Cognito (1000 MAU)
- CloudFront (5GB transferência/mês)
- Route 53 (1 hosted zone)
- SQS (5000 mensagens/dia)
- CloudWatch (logs + métricas básicas)
- NAT Gateway

Para cada serviço liste:
1. Configuração escolhida
2. Custo mensal estimado
3. Se está no free tier ou não

No final, dê o total mensal e anual estimado.
```

### Comparativo rápido

```
Compare rapidamente 2 cenários de custo para o backend do Pet Care:

Cenário 1 - ECS Fargate:
- 1 task rodando 24/7, 0.5 vCPU, 1GB RAM, ALB na frente

Cenário 2 - Lambda:
- 5000 invocações/dia, 512MB memória, duração média 200ms, API Gateway HTTP

Para cada: custo mensal e recomendação para nosso caso.
```

---

## 3. Setup do Backend Spring Boot 3.5

### Criar projeto

```
Crie um projeto Spring Boot 3.5 com Java 17 e Maven para o backend do Portal Pet Care.

Dependências:
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation (Jakarta)
- PostgreSQL Driver
- Lombok
- SpringDoc OpenAPI (Swagger UI)
- AWS SDK v2 (S3, SQS, Cognito Identity Provider)

Estrutura de pacotes:
com.petcare.api
├── config/          (configurações Spring, Security, AWS)
├── controller/      (REST controllers)
├── service/         (lógica de negócio)
├── repository/      (Spring Data repositories)
├── model/
│   ├── entity/      (entidades JPA)
│   ├── dto/         (request/response DTOs)
│   └── enums/       (enumerações)
├── exception/       (exceções customizadas + handler global)
├── security/        (filtros JWT, configuração Cognito)
└── util/            (utilitários)

Inclua:
- application.yml com profiles (local, dev, prod)
- docker-compose.yml com PostgreSQL 15 + LocalStack
- Dockerfile multi-stage build
- .env.example com as variáveis necessárias

Porta: 8080
Banco local: localhost:5432/petcare, user: petcare, password: petcare123

IMPORTANTE: Usar Spring Boot versão 3.5.x explicitamente no pom.xml.
```

---

## 4. Spec do Backend

### Spec completa

```
Crie uma spec para o backend do Portal Pet Care.

O backend é uma API REST em Spring Boot 3.5 + Java 17 que serve o frontend do Portal Pet Care.

Entidades:
1. User (id, name, email, cpf, cognitoId, planType, createdAt)
2. Pet (id, userId, name, species, breed, birthDate, weight, color, photoUrl, createdAt)
3. Plan (id, name, price, features[], active)
4. Subscription (id, userId, planId, status, startDate, endDate)
5. Appointment (id, petId, type[CONSULTATION/EXAM], date, time, status[CONFIRMED/CANCELLED], createdAt)
6. Invoice (id, userId, referenceMonth, amount, status[PAID/PENDING/OVERDUE], dueDate, paidAt)

Regras de negócio:
- Máximo 3 pets por usuário
- Não pode agendar em horário já ocupado
- Não pode agendar em data passada
- Slots disponíveis: 09:00-11:00 e 14:00-16:00 (intervalos de 1h)
- Faturas vencidas: status muda para OVERDUE após dueDate
- Upload de foto: max 5MB, apenas imagens (jpg, png)

Endpoints:
- POST /api/auth/register, /api/auth/login, /api/auth/refresh
- GET /api/users/me, PUT /api/users/me
- CRUD /api/pets + POST /api/pets/{id}/photo
- GET /api/plans
- POST /api/subscriptions
- CRUD /api/appointments + GET /api/appointments/slots?date=YYYY-MM-DD
- GET /api/invoices + POST /api/invoices/{id}/pay

Todos endpoints (exceto auth e plans) requerem autenticação JWT.
Respostas de erro padronizadas. Paginação nos endpoints de listagem.
```

---

## 5. Desenvolvimento — Prompts por Camada

### 5.1 Entidades JPA

```
Implemente as entidades JPA do Pet Care:

1. User:
   - id (UUID, gerado automaticamente)
   - name (String, not null), email (String, unique), cpf (String, unique)
   - cognitoId (String, unique), planType (enum: BASIC, PLUS, PREMIUM)
   - createdAt (LocalDateTime, auto)
   - @OneToMany com Pet

2. Pet:
   - id (UUID), user (@ManyToOne, not null)
   - name, species (enum: DOG, CAT, OTHER), breed, birthDate (LocalDate)
   - weight (BigDecimal), color, photoUrl
   - createdAt (LocalDateTime, auto)
   - @OneToMany com Appointment

3. Plan:
   - id (Long, auto increment), name, price (BigDecimal)
   - features (List<String>, @ElementCollection), active (boolean)

4. Subscription:
   - id (UUID), user (@ManyToOne), plan (@ManyToOne)
   - status (enum: ACTIVE, CANCELLED, EXPIRED)
   - startDate, endDate (LocalDate)

5. Appointment:
   - id (UUID), pet (@ManyToOne, not null)
   - type (enum: CONSULTATION, EXAM)
   - date (LocalDate), time (LocalTime)
   - status (enum: CONFIRMED, CANCELLED)
   - createdAt (LocalDateTime, auto)

6. Invoice:
   - id (UUID), user (@ManyToOne, not null)
   - referenceMonth (YearMonth), amount (BigDecimal)
   - status (enum: PAID, PENDING, OVERDUE)
   - dueDate (LocalDate), paidAt (LocalDateTime, nullable)

Use Lombok (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor).
@Table com nomes snake_case. Auditing com @EntityListeners.
```

### 5.2 Repositories + DTOs

```
Crie os repositories e DTOs do Pet Care:

Repositories:
- UserRepository: findByEmail, findByCognitoId
- PetRepository: findByUserId, countByUserId
- PlanRepository: findByActiveTrue
- SubscriptionRepository: findByUserIdAndStatus
- AppointmentRepository: findByPetIdIn, findByDateAndTime, findByDateAndStatus
- InvoiceRepository: findByUserId, findByUserIdAndStatus

DTOs (usar Java records):
- UserResponse (mascarar CPF: ***.***.789-00)
- UserUpdateRequest (name, phone)
- PetRequest / PetResponse
- PlanResponse
- SubscriptionRequest (planId)
- AppointmentRequest (petId, type, date, time) / AppointmentResponse
- SlotResponse (time, available)
- InvoiceResponse (com formattedAmount)
- ErrorResponse (timestamp, status, message, path)
- PageResponse<T>

Validações Jakarta nos requests (@NotNull, @NotBlank, @Email, @Size).
```

### 5.3 Services — Lógica de Negócio

```
Implemente os services do Pet Care com regras de negócio:

PetService:
- create: verificar limite de 3 pets por user
- update/delete: verificar se pet pertence ao user
- uploadPhoto: gerar presigned URL S3, salvar URL no pet

AppointmentService:
- create: validar data futura, horário válido (09,10,11,14,15,16), slot não ocupado, pet do user
- cancel: verificar ownership, mudar status CANCELLED
- getAvailableSlots(date): retornar slots com flag available/unavailable

InvoiceService:
- list: por userId com paginação e filtro status
- pay: verificar ownership, status PENDING/OVERDUE, marcar PAID

SubscriptionService:
- create: verificar se user não tem subscription ACTIVE já

Todos os services:
- Lançar exceções customizadas (ResourceNotFoundException, BusinessException, ForbiddenException)
- Receber userId do token JWT
- @Transactional onde necessário
```

### 5.4 Controllers

```
Implemente os REST controllers do Pet Care:

PetController (/api/pets):
- GET / → listar pets do user logado (paginado)
- POST / → criar pet (201)
- PUT /{id} → atualizar pet
- DELETE /{id} → remover pet (204)
- POST /{id}/photo → upload multipart

AppointmentController (/api/appointments):
- GET / → listar agendamentos (paginado)
- POST / → criar (201)
- DELETE /{id} → cancelar (204)
- GET /slots?date=YYYY-MM-DD → slots do dia

InvoiceController (/api/invoices):
- GET /?status=PENDING → listar faturas (paginado + filtro)
- POST /{id}/pay → pagar fatura

PlanController (/api/plans):
- GET / → listar planos ativos (público)

SubscriptionController (/api/subscriptions):
- POST / → contratar plano (201)

UserController (/api/users):
- GET /me → dados do user logado
- PUT /me → atualizar dados

Padrões: @Valid, ResponseEntity com status corretos, @CurrentUser annotation customizada, Swagger annotations.
```

### 5.5 Security — Cognito JWT

```
Configure Spring Security para validar JWT do AWS Cognito:

1. SecurityConfig:
   - Públicos: /api/auth/**, /api/plans, /swagger-ui/**, /v3/api-docs/**
   - Todos os outros requerem auth
   - CORS para localhost:3000 + domínio produção
   - CSRF desabilitado, session STATELESS

2. JwtAuthenticationFilter:
   - Extrair Bearer token do header Authorization
   - Validar com JWKS do Cognito (cachear keys)
   - Extrair claims: sub, email, custom:userId
   - Setar Authentication no SecurityContext

3. @CurrentUser annotation:
   - Resolve userId do JWT para usar como parâmetro nos controllers

4. AuthController (/api/auth):
   - POST /register → registra Cognito + cria user local
   - POST /login → autentica Cognito, retorna tokens
   - POST /refresh → renova access token

5. Profile "local": aceitar JWT simples com secret fixo (sem Cognito real) para facilitar dev.
```

### 5.6 Upload S3

```
Implemente upload de fotos para S3:

1. S3Config: bean S3Client, bucket via application.yml
2. StorageService:
   - uploadFile: validar tipo (image/jpeg, image/png), tamanho (max 5MB), gerar path pets/{petId}/{uuid}.ext, upload, retornar URL
   - deleteFile: remover do S3
   - generatePresignedUrl: URL temporária para download

3. Endpoint: POST /api/pets/{id}/photo (multipart)
4. Para local: usar LocalStack no docker-compose

Configuração:
aws.s3.bucket: petcare-photos
aws.s3.region: us-east-1
```

### 5.7 Exception Handling

```
Implemente tratamento global de erros:

Exceções: ResourceNotFoundException (404), BusinessException (422), ForbiddenException (403), InvalidFileException (400)

GlobalExceptionHandler (@RestControllerAdvice):
- Cada exceção mapeia para o status correto
- MethodArgumentNotValidException → 400 com lista de erros por campo
- Fallback Exception → 500 genérico (logar erro real)

Formato:
{
  "timestamp": "2025-03-01T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Pet não encontrado",
  "path": "/api/pets/xxx"
}

Para validação:
{
  "timestamp": "...",
  "status": 400,
  "error": "Validation Error",
  "message": "Erro de validação",
  "fieldErrors": [
    { "field": "name", "message": "Nome é obrigatório" }
  ]
}
```

### 5.8 Docker + dados iniciais

```
Configure ambiente de desenvolvimento local:

1. docker-compose.yml:
   - PostgreSQL 15 (porta 5432, banco: petcare)
   - LocalStack (S3 mock, porta 4566)

2. Dockerfile multi-stage:
   - Stage 1: Maven build (cachear deps)
   - Stage 2: JRE slim, copiar jar, expor 8080

3. application-local.yml:
   - Datasource → PostgreSQL do compose
   - S3 endpoint → LocalStack
   - JWT modo local (secret fixo)
   - Hibernate ddl-auto: update
   - Swagger habilitado

4. data.sql (dados iniciais):
   - 3 planos (Básico R$49,90, Plus R$89,90, Premium R$149,90)
   - 1 user de teste (maria@email.com)
   - 2 pets (Thor - Golden, Luna - Siamês)
   - Faturas e agendamentos de exemplo

5. init-localstack.sh: criar bucket petcare-photos
```

---

## 6. Testes

### Testes unitários

```
Crie testes unitários para o backend (JUnit 5 + Mockito):

1. AppointmentService:
   - Slot disponível → sucesso
   - Slot ocupado → BusinessException
   - Data passada → BusinessException
   - Cancelamento → status CANCELLED

2. PetService:
   - Menos de 3 pets → sucesso
   - 3 pets existentes → BusinessException
   - Pet de outro user → ForbiddenException

3. InvoiceService:
   - Pagar fatura PENDING → sucesso, paidAt preenchido
   - Pagar fatura já PAID → BusinessException

Foco em regras de negócio, mockar repositories.
```

---

## 7. Git + PR

### Commit

```
Crie um commit para a arquitetura e backend do Pet Care.
Tipo: feat, escopo: backend
Mensagem deve mencionar: arquitetura AWS definida, API Spring Boot 3.5 criada, endpoints, Docker, testes.
```

### PR

```
Crie uma PR para a branch atual.
Título: "feat(backend): Arquitetura AWS + API Spring Boot 3.5"
Descrição:
- Diagrama de arquitetura (resumo dos serviços)
- Estimativa de custos
- Lista de endpoints
- Como rodar: docker-compose up + mvn spring-boot:run
- Swagger URL
- Decisões técnicas
- Cobertura de testes
```

---

## 8. Prompts de Suporte

### Se a arquitetura ficar cara

```
A estimativa ficou em $X/mês. Sugira versão mais enxuta mantendo frontend hospedado, API rodando, banco e auth. Objetivo: menos de $Y/mês.
```

### Se JWT não validar

```
A validação JWT do Cognito não funciona. Erro: [colar]. Verifique JWKS URL, issuer e audience.
```

### Se JPA der erro

```
Hibernate erro ao criar tabelas: [colar]. Revise mapeamentos JPA e relacionamentos.
```

### Se upload S3 falhar

```
Upload S3 falhando: [colar]. Verificar credenciais, bucket, endpoint LocalStack.
```
