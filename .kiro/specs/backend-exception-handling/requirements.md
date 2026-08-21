# Requirements Document

## Introduction

O backend precisa de tratamento de erros padronizado via @RestControllerAdvice, garantindo que o frontend receba respostas consistentes com formato previsível em todos os cenários de erro, sem nunca expor stacktrace ao cliente.

## Glossary

- **GlobalExceptionHandler**: Classe @RestControllerAdvice que intercepta exceções de todos os controllers
- **ErrorResponse**: DTO padrão de resposta de erro com campos timestamp, status, error, message, path
- **FieldError**: Sub-estrutura de ErrorResponse para erros de validação (field + message)
- **@RestControllerAdvice**: Annotation Spring que combina @ControllerAdvice + @ResponseBody

## Requirements

### Requirement 1: Tratamento por Tipo de Exceção

**User Story:** Como frontend, eu quero respostas de erro consistentes com status codes corretos, para exibir mensagens adequadas ao usuário.

#### Acceptance Criteria

1. ResourceNotFoundException SHALL ser mapeada para HTTP 404 com error "Not Found"
2. BusinessException SHALL ser mapeada para HTTP 422 com error "Unprocessable Entity"
3. ForbiddenException SHALL ser mapeada para HTTP 403 com error "Forbidden"
4. MethodArgumentNotValidException SHALL ser mapeada para HTTP 400 com error "Bad Request" e lista de fieldErrors [{field, message}]
5. MaxUploadSizeExceededException SHALL ser mapeada para HTTP 400 com mensagem sobre tamanho máximo
6. Exception genérica SHALL ser mapeada para HTTP 500 com mensagem genérica "Erro interno do servidor" (stacktrace apenas no log)

### Requirement 2: Formato Padronizado

**User Story:** Como frontend, eu quero um formato previsível de erro, para parsear consistentemente.

#### Acceptance Criteria

1. Todas as respostas de erro SHALL seguir o formato: { timestamp, status, error, message, path }
2. Erros de validação (400) SHALL adicionar campo fieldErrors: [{ field, message }]
3. fieldErrors SHALL ser null (omitido via @JsonInclude.NON_NULL) quando não aplicável
4. Nenhuma resposta de erro SHALL conter stacktrace ou informações internas do servidor
