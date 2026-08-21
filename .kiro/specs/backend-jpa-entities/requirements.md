# Requirements Document

## Introduction

O backend do Pet Care precisa de um modelo de domínio bem definido representado como entidades JPA, que será a base para toda a persistência de dados. As entidades devem representar corretamente os relacionamentos entre usuários, pets, planos, assinaturas, agendamentos e faturas, seguindo as convenções do projeto (UUID para IDs de domínio, snake_case para tabelas, Lombok para redução de boilerplate).

## Glossary

- **User**: Usuário cadastrado no sistema (tutor de pets)
- **Pet**: Animal de estimação vinculado a um usuário
- **Plan**: Plano de saúde disponível para contratação (Básico, Plus, Premium)
- **Subscription**: Assinatura de um plano por um usuário
- **Appointment**: Agendamento de consulta ou exame para um pet
- **Invoice**: Fatura mensal gerada para o usuário
- **Species**: Enum representando a espécie do animal (DOG, CAT, OTHER)
- **PlanType**: Enum representando o tipo de plano (BASIC, PLUS, PREMIUM)
- **SubscriptionStatus**: Enum representando status da assinatura (ACTIVE, CANCELLED, EXPIRED)
- **AppointmentType**: Enum representando tipo de agendamento (CONSULTATION, EXAM)
- **AppointmentStatus**: Enum representando status do agendamento (CONFIRMED, CANCELLED)
- **InvoiceStatus**: Enum representando status da fatura (PAID, PENDING, OVERDUE)

## Requirements

### Requirement 1: Entidade User

**User Story:** Como desenvolvedor, eu quero a entidade User modelada com JPA, para que o domínio de usuários esteja representado no banco de dados.

#### Acceptance Criteria

1. A entidade User SHALL ter id (UUID, gerado automaticamente), name (string, not null), email (string, unique, not null), cpf (string, unique), cognitoId (string, unique), planType (enum PlanType)
2. A entidade User SHALL ter campos de auditoria createdAt e updatedAt com @CreationTimestamp e @UpdateTimestamp
3. A entidade User SHALL ter relacionamento @OneToMany com Pet, Invoice e Subscription (mappedBy, cascade ALL, orphanRemoval true)
4. A tabela SHALL ser nomeada "users" via @Table(name = "users")
5. A entidade SHALL usar Lombok: @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor

### Requirement 2: Entidade Pet

**User Story:** Como desenvolvedor, eu quero a entidade Pet modelada, para que os animais dos usuários estejam representados no banco.

#### Acceptance Criteria

1. A entidade Pet SHALL ter id (UUID), user (FK @ManyToOne para User), name (not null), species (enum Species, not null), breed, birthDate, weight, color, photoUrl
2. A entidade Pet SHALL ter campos createdAt e updatedAt com timestamps automáticos
3. A entidade Pet SHALL ter @OneToMany para Appointment (mappedBy, cascade ALL, orphanRemoval true)
4. A tabela SHALL ser nomeada "pets"

### Requirement 3: Entidade Plan

**User Story:** Como desenvolvedor, eu quero a entidade Plan com features como ElementCollection, para representar os planos disponíveis.

#### Acceptance Criteria

1. A entidade Plan SHALL ter id (Long, auto-increment), name (not null), price (BigDecimal, not null), features (List<String> via @ElementCollection), active (Boolean, default true)
2. A tabela de features SHALL ser nomeada "plan_features" com coluna "feature"

### Requirement 4: Entidade Subscription

**User Story:** Como desenvolvedor, eu quero a entidade Subscription, para representar assinaturas de planos pelos usuários.

#### Acceptance Criteria

1. A entidade Subscription SHALL ter id (UUID), user (FK), plan (FK), status (enum SubscriptionStatus, not null), startDate (not null), endDate

### Requirement 5: Entidade Appointment

**User Story:** Como desenvolvedor, eu quero a entidade Appointment, para representar agendamentos de consultas e exames.

#### Acceptance Criteria

1. A entidade Appointment SHALL ter id (UUID), pet (FK @ManyToOne), type (enum AppointmentType, not null), date (LocalDate, not null), time (LocalTime, not null), status (enum AppointmentStatus, default CONFIRMED), createdAt

### Requirement 6: Entidade Invoice

**User Story:** Como desenvolvedor, eu quero a entidade Invoice, para representar faturas mensais dos usuários.

#### Acceptance Criteria

1. A entidade Invoice SHALL ter id (UUID), user (FK), referenceMonth (string, not null), amount (BigDecimal, not null), status (enum InvoiceStatus, not null), dueDate (LocalDate, not null), paidAt (LocalDateTime, nullable)

### Requirement 7: Enums do Domínio

**User Story:** Como desenvolvedor, eu quero enums tipados para representar estados e categorias do domínio.

#### Acceptance Criteria

1. SHALL existir 6 enums: Species (DOG, CAT, OTHER), PlanType (BASIC, PLUS, PREMIUM), SubscriptionStatus (ACTIVE, CANCELLED, EXPIRED), AppointmentType (CONSULTATION, EXAM), AppointmentStatus (CONFIRMED, CANCELLED), InvoiceStatus (PAID, PENDING, OVERDUE)
2. Todos os enums SHALL ser persistidos como STRING via @Enumerated(EnumType.STRING)
