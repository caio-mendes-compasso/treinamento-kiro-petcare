# Implementation Plan: Repositories e DTOs

## Overview

Criação de 6 repositories Spring Data JPA e 16 DTOs como Java records. Repositories primeiro (dependem apenas das entidades), depois DTOs (dependem das entidades para os métodos `from()`).

## Tasks

- [x] 1. Criar Repositories
  - [x] 1.1 Criar `UserRepository.java` com findByEmail, findByCognitoId, existsByEmail, existsByCpf
  - [x] 1.2 Criar `PetRepository.java` com findByUserId (List e Page), countByUserId
  - [x] 1.3 Criar `PlanRepository.java` com findByActiveTrue
  - [x] 1.4 Criar `SubscriptionRepository.java` com findByUserIdAndStatus, existsByUserIdAndStatus
  - [x] 1.5 Criar `AppointmentRepository.java` com @Query findByPetIdIn, findByDateAndStatus, existsByDateAndTimeAndStatus
  - [x] 1.6 Criar `InvoiceRepository.java` com findByUserId, findByUserIdAndStatus (ambos paginados)
  - _Requirements: 1.1-1.6_

- [x] 2. Criar Request DTOs
  - [x] 2.1 Criar `PetRequest.java` com validações @NotBlank, @NotNull, @Past, @Positive
  - [x] 2.2 Criar `AppointmentRequest.java` com @NotNull, @Future
  - [x] 2.3 Criar `UserUpdateRequest.java` com @Size
  - [x] 2.4 Criar `SubscriptionRequest.java` com @NotNull planId
  - _Requirements: 2.1_

- [x] 3. Criar Response DTOs
  - [x] 3.1 Criar `PetResponse.java` com from(Pet)
  - [x] 3.2 Criar `AppointmentResponse.java` com from(Appointment) incluindo petName
  - [x] 3.3 Criar `InvoiceResponse.java` com from(Invoice) e @JsonFormat nas datas
  - [x] 3.4 Criar `UserResponse.java` com from(User) e mascaramento de CPF
  - [x] 3.5 Criar `PlanResponse.java` com from(Plan)
  - [x] 3.6 Criar `SlotResponse.java` com time e available
  - _Requirements: 2.2_

- [x] 4. Criar DTOs utilitários
  - [x] 4.1 Criar `PageResponse.java` genérico com from(Page, Function)
  - [x] 4.2 Criar `ErrorResponse.java` com FieldError inner record e métodos factory
  - _Requirements: 2.3, 2.4_

- [x] 5. Validar compilação com `mvn compile`
