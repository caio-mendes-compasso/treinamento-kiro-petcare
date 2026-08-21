# Design Document: Testes Unitários do Backend

## Overview

Testes unitários puros (sem Spring context) focados na lógica dos services. Mockito isola dependências (repositories), AssertJ provê assertions expressivas.

### Decisões de Design

- **Sem @SpringBootTest**: Testes unitários não precisam de contexto Spring — mais rápidos
- **@ExtendWith(MockitoExtension.class)**: Inicializa mocks sem o overhead do Spring
- **AssertJ ao invés de JUnit assertions**: assertThat é mais legível e fluent
- **assertThatThrownBy**: Padrão AssertJ para testar exceções com verificação de tipo e mensagem
- **Nomenclatura em inglês (should_x_when_y)**: Padrão adotado para clareza

## Architecture

```mermaid
graph LR
    T[Test Class] --> S[Service @InjectMocks]
    S --> R[@Mock Repository]

    subgraph Test Setup
        BF[@BeforeEach] --> M[Mock data - userId, user, pet]
    end
```

## File Structure

```
backend/src/test/java/com/petcare/api/service/
├── PetServiceTest.java (5 testes)
├── AppointmentServiceTest.java (7 testes)
└── InvoiceServiceTest.java (5 testes)
```
