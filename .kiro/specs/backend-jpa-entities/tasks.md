# Implementation Plan: Entidades JPA e Modelagem do Banco

## Overview

Implementação das 6 entidades JPA e 6 enums do domínio Pet Care. Abordagem bottom-up: primeiro enums (sem dependências), depois entidades na ordem de dependência (User primeiro, depois Pet/Plan, depois Subscription/Appointment/Invoice).

## Tasks

- [x] 1. Criar Enums do domínio
  - [x] 1.1 Criar `Species.java` em `/model/enums/` com valores DOG, CAT, OTHER
  - [x] 1.2 Criar `PlanType.java` com valores BASIC, PLUS, PREMIUM
  - [x] 1.3 Criar `AppointmentType.java` com valores CONSULTATION, EXAM
  - [x] 1.4 Criar `AppointmentStatus.java` com valores CONFIRMED, CANCELLED
  - [x] 1.5 Criar `InvoiceStatus.java` com valores PAID, PENDING, OVERDUE
  - [x] 1.6 Criar `SubscriptionStatus.java` com valores ACTIVE, CANCELLED, EXPIRED
  - _Requirements: 7.1, 7.2_

- [x] 2. Criar entidades base
  - [x] 2.1 Criar `User.java` com id UUID, name, email (unique), cpf (unique), cognitoId (unique), planType, relacionamentos @OneToMany com Pet/Invoice/Subscription, timestamps
  - [x] 2.2 Criar `Pet.java` com id UUID, @ManyToOne User, name, species, breed, birthDate, weight, color, photoUrl, @OneToMany Appointment, timestamps
  - [x] 2.3 Criar `Plan.java` com id Long auto-increment, name, price, @ElementCollection features, active
  - _Requirements: 1.1-1.5, 2.1-2.4, 3.1-3.2_

- [x] 3. Criar entidades dependentes
  - [x] 3.1 Criar `Subscription.java` com id UUID, @ManyToOne User, @ManyToOne Plan, status, startDate, endDate
  - [x] 3.2 Criar `Appointment.java` com id UUID, @ManyToOne Pet, type, date, time, status (default CONFIRMED), createdAt
  - [x] 3.3 Criar `Invoice.java` com id UUID, @ManyToOne User, referenceMonth, amount, status, dueDate, paidAt
  - _Requirements: 4.1, 5.1, 6.1_

- [x] 4. Validar compilação
  - [x] 4.1 Executar `mvn compile` e garantir que todas as entidades compilam sem erros
  - [x] 4.2 Ajustar pom.xml para Java 17 (compatibilidade com Maven Wrapper do ambiente)
