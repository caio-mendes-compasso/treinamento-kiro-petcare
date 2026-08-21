# Implementation Plan: Testes Unitários do Backend

## Overview

Criação de 17 testes unitários cobrindo PetService (5), AppointmentService (7) e InvoiceService (5). H2 adicionado como dependência de teste para o context load test existente.

## Tasks

- [x] 1. Setup
  - [x] 1.1 Adicionar dependência H2 (scope test) no pom.xml para PetcareApiApplicationTests
  - _Requirements: implícita_

- [x] 2. Criar PetServiceTest
  - [x] 2.1 should_create_pet_when_under_limit: mock countByUserId=2, verify save called
  - [x] 2.2 should_throw_when_pet_limit_reached: mock countByUserId=3, assertThatThrownBy BusinessException
  - [x] 2.3 should_throw_forbidden_when_pet_belongs_to_other_user: mock pet com outro userId
  - [x] 2.4 should_delete_pet_when_owner: mock pet com userId correto, verify delete called
  - [x] 2.5 should_throw_not_found_when_pet_missing: mock findById empty
  - _Requirements: 1.1-1.5_

- [x] 3. Criar AppointmentServiceTest
  - [x] 3.1 should_create_appointment_when_slot_available: all validations pass, verify save
  - [x] 3.2 should_throw_when_slot_occupied: mock existsByDateAndTimeAndStatus=true
  - [x] 3.3 should_throw_when_date_in_past: use LocalDate.now().minusDays(1)
  - [x] 3.4 should_throw_when_time_invalid: use LocalTime.of(12, 0)
  - [x] 3.5 should_cancel_appointment: verify status changed to CANCELLED
  - [x] 3.6 should_throw_forbidden_when_cancelling_other_user_appointment
  - [x] 3.7 should_return_slots_with_availability: 1 occupied → 5 available + 1 unavailable
  - _Requirements: 2.1-2.7_

- [x] 4. Criar InvoiceServiceTest
  - [x] 4.1 should_pay_pending_invoice: status PENDING → PAID, paidAt set
  - [x] 4.2 should_pay_overdue_invoice: status OVERDUE → PAID
  - [x] 4.3 should_throw_when_invoice_already_paid: status PAID → BusinessException
  - [x] 4.4 should_throw_forbidden_when_invoice_belongs_to_other_user
  - [x] 4.5 should_throw_not_found_when_invoice_missing
  - _Requirements: 3.1-3.5_

- [x] 5. Executar `mvn test` e confirmar 18/18 passando
