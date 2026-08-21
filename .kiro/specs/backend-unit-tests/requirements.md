# Requirements Document

## Introduction

Testes unitários com JUnit 5 + Mockito para validar todas as regras de negócio dos services, protegendo contra regressões. Repositories são mockados, foco na lógica do service.

## Glossary

- **@ExtendWith(MockitoExtension.class)**: Habilita mocks do Mockito no JUnit 5
- **@Mock**: Cria mock de um repository/dependência
- **@InjectMocks**: Injeta mocks no service sendo testado
- **AssertJ**: Biblioteca fluent de assertions usada nos testes (assertThat)

## Requirements

### Requirement 1: Testes do PetService

**User Story:** Como desenvolvedor, eu quero testes que validem regras de pets, para garantir que limites e ownership funcionam.

#### Acceptance Criteria

1. SHALL testar criação de pet com sucesso quando usuário tem menos de 3 pets
2. SHALL testar que BusinessException é lançada quando usuário já tem 3 pets
3. SHALL testar que ForbiddenException é lançada ao acessar pet de outro usuário
4. SHALL testar deleção com sucesso quando pet pertence ao usuário
5. SHALL testar que ResourceNotFoundException é lançada quando pet não existe

### Requirement 2: Testes do AppointmentService

**User Story:** Como desenvolvedor, eu quero testes que validem regras de agendamento.

#### Acceptance Criteria

1. SHALL testar criação com slot disponível → sucesso com dados corretos
2. SHALL testar que BusinessException é lançada quando slot está ocupado
3. SHALL testar que BusinessException é lançada quando data é passada
4. SHALL testar que BusinessException é lançada quando horário é inválido
5. SHALL testar cancelamento com sucesso → status CANCELLED
6. SHALL testar que ForbiddenException é lançada ao cancelar agendamento de outro usuário
7. SHALL testar getAvailableSlots retornando 6 slots com flags de disponibilidade corretas

### Requirement 3: Testes do InvoiceService

**User Story:** Como desenvolvedor, eu quero testes que validem regras de pagamento de faturas.

#### Acceptance Criteria

1. SHALL testar pagamento de fatura PENDING → sucesso, status PAID, paidAt preenchido
2. SHALL testar pagamento de fatura OVERDUE → sucesso
3. SHALL testar que BusinessException é lançada ao pagar fatura já PAID
4. SHALL testar que ForbiddenException é lançada ao pagar fatura de outro usuário
5. SHALL testar que ResourceNotFoundException é lançada quando fatura não existe
