# Implementation Plan: Controllers — Endpoints REST

## Overview

Implementação dos 6 controllers REST com Swagger annotations. Primeiro a infraestrutura de resolução do @CurrentUser, depois os controllers individuais.

## Tasks

- [x] 1. Criar infraestrutura @CurrentUser
  - [x] 1.1 Criar annotation `@CurrentUser` em `/security/CurrentUser.java` (ElementType.PARAMETER, RUNTIME)
  - [x] 1.2 Criar `CurrentUserArgumentResolver.java` que extrai UUID do Authentication.principal
  - [x] 1.3 Criar `WebConfig.java` implementando WebMvcConfigurer.addArgumentResolvers
  - _Requirements: 6.1, 6.2_

- [x] 2. Criar PetController
  - [x] 2.1 GET / com @CurrentUser + Pageable → PageResponse<PetResponse>
  - [x] 2.2 POST / com @Valid @RequestBody PetRequest → ResponseEntity 201
  - [x] 2.3 PUT /{id} com @Valid @RequestBody PetRequest → PetResponse
  - [x] 2.4 DELETE /{id} → ResponseEntity 204
  - _Requirements: 1.1-1.4_

- [x] 3. Criar AppointmentController
  - [x] 3.1 GET / com Pageable → PageResponse<AppointmentResponse>
  - [x] 3.2 POST / com @Valid → ResponseEntity 201
  - [x] 3.3 DELETE /{id} → ResponseEntity 204
  - [x] 3.4 GET /slots?date= com @DateTimeFormat → List<SlotResponse>
  - _Requirements: 2.1-2.4_

- [x] 4. Criar InvoiceController
  - [x] 4.1 GET / com status (optional) + Pageable → PageResponse<InvoiceResponse>
  - [x] 4.2 POST /{id}/pay → InvoiceResponse
  - _Requirements: 3.1-3.2_

- [x] 5. Criar PlanController, SubscriptionController, UserController
  - [x] 5.1 PlanController: GET / → List<PlanResponse>
  - [x] 5.2 SubscriptionController: POST / → ResponseEntity 201
  - [x] 5.3 UserController: GET /me, PUT /me
  - _Requirements: 4.1, 5.1-5.3_

- [x] 6. Adicionar Swagger annotations (@Tag, @Operation, @ApiResponse) em todos os controllers

- [x] 7. Validar compilação com `mvn compile`
