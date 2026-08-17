# Histórias de Referência — Semana 2: Arquitetura AWS + Backend Spring Boot 3.5

> ⚠️ **Este arquivo é um GABARITO de referência.**
>
> No treinamento, a IA vai **gerar as histórias automaticamente** a partir do épico + diagrama de arquitetura.
> Use este documento para:
> - Validar se a IA gerou todas as histórias necessárias
> - Comparar os critérios de aceite gerados vs esperados
> - Adicionar manualmente algo que a IA tenha esquecido
>
> **Fluxo real no treinamento:**
> 1. Gerar diagrama de arquitetura
> 2. IA lê o épico no Trello + diagrama
> 3. IA quebra em cards individuais na lista "Refinamento"
> 4. Facilitador valida contra este gabarito
> 5. @sprint-executor implementa card por card
>
> **Board Trello:** PetCare
> **Épico:** [ÉPICO] Arquitetura AWS + Backend Spring Boot 3.5
> **Labels:** 🟠 Arquitetura | 🔴 Backend | 🔵 Setup | 🟣 Infra | 🟡 Teste

---

## Card 1

**Título:** [ARCH] Diagrama de Arquitetura AWS

**Label:** 🟠 Arquitetura

**Descrição:**
Como time de desenvolvimento, queremos definir e documentar a arquitetura AWS do Pet Care para ter visibilidade dos serviços, custos e fluxos antes de implementar.

**Critérios de Aceite:**
- [ ] Diagrama de arquitetura geral gerado (Mermaid ou draw.io)
- [ ] Todos os serviços AWS necessários representados
- [ ] Fluxo de dados do browser até o banco documentado
- [ ] Decisões tomadas pelo time registradas (container vs serverless, SQL vs NoSQL)
- [ ] Diagrama de VPC/rede (subnets públicas/privadas, security groups)
- [ ] Diagramas salvos em `/docs/architecture/`

**Serviços a considerar:**
- Frontend hosting: Amplify ou S3 + CloudFront
- Backend: ECS Fargate ou Lambda
- Banco: RDS PostgreSQL ou DynamoDB
- Auth: Cognito
- Storage: S3
- Mensageria: SQS
- Monitoramento: CloudWatch
- DNS: Route 53

---

## Card 2

**Título:** [ARCH] Precificação e Estimativa de Custos AWS

**Label:** 🟠 Arquitetura

**Descrição:**
Como time de desenvolvimento, queremos estimar os custos mensais da arquitetura para validar viabilidade financeira do projeto.

**Critérios de Aceite:**
- [ ] Estimativa de custo mensal por serviço
- [ ] Premissas documentadas (1000 MAU, 5000 req/dia, 500MB fotos, 10GB banco)
- [ ] Identificação do que entra no free tier
- [ ] Comparativo de cenários (pelo menos 2: container vs serverless)
- [ ] Sugestões de otimização de custo
- [ ] Total mensal e anual estimado
- [ ] Documento salvo em `/docs/architecture/custos.md`

---

## Card 3

**Título:** [SETUP] Projeto Spring Boot 3.5 + Docker Compose

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero o projeto backend configurado com Spring Boot 3.5 e ambiente local via Docker para iniciar o desenvolvimento da API.

**Critérios de Aceite:**
- [ ] Projeto Maven com Spring Boot 3.5.x em `/backend`
- [ ] Dependências: Web, JPA, Security, Validation, PostgreSQL, Lombok, SpringDoc OpenAPI, AWS SDK v2
- [ ] Estrutura de pacotes: config, controller, service, repository, model (entity/dto/enums), exception, security, util
- [ ] application.yml com profiles: local, dev, prod
- [ ] docker-compose.yml na raiz do monorepo com PostgreSQL 15 + LocalStack
- [ ] Dockerfile multi-stage (Maven build + JRE slim)
- [ ] .env.example com variáveis necessárias
- [ ] Aplicação sobe em localhost:8080
- [ ] Swagger acessível em /swagger-ui/index.html
- [ ] `mvn spring-boot:run -Dspring-boot.run.profiles=local` funciona

---

## Card 4

**Título:** [FEAT] Entidades JPA e Modelagem do Banco

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero as entidades JPA modeladas para representar o domínio do Pet Care no banco de dados.

**Critérios de Aceite:**
- [ ] Entidade User: id (UUID), name, email (unique), cpf (unique), cognitoId, planType (enum), createdAt
- [ ] Entidade Pet: id (UUID), userId (FK), name, species (enum), breed, birthDate, weight, color, photoUrl, createdAt
- [ ] Entidade Plan: id (Long), name, price, features (ElementCollection), active
- [ ] Entidade Subscription: id (UUID), userId (FK), planId (FK), status (enum), startDate, endDate
- [ ] Entidade Appointment: id (UUID), petId (FK), type (enum), date, time, status (enum), createdAt
- [ ] Entidade Invoice: id (UUID), userId (FK), referenceMonth, amount, status (enum), dueDate, paidAt
- [ ] Relacionamentos: User→Pets (1:N), User→Invoices (1:N), Pet→Appointments (1:N), User→Subscription (1:N)
- [ ] Lombok annotations (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor)
- [ ] @Table com nomes snake_case
- [ ] Auditing (createdAt, updatedAt)
- [ ] Tabelas criadas no PostgreSQL sem erro

**Enums:**
- Species: DOG, CAT, OTHER
- PlanType: BASIC, PLUS, PREMIUM
- SubscriptionStatus: ACTIVE, CANCELLED, EXPIRED
- AppointmentType: CONSULTATION, EXAM
- AppointmentStatus: CONFIRMED, CANCELLED
- InvoiceStatus: PAID, PENDING, OVERDUE

---

## Card 5

**Título:** [FEAT] Repositories e DTOs

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero os repositories Spring Data e DTOs definidos para acessar o banco e transferir dados de forma segura.

**Critérios de Aceite:**
- [ ] UserRepository: findByEmail, findByCognitoId
- [ ] PetRepository: findByUserId, countByUserId
- [ ] PlanRepository: findByActiveTrue
- [ ] SubscriptionRepository: findByUserIdAndStatus
- [ ] AppointmentRepository: findByPetIdIn, findByDateAndTime, findByDateAndStatus
- [ ] InvoiceRepository: findByUserId, findByUserIdAndStatus
- [ ] DTOs como Java records:
  - UserResponse (CPF mascarado), UserUpdateRequest
  - PetRequest, PetResponse
  - PlanResponse
  - SubscriptionRequest
  - AppointmentRequest, AppointmentResponse, SlotResponse
  - InvoiceResponse
  - ErrorResponse, PageResponse\<T\>
- [ ] Validações Jakarta: @NotNull, @NotBlank, @Email, @Size nos requests

---

## Card 6

**Título:** [FEAT] Services — Regras de Negócio

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero a camada de serviço com todas as regras de negócio para garantir a integridade dos dados.

**Critérios de Aceite:**
- [ ] PetService:
  - Criar: verificar limite de 3 pets por user
  - Update/Delete: verificar se pet pertence ao user
  - Upload foto: gerar presigned URL, salvar URL no pet
- [ ] AppointmentService:
  - Criar: validar data futura, horário válido (09,10,11,14,15,16), slot não ocupado, pet pertence ao user
  - Cancelar: verificar ownership, mudar status CANCELLED
  - getAvailableSlots(date): retornar slots com flag available/unavailable
- [ ] InvoiceService:
  - Listar: por userId, paginado, filtro por status
  - Pagar: verificar ownership e status PENDING/OVERDUE, marcar PAID com paidAt
- [ ] SubscriptionService:
  - Criar: verificar se user não tem subscription ACTIVE
- [ ] Exceções customizadas: ResourceNotFoundException (404), BusinessException (422), ForbiddenException (403)
- [ ] @Transactional onde necessário
- [ ] userId vem do token JWT (não do body)

**Regras de negócio principais:**
- Máximo 3 pets por usuário
- Não pode agendar em horário já ocupado
- Não pode agendar em data passada
- Slots válidos: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
- Upload: max 5MB, apenas image/jpeg e image/png

---

## Card 7

**Título:** [FEAT] Controllers — Endpoints REST

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero os endpoints REST implementados para que o frontend possa consumir a API.

**Critérios de Aceite:**
- [ ] PetController (`/api/pets`): GET / (paginado), POST / (201), PUT /{id}, DELETE /{id} (204), POST /{id}/photo (multipart)
- [ ] AppointmentController (`/api/appointments`): GET / (paginado), POST / (201), DELETE /{id} (204), GET /slots?date=YYYY-MM-DD
- [ ] InvoiceController (`/api/invoices`): GET /?status=X (paginado), POST /{id}/pay
- [ ] PlanController (`/api/plans`): GET / (público, sem auth)
- [ ] SubscriptionController (`/api/subscriptions`): POST / (201)
- [ ] UserController (`/api/users`): GET /me, PUT /me
- [ ] @Valid nos @RequestBody
- [ ] ResponseEntity com status codes corretos
- [ ] @CurrentUser annotation para injetar userId do JWT
- [ ] Swagger annotations (@Operation, @ApiResponse)
- [ ] Todos endpoints testáveis via Swagger UI

---

## Card 8

**Título:** [FEAT] Spring Security + JWT Cognito

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero a segurança configurada com validação de JWT do AWS Cognito para proteger os endpoints.

**Critérios de Aceite:**
- [ ] SecurityConfig:
  - Públicos: /api/auth/**, /api/plans, /swagger-ui/**, /v3/api-docs/**
  - Demais: requerem autenticação
  - CORS para localhost:3000 + domínio produção
  - CSRF desabilitado, session STATELESS
- [ ] JwtAuthenticationFilter: extrair Bearer token, validar com JWKS, extrair claims (sub, email, userId)
- [ ] @CurrentUser annotation que resolve userId do SecurityContext
- [ ] AuthController (`/api/auth`):
  - POST /register → registra Cognito + cria user local
  - POST /login → autentica, retorna tokens
  - POST /refresh → renova access token
- [ ] Profile "local": aceitar JWT com secret fixo (sem Cognito real)
- [ ] Endpoint protegido sem token → 401
- [ ] Endpoint protegido com token válido → 200

---

## Card 9

**Título:** [FEAT] Upload de Fotos — Integração S3

**Label:** 🟣 Infra

**Descrição:**
Como usuário, quero fazer upload da foto do meu pet para visualizar na carteirinha e no cadastro.

**Critérios de Aceite:**
- [ ] S3Config: bean S3Client com região e credentials via application.yml
- [ ] StorageService:
  - uploadFile: validar tipo (jpeg/png), tamanho (max 5MB), gerar path `pets/{petId}/{uuid}.ext`, upload, retornar URL
  - deleteFile: remover do S3
  - generatePresignedUrl: URL temporária para download
- [ ] Endpoint: POST /api/pets/{id}/photo (multipart/form-data)
- [ ] Atualiza pet.photoUrl após upload
- [ ] LocalStack configurado no docker-compose como mock S3
- [ ] Script init-localstack.sh cria bucket `petcare-photos`
- [ ] Erro 400 se arquivo > 5MB ou tipo inválido

---

## Card 10

**Título:** [FEAT] Exception Handling Global

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero tratamento de erros padronizado para que o frontend receba respostas consistentes em caso de erro.

**Critérios de Aceite:**
- [ ] GlobalExceptionHandler (@RestControllerAdvice)
- [ ] ResourceNotFoundException → 404
- [ ] BusinessException → 422
- [ ] ForbiddenException → 403
- [ ] MethodArgumentNotValidException → 400 com fieldErrors
- [ ] MaxUploadSizeExceededException → 400
- [ ] Exception genérica → 500 (log real, mensagem genérica pro client)
- [ ] Formato padrão: { timestamp, status, error, message, path }
- [ ] Validação: { ..., fieldErrors: [{ field, message }] }
- [ ] Nenhum stacktrace exposto ao cliente

---

## Card 11

**Título:** [FEAT] Dados Iniciais para Desenvolvimento

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero dados iniciais carregados no banco para facilitar testes durante o desenvolvimento.

**Critérios de Aceite:**
- [ ] data.sql carregado no profile "local"
- [ ] 3 planos criados:
  - Básico (R$ 49,90): Consultas, Vacinas
  - Plus (R$ 89,90): Consultas, Vacinas, Exames, Emergência
  - Premium (R$ 149,90): Consultas, Vacinas, Exames, Emergência, Cirurgias, Internação
- [ ] 1 user de teste: Maria Silva, maria@email.com
- [ ] 2 pets de teste: Thor (Golden Retriever, 3 anos), Luna (Siamês, 2 anos)
- [ ] 5 agendamentos (2 futuros, 2 passados, 1 cancelado)
- [ ] 12 faturas (variando status: paid, pending, overdue)
- [ ] 1 subscription ativa (Plus)

---

## Card 12

**Título:** [TEST] Testes unitários do Backend

**Label:** 🔴 Backend

**Descrição:**
Como desenvolvedor, quero testes unitários nos services para garantir que as regras de negócio estão corretas.

**Critérios de Aceite:**
- [ ] AppointmentService:
  - Slot disponível → sucesso
  - Slot ocupado → BusinessException
  - Data passada → BusinessException
  - Cancelamento → status CANCELLED
- [ ] PetService:
  - Menos de 3 pets → sucesso
  - 3 pets existentes → BusinessException
  - Pet de outro user → ForbiddenException
- [ ] InvoiceService:
  - Pagar PENDING → sucesso, paidAt preenchido
  - Pagar já PAID → BusinessException
- [ ] JUnit 5 + Mockito
- [ ] Repositories mockados
- [ ] Todos passando (`mvn test`)

---

## Card 13

**Título:** [CHORE] Pull Request — Arquitetura + Backend

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero abrir uma PR com a arquitetura documentada e backend completo para review.

**Critérios de Aceite:**
- [ ] Branch: `feat/backend-spring35`
- [ ] Commit seguindo conventional commits: `feat(backend): ...`
- [ ] Build sem erros (`mvn verify`)
- [ ] Testes passando
- [ ] PR aberta no GitHub com:
  - Diagrama de arquitetura (resumo)
  - Estimativa de custos
  - Lista de endpoints com métodos e paths
  - Como rodar: docker-compose up + mvn spring-boot:run
  - Swagger URL
  - Decisões técnicas


---

## Card 14

**Título:** [INFRA] Provisionar Infraestrutura AWS com Terraform

**Label:** 🟣 Infra

**Descrição:**
Como time de desenvolvimento, queremos provisionar toda a infraestrutura do Pet Care na AWS via Terraform, para ter um ambiente real e reproduzível, versionado como código.

**Critérios de Aceite:**
- [ ] Código Terraform em `/infra/terraform/` com módulos para: VPC, RDS, ECS, S3, Cognito, SQS, CloudWatch
- [ ] Variáveis configuráveis para trocar entre ambientes (dev/prod)
- [ ] Tags padrão em todos os recursos (Project=petcare, Environment=dev, ManagedBy=terraform)
- [ ] `terraform init` executa sem erros
- [ ] `terraform plan` mostra os recursos a serem criados
- [ ] `terraform apply` provisiona com sucesso na conta AWS
- [ ] Outputs exportados: RDS endpoint, S3 bucket name, Cognito User Pool ID, ECS cluster ARN
- [ ] Documento `/docs/architecture/infra-outputs.md` com os valores dos outputs
- [ ] `terraform destroy` limpa todos os recursos criados

**Serviços provisionados:**
- VPC (subnets públicas/privadas, NAT Gateway, Security Groups)
- RDS PostgreSQL (db.t3.micro, 20GB)
- ECS Fargate (cluster + service + task definition)
- S3 (bucket fotos + bucket frontend)
- Cognito (User Pool + App Client)
- SQS (fila de agendamentos)
- CloudWatch (log groups + alarmes)

**Considerações:**
- Region: us-east-1
- Profile AWS: petcare (SSO)
- Tamanhos mínimos para dev
- Destruir ao final do treinamento
