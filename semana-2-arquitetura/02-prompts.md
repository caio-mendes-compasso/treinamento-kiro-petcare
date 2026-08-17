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

## 0. Quebrar Épico em Histórias (após gerar diagrama)

```
Com base no diagrama de arquitetura gerado em /docs/architecture/ e no card épico "[ÉPICO] Arquitetura AWS + Backend Spring Boot 3.5" do Trello (board PetCare, lista Refinamento):

1. Quebre o épico em histórias de usuário independentes e implementáveis
2. Cada história deve ter: título com label [ARCH/SETUP/FEAT/TEST/CHORE], descrição "Como...", critérios de aceite
3. Crie cada história como um card na lista "Refinamento" do Trello
4. Ordene por dependência (setup primeiro, depois modelo, services, controllers, security, testes, PR)
5. Use como referência os serviços do diagrama de arquitetura para garantir que nada fique de fora
```

Alternativa mais direta:

```
Leia o card épico "Arquitetura AWS + Backend Spring Boot 3.5" no Trello e quebre-o em cards de histórias individuais na lista "Refinamento". Cada card deve ter critérios de aceite claros e ser implementável de forma independente.
```

---

## 1. Refinar um Card

```
@card-refiner Refine o card "[NOME_DO_CARD]" da lista "Refinamento" do board PetCare.
```

```
@card-refiner Refine o próximo card pendente na lista "Refinamento".
```

---

## 2. Diagrama de Arquitetura

### 2.1 Gerar diagrama inicial

```
Gere um diagrama de arquitetura AWS em draw.io para o Portal Pet Care com os seguintes serviços:
- Frontend: Next.js no Amplify (ou S3 + CloudFront)
- Backend: Spring Boot 3.5 no ECS Fargate
- Banco: RDS PostgreSQL
- Auth: Cognito
- Storage: S3 (fotos de pets)
- Mensageria: SQS (agendamentos)
- Monitoramento: CloudWatch
- DNS: Route 53
- CDN: CloudFront

Mostre o fluxo do browser até o banco de dados. Inclua VPC com subnets públicas e privadas.
Salve o diagrama em /docs/architecture/diagrama-arquitetura.drawio.
```

### 2.2 Precificação AWS

```
Use o power aws-cost-optimization para estimar os custos mensais da arquitetura do Pet Care.

Premissas:
- 1000 MAU (Monthly Active Users)
- 5000 requests/dia
- 500MB de fotos no S3
- 10GB banco de dados
- Backend rodando 24/7 (Fargate: 0.5 vCPU, 1GB RAM)

Compare dois cenários:
1. Container (ECS Fargate)
2. Serverless (Lambda + API Gateway)

Salve o resultado em /docs/architecture/custos.md com tabela por serviço e total mensal.
```

### 2.3 Infraestrutura como Código (Terraform)

```
Com base no diagrama de arquitetura gerado em /docs/architecture/, crie os módulos Terraform para provisionar toda a infraestrutura do Pet Care na AWS.

Estrutura em /infra/terraform/:
- main.tf — provider AWS, backend S3 para state
- variables.tf — variáveis com valores padrão para dev
- outputs.tf — URLs, endpoints, ARNs úteis
- modules/
  - vpc/ — VPC com subnets públicas e privadas, NAT Gateway, Security Groups
  - rds/ — RDS PostgreSQL (db.t3.micro, 20GB, multi-az: false para dev)
  - ecs/ — ECS Fargate cluster + service + task definition para o backend Spring Boot
  - s3/ — Bucket para fotos de pets (petcare-photos) + bucket para frontend estático
  - cognito/ — User Pool + App Client para autenticação
  - sqs/ — Fila para agendamentos
  - cloudwatch/ — Log groups + alarmes básicos

Usar:
- Region: us-east-1
- Profile: petcare (AWS SSO)
- Tags padrão: Project=petcare, Environment=dev, ManagedBy=terraform
- Variáveis para tudo que pode mudar entre ambientes (instance size, db size, etc.)
- terraform.tfvars.example com valores de dev

O código deve ser aplicável com `terraform init && terraform plan && terraform apply`.
```

Aplicar a infraestrutura:

```
Execute o Terraform para provisionar a infraestrutura do Pet Care na AWS:
1. cd infra/terraform
2. terraform init
3. terraform plan -out=tfplan (mostrar o plano pro time validar)
4. terraform apply tfplan

Use o profile AWS "petcare" (SSO já autenticado).
Após aplicar, salve os outputs (URLs, endpoints) em /docs/architecture/infra-outputs.md.
```

Destruir a infraestrutura (no final do treinamento):

```
Destrua toda a infraestrutura criada para evitar custos:
cd infra/terraform && terraform destroy -auto-approve
```

---

## 3. Setup do Projeto Spring Boot 3.5

```
Crie o projeto backend Spring Boot 3.5 em /backend com:

- Maven, Java 17, Spring Boot 3.5.x
- Dependências: Web, JPA, Security, Validation, PostgreSQL, Lombok, SpringDoc OpenAPI, AWS SDK v2 (S3, Cognito)
- Estrutura de pacotes: com.petcare.api com subpacotes config, controller, service, repository, model (entity/dto/enums), exception, security, util
- application.yml com profiles: local, dev, prod
- Profile local: PostgreSQL em localhost:5432, S3 endpoint http://localhost:4566
- docker-compose.yml na raiz do monorepo com PostgreSQL 15 (user: petcare, pass: petcare, db: petcare_db) + LocalStack (S3)
- Dockerfile multi-stage (Maven build + Eclipse Temurin JRE 17)
- .env.example com todas as variáveis necessárias
- SpringDoc configurado para Swagger em /swagger-ui/index.html

O projeto deve subir em localhost:8080 com `mvn spring-boot:run -Dspring-boot.run.profiles=local`.
```

---

## 4. Spec Completa do Backend

```
#spec-from-trello Gere uma spec a partir dos cards da lista "Sprint 2 - Arquitetura + Backend".
```

Alternativa (sem Trello):

```
Crie uma spec em .kiro/specs/backend-spring35/ para a API REST do Pet Care com:
- 6 entidades: User, Pet, Plan, Subscription, Appointment, Invoice
- CRUD de Pets (máximo 3 por user)
- Agendamento com validação de slots e conflitos
- Financeiro com faturas e pagamento
- Auth com JWT Cognito
- Upload de fotos para S3
- Endpoints protegidos (exceto /api/plans e /api/auth/**)
```

---

## 5. Desenvolvimento

### 5.1 Entidades JPA + Banco

```
Implemente as entidades JPA do Pet Care conforme a spec:
- User (UUID, name, email unique, cpf unique, cognitoId, planType enum, timestamps)
- Pet (UUID, userId FK, name, species enum, breed, birthDate, weight, color, photoUrl, timestamps)
- Plan (Long, name, price, features ElementCollection, active)
- Subscription (UUID, userId FK, planId FK, status enum, startDate, endDate)
- Appointment (UUID, petId FK, type enum, date, time, status enum, timestamps)
- Invoice (UUID, userId FK, referenceMonth, amount, status enum, dueDate, paidAt)

Use Lombok (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor).
Nomes de tabela em snake_case. Auditing com createdAt/updatedAt.
Crie os enums: Species, PlanType, SubscriptionStatus, AppointmentType, AppointmentStatus, InvoiceStatus.
```

### 5.2 Repositories + DTOs

```
Crie os repositories Spring Data JPA e DTOs (Java records) para todas as entidades:

Repositories com queries custom:
- UserRepository: findByEmail, findByCognitoId
- PetRepository: findByUserId, countByUserId
- PlanRepository: findByActiveTrue
- SubscriptionRepository: findByUserIdAndStatus
- AppointmentRepository: findByPetIdIn, findByDateAndTime, findByDateAndStatus
- InvoiceRepository: findByUserId, findByUserIdAndStatus

DTOs como records com validações Jakarta (@NotNull, @NotBlank, @Email, @Size):
- UserResponse (CPF mascarado), UserUpdateRequest
- PetRequest, PetResponse
- PlanResponse, SubscriptionRequest
- AppointmentRequest, AppointmentResponse, SlotResponse
- InvoiceResponse
- ErrorResponse, PageResponse<T>
```

### 5.3 Services — Regras de Negócio

```
Implemente a camada de serviço com todas as regras de negócio:

PetService:
- Criar: verificar limite de 3 pets por user (422 se exceder)
- Update/Delete: verificar ownership (403 se pet não pertence ao user)
- Upload foto: gerar key S3 "pets/{petId}/{uuid}.ext", upload, salvar URL no pet

AppointmentService:
- Criar: validar data futura, horário válido (09,10,11,14,15,16h), slot não ocupado, pet pertence ao user
- Cancelar: verificar ownership, mudar status para CANCELLED
- getAvailableSlots(date): retornar todos os 6 slots com flag available/unavailable

InvoiceService:
- Listar: por userId, paginado, filtro por status
- Pagar: verificar ownership, status PENDING/OVERDUE, marcar PAID com paidAt = now()

SubscriptionService:
- Criar: verificar se user não tem subscription ACTIVE

Exceções: ResourceNotFoundException (404), BusinessException (422), ForbiddenException (403).
userId sempre extraído do token JWT, nunca do body.
Usar @Transactional onde necessário.
```

### 5.4 Controllers — Endpoints REST

```
Implemente os controllers REST com ResponseEntity e status codes corretos:

- PetController (/api/pets): GET /(paginado), POST /(201), PUT /{id}, DELETE /{id}(204), POST /{id}/photo (multipart)
- AppointmentController (/api/appointments): GET /(paginado), POST /(201), DELETE /{id}(204), GET /slots?date=YYYY-MM-DD
- InvoiceController (/api/invoices): GET /?status=X (paginado), POST /{id}/pay
- PlanController (/api/plans): GET / (público, sem auth)
- SubscriptionController (/api/subscriptions): POST /(201)
- UserController (/api/users): GET /me, PUT /me

Usar @Valid nos @RequestBody. Criar annotation @CurrentUser para injetar userId do JWT.
Adicionar Swagger annotations (@Operation, @ApiResponse) em todos os endpoints.
Todos devem ser testáveis via Swagger UI.
```

### 5.5 Spring Security + JWT Cognito

```
Configure Spring Security para o Pet Care:

SecurityConfig:
- Públicos: /api/auth/**, /api/plans, /swagger-ui/**, /v3/api-docs/**
- Demais endpoints: requerem autenticação
- CORS: permitir localhost:3000 (dev) + domínio de produção
- CSRF desabilitado, session STATELESS

JwtAuthenticationFilter:
- Extrair Bearer token do header Authorization
- Validar JWT (profile local: aceitar qualquer token com secret fixo "petcare-local-secret")
- Extrair claims: sub, email, userId
- Setar SecurityContext com user autenticado

@CurrentUser annotation:
- Resolver userId do SecurityContext e injetar nos controllers

AuthController (/api/auth):
- POST /register → cria user local (sem Cognito real no profile local)
- POST /login → gera JWT local com userId, email
- POST /refresh → renova token

Testar: sem token → 401, com token válido → 200.
```

### 5.6 Upload de Fotos — S3

```
Implemente a integração com S3 para upload de fotos de pets:

S3Config:
- Bean S3Client configurado via application.yml (region, endpoint, credentials)
- Profile local: endpoint http://localhost:4566 (LocalStack)

StorageService:
- uploadFile(petId, MultipartFile): validar tipo (jpeg/png only), tamanho (max 5MB), gerar path "pets/{petId}/{uuid}.ext", upload para bucket "petcare-photos", retornar URL pública
- deleteFile(key): remover do S3

Endpoint: POST /api/pets/{id}/photo (multipart/form-data)
- Validar ownership do pet
- Chamar StorageService.uploadFile
- Atualizar pet.photoUrl
- Retornar PetResponse atualizado

Script init-localstack.sh para docker-compose:
- Criar bucket "petcare-photos" no LocalStack na inicialização

Erros: 400 se arquivo > 5MB ou tipo inválido.
```

### 5.7 Exception Handling Global

```
Crie o GlobalExceptionHandler (@RestControllerAdvice):

Mappings:
- ResourceNotFoundException → 404
- BusinessException → 422
- ForbiddenException → 403
- MethodArgumentNotValidException → 400 com fieldErrors
- MaxUploadSizeExceededException → 400
- Exception genérica → 500 (log real no server, mensagem genérica pro client)

Formato padrão de resposta:
{ timestamp, status, error, message, path }

Para validação adicionar:
{ ..., fieldErrors: [{ field, message }] }

Nenhum stacktrace deve ser exposto ao cliente.
```

### 5.8 Dados Iniciais + Docker

```
Crie o data.sql para o profile "local" com dados de teste:

- 3 planos: Básico (R$49,90: Consultas, Vacinas), Plus (R$89,90: +Exames, Emergência), Premium (R$149,90: +Cirurgias, Internação)
- 1 user: Maria Silva, maria@email.com, CPF 123.456.789-00
- 2 pets: Thor (Golden Retriever, 3 anos, 30kg), Luna (Siamês, 2 anos, 4kg)
- 5 agendamentos: 2 futuros confirmados, 2 passados confirmados, 1 cancelado
- 12 faturas: 4 PAID, 6 PENDING, 2 OVERDUE
- 1 subscription ativa (Plus)

Garantir que o docker-compose sobe sem erros e o data.sql é carregado automaticamente.
Configurar spring.jpa.hibernate.ddl-auto=create no profile local.
```

---

## 6. Testes

```
Gere testes unitários com JUnit 5 + Mockito para os services:

AppointmentServiceTest:
- Slot disponível → sucesso (appointment criado com status CONFIRMED)
- Slot ocupado → BusinessException
- Data passada → BusinessException
- Horário inválido (ex: 13h) → BusinessException
- Cancelamento por owner → status CANCELLED
- Cancelamento por não-owner → ForbiddenException

PetServiceTest:
- User com menos de 3 pets → sucesso
- User com 3 pets → BusinessException "Limite de 3 pets atingido"
- Update pet de outro user → ForbiddenException
- Delete pet de outro user → ForbiddenException

InvoiceServiceTest:
- Pagar fatura PENDING → sucesso, paidAt preenchido
- Pagar fatura já PAID → BusinessException
- Pagar fatura de outro user → ForbiddenException

Todos os repositories devem ser mockados com @Mock/@InjectMocks.
Rodar com `mvn test` e todos devem passar.
```

---

## 7. Commit + PR

### 7.1 Commit

```
Faça commit de todas as alterações do backend com conventional commits.
Sugira uma mensagem de commit adequada para cada grupo lógico de mudanças.
Use mensagens como:
- feat(backend): setup projeto Spring Boot 3.5 com Docker
- feat(backend): entidades JPA e modelagem do banco
- feat(backend): services com regras de negócio
- feat(backend): controllers REST e Swagger
- feat(backend): Spring Security com JWT local
- feat(backend): upload S3 com LocalStack
- feat(backend): exception handling global
- feat(backend): dados iniciais para desenvolvimento
- test(backend): testes unitários dos services
```

### 7.2 PR

```
Abra uma PR no GitHub da branch feat/backend-spring35 para main com:

Título: feat(backend): API REST Pet Care com Spring Boot 3.5

Body incluindo:
- Resumo da arquitetura AWS (com link pro diagrama)
- Estimativa de custos mensal
- Lista de endpoints implementados (método + path + descrição)
- Como rodar localmente: docker-compose up -d && mvn spring-boot:run -Dspring-boot.run.profiles=local
- URL do Swagger: http://localhost:8080/swagger-ui/index.html
- Decisões técnicas tomadas
- Checklist de critérios de aceite
```

---

## Troubleshooting

```
@tech-troubleshooter Erro: [colar erro aqui]
```

```
@tech-troubleshooter Hibernate não cria tabelas: [colar erro]
```

```
@tech-troubleshooter JWT não valida: [colar erro]
```

```
@tech-troubleshooter Upload S3 falha no LocalStack: [colar erro]
```

```
@tech-troubleshooter CORS bloqueando requests do frontend: [colar erro]
```

```
@tech-troubleshooter Circular dependency no Spring: [colar erro]
```
