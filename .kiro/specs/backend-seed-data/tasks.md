# Implementation Plan: Dados Iniciais para Desenvolvimento

## Overview

Criação do data.sql com seed data completa e configuração dos profiles para carregamento automático.

## Tasks

- [x] 1. Criar data.sql
  - [x] 1.1 INSERT 3 planos com IDs sequenciais (1, 2, 3) + features na tabela plan_features
  - [x] 1.2 INSERT user Maria Silva com UUID fixo, email maria@email.com, CPF, planType PLUS
  - [x] 1.3 INSERT 2 pets (Thor, Luna) com UUIDs fixos referenciando user_id da Maria
  - [x] 1.4 INSERT 1 subscription ACTIVE referenciando user e plan
  - [x] 1.5 INSERT 5 appointments: 2 futuros (CURRENT_DATE + 7/14), 2 passados (-30/-60), 1 cancelado (-15)
  - [x] 1.6 INSERT 12 faturas: 8 PAID (jan-ago com paidAt), 2 PENDING (set-out), 2 OVERDUE (nov-dez)
  - _Requirements: 1.1-5.4_

- [x] 2. Configurar profiles
  - [x] 2.1 Alterar application-local.yml: ddl-auto → create, adicionar defer-datasource-initialization: true, sql.init.mode: always
  - [x] 2.2 Adicionar sql.init.mode: never no application-test.yml
  - _Requirements: 6.1-6.4_

- [x] 3. Verificar que testes continuam passando (`mvn test` → 18/18)
