# Prompts — Semana 2 (Ordem de Execução)

> Execute os prompts na ordem abaixo. Cada seção é um passo do treinamento.

---

## Passo 1 — Diagrama de Arquitetura (draw.io)

```
Gere um diagrama de arquitetura AWS em draw.io para o Portal Pet Care com os seguintes serviços:
- Frontend: Next.js no S3 + CloudFront
- Backend: Spring Boot 3.5 no ECS Fargate
- Banco: RDS PostgreSQL
- Auth: Cognito
- Storage: S3 (fotos de pets)
- Mensageria: SQS (agendamentos)
- Monitoramento: CloudWatch
- DNS: Route 53
- CDN: CloudFront

Mostre o fluxo do browser até o banco de dados. Inclua VPC com subnets públicas e privadas.
Use ícones AWS oficiais do draw.io (shapes aws4).
Salve o arquivo como /docs/architecture/petcare-architecture.drawio no projeto.
```

---

## Passo 2 — Precificação AWS (custos reais)

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

---

## Passo 3 — Terraform (gerar + aplicar na AWS)

### 3.1 Gerar código Terraform

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

### 3.2 Aplicar na AWS

```
Execute o Terraform para provisionar a infraestrutura do Pet Care na AWS:
1. cd infra/terraform
2. terraform init
3. terraform plan -out=tfplan
4. terraform apply tfplan

Use o profile AWS "petcare" (SSO já autenticado).
Após aplicar, salve os outputs (URLs, endpoints) em /docs/architecture/infra-outputs.md.
```

### 3.3 Verificar no Console / CLI

```
Liste os recursos criados pelo Terraform na conta AWS:
- aws ec2 describe-vpcs --profile petcare --query "Vpcs[?Tags[?Key=='Project' && Value=='petcare']].[VpcId,CidrBlock]" --output table
- aws rds describe-db-instances --profile petcare --query "DBInstances[*].[DBInstanceIdentifier,Endpoint.Address,DBInstanceStatus]" --output table
- aws s3 ls --profile petcare | grep petcare
- aws cognito-idp list-user-pools --profile petcare --max-results 10 --query "UserPools[*].[Name,Id]" --output table
```

---

## Passo 4 — Quebrar Épico em Histórias (Trello)

```
Com base no diagrama de arquitetura gerado em /docs/architecture/ e no card épico "[ÉPICO] Arquitetura AWS + Backend Spring Boot 3.5" do Trello (board PetCare, lista Refinamento):

1. Leia o arquivo semana-2-arquitetura/05-historias.md como referência/gabarito do que se espera
2. Quebre o épico em histórias de usuário independentes e implementáveis
3. Cada história deve ter: título com label [ARCH/SETUP/FEAT/TEST/CHORE/INFRA], descrição "Como...", critérios de aceite detalhados
4. Crie cada história como um card na lista "A fazer" do Trello (board PetCare)
5. Ordene por dependência (setup primeiro, depois modelo, services, controllers, security, testes)
6. Use como referência os serviços do diagrama de arquitetura para garantir que nada fique de fora
7. Inclua um card de Terraform (infra) se não existir
```

---

## Passo 5 — Implementar tudo (automático)

```
@sprint-executor Execute os cards da lista "A fazer" do Trello, board PetCare.
```

> O agent vai:
> - Listar os cards e propor ordem
> - Pedir confirmação
> - Para cada card: criar branch → spec → implementar → testes → commit → PR
> - Mover card para "Concluído" no Trello

---

## Passo 6 — Mostrar backend rodando

```
Suba o backend localmente e demonstre:
1. docker-compose up -d
2. mvn spring-boot:run -Dspring-boot.run.profiles=local
3. Abrir Swagger: http://localhost:8080/swagger-ui/index.html
4. Testar: GET /api/plans (público), POST /api/auth/login, GET /api/pets (com token)
```

---

## Passo 7 — Destruir infraestrutura (final)

```
Destrua toda a infraestrutura criada para evitar custos:
cd infra/terraform && terraform destroy -auto-approve
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

---

## Referência — Prompts detalhados (se precisar executar manualmente)

> Estes prompts são usados pelo @sprint-executor automaticamente.
> Use manualmente só se precisar reexecutar uma etapa específica.

<details>
<summary>Setup do Projeto Spring Boot 3.5</summary>

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
</details>

<details>
<summary>Entidades JPA + Banco</summary>

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
</details>

<details>
<summary>Repositories + DTOs</summary>

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
</details>

<details>
<summary>Services — Regras de Negócio</summary>

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
</details>

<details>
<summary>Controllers — Endpoints REST</summary>

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
</details>

<details>
<summary>Spring Security + JWT</summary>

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
</details>

<details>
<summary>Upload de Fotos — S3</summary>

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
</details>

<details>
<summary>Exception Handling + Dados Iniciais</summary>

```
Crie o GlobalExceptionHandler (@RestControllerAdvice):
- ResourceNotFoundException → 404
- BusinessException → 422
- ForbiddenException → 403
- MethodArgumentNotValidException → 400 com fieldErrors
- MaxUploadSizeExceededException → 400
- Exception genérica → 500 (log real, mensagem genérica)

Formato: { timestamp, status, error, message, path }

Crie data.sql para profile "local":
- 3 planos, 1 user, 2 pets, 5 agendamentos, 12 faturas, 1 subscription
```
</details>

<details>
<summary>Testes Unitários</summary>

```
Gere testes unitários com JUnit 5 + Mockito para os services:

AppointmentServiceTest:
- Slot disponível → sucesso
- Slot ocupado → BusinessException
- Data passada → BusinessException
- Cancelamento por owner → CANCELLED
- Cancelamento por não-owner → ForbiddenException

PetServiceTest:
- Menos de 3 pets → sucesso
- 3 pets → BusinessException
- Pet de outro user → ForbiddenException

InvoiceServiceTest:
- Pagar PENDING → sucesso
- Pagar já PAID → BusinessException
- Pagar de outro user → ForbiddenException

Rodar com `mvn test` e todos devem passar.
```
</details>
