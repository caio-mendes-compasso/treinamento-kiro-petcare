# Implementation Plan: Services — Regras de Negócio

## Overview

Implementação dos services com regras de negócio do Pet Care. Primeiro as exceções customizadas (usadas por todos os services), depois cada service na ordem de complexidade.

## Tasks

- [x] 1. Criar exceções customizadas
  - [x] 1.1 Criar `BusinessException.java` (extends RuntimeException, construtor com message)
  - [x] 1.2 Criar `ResourceNotFoundException.java` (construtores: message e resource+id)
  - [x] 1.3 Criar `ForbiddenException.java` (construtor padrão com mensagem default + construtor com message)
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Implementar PetService
  - [x] 2.1 Método create: verificar countByUserId >= 3 → BusinessException, criar Pet com builder
  - [x] 2.2 Método update: ownership check, atualizar campos
  - [x] 2.3 Método delete: ownership check, deletar
  - [x] 2.4 Método updatePhotoUrl: ownership check, setar photoUrl
  - [x] 2.5 Método getPetWithOwnershipCheck: findById + verificar user.id == userId
  - _Requirements: 1.1-1.4_

- [x] 3. Implementar AppointmentService
  - [x] 3.1 Método create: validar data futura, slot válido, slot não ocupado, pet ownership, salvar
  - [x] 3.2 Método cancel: findById, ownership check, alterar status para CANCELLED
  - [x] 3.3 Método findByUser: buscar petIds do user, findByPetIdIn paginado
  - [x] 3.4 Método getAvailableSlots: buscar confirmados da data, mapear 6 slots com flag available
  - _Requirements: 2.1-2.6_

- [x] 4. Implementar InvoiceService
  - [x] 4.1 Método findByUser: suportar filtro por status (nullable), retornar PageResponse
  - [x] 4.2 Método pay: findById, ownership check, verificar status != PAID, marcar PAID + paidAt
  - _Requirements: 3.1-3.4_

- [x] 5. Implementar SubscriptionService
  - [x] 5.1 Método create: verificar existsByUserIdAndStatus ACTIVE, criar com status ACTIVE, startDate hoje, endDate +1 ano
  - _Requirements: 4.1-4.2_

- [x] 6. Implementar UserService e PlanService
  - [x] 6.1 UserService: getProfile (findById → UserResponse), updateProfile (atualizar name/cpf)
  - [x] 6.2 PlanService: findAllActive → List<PlanResponse>

- [x] 7. Validar compilação com `mvn compile`
