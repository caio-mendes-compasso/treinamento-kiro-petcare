# Requirements Document

## Introduction

A camada de serviço encapsula todas as regras de negócio do Pet Care. Cada service recebe o userId do SecurityContext (via @CurrentUser), valida ownership de recursos, e lança exceções tipadas para cenários de erro.

## Glossary

- **BusinessException**: Exceção lançada quando uma regra de negócio é violada (HTTP 422)
- **ResourceNotFoundException**: Exceção para recurso não encontrado (HTTP 404)
- **ForbiddenException**: Exceção quando usuário tenta acessar recurso de outro (HTTP 403)
- **Ownership Check**: Verificação se o recurso pertence ao usuário autenticado

## Requirements

### Requirement 1: PetService

**User Story:** Como desenvolvedor, eu quero regras de negócio para pets, para garantir limite de cadastro e segurança de acesso.

#### Acceptance Criteria

1. PetService.create SHALL verificar se o usuário já tem 3 pets antes de criar — se sim, lançar BusinessException com mensagem sobre limite
2. PetService.update e delete SHALL verificar se o pet pertence ao userId — se não, lançar ForbiddenException
3. PetService.findByUser SHALL retornar PageResponse paginado filtrado por userId
4. PetService.updatePhotoUrl SHALL verificar ownership antes de atualizar a URL da foto

### Requirement 2: AppointmentService

**User Story:** Como desenvolvedor, eu quero validação de agendamentos, para garantir integridade de horários e datas.

#### Acceptance Criteria

1. AppointmentService.create SHALL validar que date é futura — se não, lançar BusinessException
2. AppointmentService.create SHALL validar que time é um slot válido (09:00, 10:00, 11:00, 14:00, 15:00, 16:00) — se não, lançar BusinessException
3. AppointmentService.create SHALL validar que o slot não está ocupado (existsByDateAndTimeAndStatus CONFIRMED) — se ocupado, lançar BusinessException
4. AppointmentService.create SHALL validar que o pet pertence ao userId — se não, lançar ForbiddenException
5. AppointmentService.cancel SHALL verificar ownership via pet.user.id e alterar status para CANCELLED
6. AppointmentService.getAvailableSlots SHALL retornar os 6 slots com flag available baseado nos agendamentos confirmados da data

### Requirement 3: InvoiceService

**User Story:** Como desenvolvedor, eu quero regras de pagamento de faturas, para evitar pagamentos duplicados.

#### Acceptance Criteria

1. InvoiceService.pay SHALL verificar ownership da fatura — se não pertence ao userId, lançar ForbiddenException
2. InvoiceService.pay SHALL verificar que status não é PAID — se já paga, lançar BusinessException
3. InvoiceService.pay SHALL alterar status para PAID e preencher paidAt com LocalDateTime.now()
4. InvoiceService.findByUser SHALL suportar filtro opcional por InvoiceStatus, retornando PageResponse

### Requirement 4: SubscriptionService

**User Story:** Como desenvolvedor, eu quero validar assinaturas duplicadas, para evitar múltiplas assinaturas ativas.

#### Acceptance Criteria

1. SubscriptionService.create SHALL verificar se o usuário já tem subscription com status ACTIVE — se sim, lançar BusinessException
2. SubscriptionService.create SHALL criar subscription com status ACTIVE, startDate hoje e endDate em 1 ano

### Requirement 5: Exceções Customizadas

**User Story:** Como desenvolvedor, eu quero exceções tipadas, para que cada cenário de erro tenha tratamento adequado.

#### Acceptance Criteria

1. BusinessException SHALL estender RuntimeException e ser mapeada para HTTP 422
2. ResourceNotFoundException SHALL estender RuntimeException, aceitar (resource, id) no construtor, e ser mapeada para HTTP 404
3. ForbiddenException SHALL estender RuntimeException com mensagem padrão "Acesso negado a este recurso" e ser mapeada para HTTP 403
