# Requirements Document

## Introduction

Os controllers REST expõem a API do Pet Care ao frontend, seguindo convenções REST (verbos HTTP, status codes, paginação) com documentação Swagger automática. Cada controller delega para o service correspondente e recebe o userId autenticado via annotation @CurrentUser.

## Glossary

- **@CurrentUser**: Annotation customizada que injeta o UUID do usuário autenticado extraído do SecurityContext
- **CurrentUserArgumentResolver**: HandlerMethodArgumentResolver que resolve @CurrentUser a partir do Authentication.principal
- **@Valid**: Annotation Jakarta que aciona validação automática dos Request DTOs antes de chegar no método
- **Pageable**: Interface Spring Data para parâmetros de paginação (page, size, sort) via query params

## Requirements

### Requirement 1: PetController

**User Story:** Como frontend, eu quero endpoints REST para CRUD de pets, para gerenciar os animais do usuário.

#### Acceptance Criteria

1. GET /api/pets SHALL retornar PageResponse<PetResponse> paginado, filtrado pelo userId autenticado (200)
2. POST /api/pets SHALL criar pet com @Valid PetRequest, retornando PetResponse (201) ou erro de validação/limite (400/422)
3. PUT /api/pets/{id} SHALL atualizar pet com @Valid PetRequest, verificando ownership (200 ou 403)
4. DELETE /api/pets/{id} SHALL remover pet verificando ownership (204 ou 403)

### Requirement 2: AppointmentController

**User Story:** Como frontend, eu quero endpoints para agendamentos e consulta de slots disponíveis.

#### Acceptance Criteria

1. GET /api/appointments SHALL retornar PageResponse<AppointmentResponse> paginado do usuário (200)
2. POST /api/appointments SHALL criar agendamento com @Valid AppointmentRequest (201 ou 422)
3. DELETE /api/appointments/{id} SHALL cancelar agendamento verificando ownership (204 ou 403)
4. GET /api/appointments/slots?date=YYYY-MM-DD SHALL retornar List<SlotResponse> com disponibilidade (200)

### Requirement 3: InvoiceController

**User Story:** Como frontend, eu quero endpoints para listar e pagar faturas.

#### Acceptance Criteria

1. GET /api/invoices SHALL retornar PageResponse<InvoiceResponse> com filtro opcional por status via query param (200)
2. POST /api/invoices/{id}/pay SHALL marcar fatura como paga (200 ou 422 se já paga)

### Requirement 4: PlanController

**User Story:** Como frontend, eu quero listar planos sem autenticação.

#### Acceptance Criteria

1. GET /api/plans SHALL ser endpoint público (sem auth) retornando List<PlanResponse> dos planos ativos (200)

### Requirement 5: SubscriptionController e UserController

**User Story:** Como frontend, eu quero criar assinaturas e gerenciar o perfil.

#### Acceptance Criteria

1. POST /api/subscriptions SHALL criar assinatura com @Valid SubscriptionRequest (201 ou 422)
2. GET /api/users/me SHALL retornar UserResponse do usuário autenticado (200)
3. PUT /api/users/me SHALL atualizar perfil com @Valid UserUpdateRequest (200)

### Requirement 6: @CurrentUser Annotation

**User Story:** Como desenvolvedor, eu quero injetar o userId de forma limpa nos controllers.

#### Acceptance Criteria

1. @CurrentUser SHALL ser resolvida por CurrentUserArgumentResolver extraindo UUID do Authentication.principal
2. WebConfig SHALL registrar o resolver via addArgumentResolvers
3. Todos os controllers protegidos SHALL usar `@CurrentUser UUID userId` como parâmetro
