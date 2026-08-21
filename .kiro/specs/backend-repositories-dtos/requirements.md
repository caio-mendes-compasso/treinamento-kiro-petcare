# Requirements Document

## Introduction

O backend precisa de uma camada de acesso a dados (repositories) com queries customizadas e DTOs (Data Transfer Objects) como Java records para transferir dados entre camadas de forma segura, sem expor entidades diretamente nas respostas da API.

## Glossary

- **Repository**: Interface Spring Data JPA que provê métodos de acesso ao banco de dados
- **DTO**: Data Transfer Object — objeto imutável usado para entrada (Request) ou saída (Response) da API
- **Java Record**: Tipo imutável do Java 16+ ideal para DTOs (gera equals, hashCode, toString automaticamente)
- **PageResponse**: DTO genérico para respostas paginadas
- **Jakarta Validation**: Anotações de validação (@NotNull, @NotBlank, @Email, etc.) aplicadas nos Request DTOs

## Requirements

### Requirement 1: Repositories com Queries Customizadas

**User Story:** Como desenvolvedor, eu quero repositories Spring Data com métodos de consulta específicos, para acessar os dados de forma eficiente.

#### Acceptance Criteria

1. UserRepository SHALL expor findByEmail, findByCognitoId, existsByEmail, existsByCpf
2. PetRepository SHALL expor findByUserId (List e Page), countByUserId
3. PlanRepository SHALL expor findByActiveTrue
4. SubscriptionRepository SHALL expor findByUserIdAndStatus, existsByUserIdAndStatus
5. AppointmentRepository SHALL expor findByPetIdIn (paginado com @Query), findByDateAndStatus, existsByDateAndTimeAndStatus
6. InvoiceRepository SHALL expor findByUserId (paginado), findByUserIdAndStatus (paginado)

### Requirement 2: DTOs como Java Records

**User Story:** Como desenvolvedor, eu quero DTOs tipados e imutáveis, para garantir contratos claros entre API e clientes.

#### Acceptance Criteria

1. Request DTOs SHALL ser Java records com validações Jakarta: PetRequest (@NotBlank name, @NotNull species), AppointmentRequest (@NotNull petId/type/date/time, @Future date), UserUpdateRequest, SubscriptionRequest (@NotNull planId), AuthRequest, RegisterRequest, RefreshRequest
2. Response DTOs SHALL ser Java records com método estático `from(Entity)`: PetResponse, AppointmentResponse (inclui petName), InvoiceResponse, UserResponse (CPF mascarado), PlanResponse, SlotResponse, AuthResponse
3. PageResponse<T> SHALL ser um record genérico com campos content, page, size, totalElements, totalPages, last e método estático `from(Page, Function)` para converter páginas de entidades
4. ErrorResponse SHALL incluir timestamp, status, error, message, path e fieldErrors (nullable) com inner record FieldError(field, message)
