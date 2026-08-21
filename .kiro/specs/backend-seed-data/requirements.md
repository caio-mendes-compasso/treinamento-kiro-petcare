# Requirements Document

## Introduction

Para desenvolvimento e demonstração, o backend precisa de dados iniciais carregados automaticamente no profile "local". O data.sql insere planos, usuário de teste, pets, agendamentos, faturas e subscription para que a aplicação tenha dados realistas ao iniciar.

## Glossary

- **data.sql**: Arquivo SQL executado pelo Spring Boot após a criação das tabelas (quando spring.sql.init.mode=always)
- **Profile local**: Profile de desenvolvimento com ddl-auto: create e sql init habilitado
- **Seed data**: Dados iniciais para popular o banco durante desenvolvimento

## Requirements

### Requirement 1: Planos

**User Story:** Como desenvolvedor, eu quero 3 planos pré-cadastrados, para testar listagem e contratação.

#### Acceptance Criteria

1. SHALL criar plano Básico (id=1, R$ 49,90) com features: Consultas, Vacinas
2. SHALL criar plano Plus (id=2, R$ 89,90) com features: Consultas, Vacinas, Exames, Emergência
3. SHALL criar plano Premium (id=3, R$ 149,90) com features: Consultas, Vacinas, Exames, Emergência, Cirurgias, Internação

### Requirement 2: Usuário e Pets de Teste

**User Story:** Como desenvolvedor, eu quero dados de teste prontos, para não precisar cadastrar manualmente.

#### Acceptance Criteria

1. SHALL criar user Maria Silva (maria@email.com, CPF 12345678901, planType PLUS)
2. SHALL criar pet Thor (Golden Retriever, DOG, 32kg, nascimento 2022-03-15)
3. SHALL criar pet Luna (Siamês, CAT, 4.5kg, nascimento 2023-07-20)

### Requirement 3: Subscription

**User Story:** Como desenvolvedor, eu quero subscription ativa para testar fluxos financeiros.

#### Acceptance Criteria

1. SHALL criar subscription ACTIVE do user Maria com plano Plus, startDate 2025-01-01, endDate 2026-01-01

### Requirement 4: Agendamentos

**User Story:** Como desenvolvedor, eu quero agendamentos em diferentes estados para testar listagem e filtros.

#### Acceptance Criteria

1. SHALL criar 2 agendamentos futuros (CONFIRMED) com datas relativas (CURRENT_DATE + 7 e +14)
2. SHALL criar 2 agendamentos passados (CONFIRMED) com datas relativas (CURRENT_DATE - 30 e -60)
3. SHALL criar 1 agendamento cancelado (CANCELLED) com data passada

### Requirement 5: Faturas

**User Story:** Como desenvolvedor, eu quero 12 meses de faturas com status variados para testar filtros e pagamento.

#### Acceptance Criteria

1. SHALL criar 8 faturas com status PAID (jan-ago 2025) com paidAt preenchido
2. SHALL criar 2 faturas com status PENDING (set-out 2025) sem paidAt
3. SHALL criar 2 faturas com status OVERDUE (nov-dez 2025) sem paidAt
4. Todas as faturas SHALL ter valor R$ 89,90 (referência ao plano Plus)

### Requirement 6: Configuração Spring

**User Story:** Como desenvolvedor, eu quero que o data.sql carregue automaticamente no profile local.

#### Acceptance Criteria

1. application-local.yml SHALL ter jpa.hibernate.ddl-auto: create (recriar tabelas ao iniciar)
2. application-local.yml SHALL ter spring.jpa.defer-datasource-initialization: true
3. application-local.yml SHALL ter spring.sql.init.mode: always
4. application-test.yml SHALL ter spring.sql.init.mode: never (não carregar nos testes)
