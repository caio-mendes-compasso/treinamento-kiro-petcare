# Implementation Plan: Exception Handling Global

## Overview

Reescrita do GlobalExceptionHandler mínimo existente para cobrir todos os cenários de erro com formato padronizado.

## Tasks

- [x] 1. Reescrever GlobalExceptionHandler
  - [x] 1.1 Handler para ResourceNotFoundException → 404, ErrorResponse.of(404, "Not Found", message, path)
  - [x] 1.2 Handler para BusinessException → 422, ErrorResponse.of(422, "Unprocessable Entity", message, path)
  - [x] 1.3 Handler para ForbiddenException → 403, ErrorResponse.of(403, "Forbidden", message, path)
  - [x] 1.4 Handler para MethodArgumentNotValidException → 400, com fieldErrors extraídos de BindingResult
  - [x] 1.5 Handler para MaxUploadSizeExceededException → 400, mensagem sobre tamanho
  - [x] 1.6 Handler para Exception genérica → 500, log.error com stacktrace, mensagem genérica pro client
  - _Requirements: 1.1-1.6_

- [x] 2. Garantir formato padronizado
  - [x] 2.1 Usar ErrorResponse.of() para erros sem fieldErrors
  - [x] 2.2 Usar ErrorResponse.withFieldErrors() para erros de validação
  - [x] 2.3 Injetar HttpServletRequest para capturar request.getRequestURI()
  - _Requirements: 2.1-2.4_

- [x] 3. Validar compilação com `mvn compile`
