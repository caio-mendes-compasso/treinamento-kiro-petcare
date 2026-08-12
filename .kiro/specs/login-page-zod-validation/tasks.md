# Implementation Plan: Login Page Zod Validation

## Overview

Implementação de um formulário de login com validação client-side usando Zod para o sistema Pet Care. O plano segue uma abordagem incremental: primeiro o schema de validação, depois o componente Toast, seguido pelo componente LoginForm com toda a lógica de validação, submissão e acessibilidade, e finalmente a integração com a página de login existente.

## Tasks

- [x] 1. Definir o schema Zod e tipos de validação
  - [x] 1.1 Adicionar loginSchema e LoginFormData ao arquivo `/types/auth.ts`
    - Importar `z` do Zod
    - Criar `loginSchema` com validação de email (non-empty, max 254, formato email) e senha (min 6, max 128)
    - Mensagens de erro: "Email inválido" para email, "Senha deve ter no mínimo 6 caracteres" para senha
    - Exportar `LoginFormData` usando `z.infer<typeof loginSchema>`
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Write property test for email validation (Property 1)
    - **Property 1: Email validation correctness**
    - Criar arquivo `__tests__/types/loginSchema.property.test.ts`
    - Testar que emails válidos (non-empty, max 254, formato correto) são aceitos
    - Testar que emails inválidos (empty, formato errado, > 254 chars) são rejeitados com "Email inválido"
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 1.1**

  - [x] 1.3 Write property test for senha validation (Property 2)
    - **Property 2: Senha validation correctness**
    - No mesmo arquivo `__tests__/types/loginSchema.property.test.ts`
    - Testar que senhas com 6-128 caracteres são aceitas
    - Testar que senhas com < 6 caracteres são rejeitadas com "Senha deve ter no mínimo 6 caracteres"
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 1.2**

- [x] 2. Criar componente Toast
  - [x] 2.1 Implementar componente `/components/ui/Toast.tsx`
    - Criar componente client-side com props: `message`, `visible`, `onClose`
    - Exibir notificação fixa na tela com animação de entrada/saída
    - Auto-dismiss após 3 segundos via `setTimeout`
    - Botão de fechar para dismiss manual
    - Usar `role="alert"` para acessibilidade
    - Estilizar com Tailwind seguindo a identidade visual (bg-white, shadow-md, border-primary-500)
    - _Requirements: 4.6_

- [x] 3. Checkpoint - Validar schema e Toast
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implementar componente LoginForm
  - [x] 4.1 Criar estrutura base do componente `/components/auth/LoginForm.tsx`
    - Criar componente client-side com estado local para email, senha, errors, generalError, isSubmitting, showToast
    - Renderizar form com `onSubmit` handler
    - Campos de input com `type="email"` e `type="password"`
    - Labels associadas via `htmlFor`/`id`
    - Botão submit com texto "Entrar" e estilo `bg-primary-500 text-white w-full`
    - Link "Esqueci minha senha" abaixo do botão com cor `text-primary-500`
    - Card container com `bg-white rounded-lg shadow-md p-6 md:p-8 w-full max-w-md`
    - _Requirements: 4.2, 4.4, 4.5, 5.1, 5.5, 5.6_

  - [x] 4.2 Implementar validação onBlur com Zod
    - Validar campo individual contra `loginSchema` no evento `onBlur`
    - Exibir mensagem de Validation_Error em elemento abaixo do campo
    - Associar erro ao campo via `aria-describedby`
    - Remover erro quando campo é corrigido e onBlur dispara novamente
    - Setar `aria-invalid="true"` em campos com erro
    - _Requirements: 1.3, 1.4, 1.6, 5.2_

  - [x] 4.3 Implementar validação no submit e focus management
    - Validar todos os campos com `loginSchema.safeParse()` no submit
    - Prevenir envio se houver erros de validação
    - Exibir todos os erros simultaneamente
    - Mover focus para o primeiro campo com erro (ordem DOM)
    - Setar `aria-invalid="true"` em todos os campos com erro
    - _Requirements: 1.5, 1.7, 5.3_

  - [x] 4.4 Implementar submissão e integração com AuthContext
    - Chamar `login(email, senha)` do `useAuth()` quando validação passa
    - Limpar `generalError` antes de iniciar autenticação
    - Alterar botão para "Entrando..." com spinner e `aria-busy="true"`
    - Desabilitar botão durante submissão
    - Em caso de sucesso: redirecionar para `/pets` via `router.push()`
    - Em caso de falha: exibir General_Error "Email ou senha inválidos"
    - Preservar valores dos campos em caso de falha
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.4_

  - [x] 4.5 Implementar funcionalidade do link "Esqueci minha senha"
    - Ao clicar, setar `showToast = true` com mensagem "Funcionalidade em breve"
    - Renderizar componente Toast condicionalmente
    - Toast deve permanecer visível por pelo menos 3 segundos
    - _Requirements: 4.6_

- [x] 5. Checkpoint - Validar LoginForm isolado
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integrar LoginForm na página de login
  - [x] 6.1 Atualizar `/app/login/page.tsx` para renderizar LoginForm
    - Importar e renderizar `LoginForm` no lugar do `<h1>Login</h1>` atual
    - Manter lógica existente de redirecionamento e loading spinner
    - Centralizar verticalmente e horizontalmente com `min-h-screen`
    - Adicionar título "Pet Care" como heading visível acima do form
    - Garantir layout responsivo a partir de 320px de largura
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.3, 4.7_

  - [x] 6.2 Write property test for form values preserved on login failure (Property 3)
    - **Property 3: Form values preserved on login failure**
    - Criar arquivo `__tests__/components/LoginForm.property.test.tsx`
    - Para qualquer par email/senha válido, se login retorna false, campos mantêm os mesmos valores
    - Usar fast-check com mínimo 100 iterações
    - Mock do AuthContext com login retornando false
    - **Validates: Requirements 2.7**

  - [x] 6.3 Write unit tests for LoginForm
    - Criar arquivo `__tests__/components/LoginForm.test.tsx`
    - Testar validação onBlur (email inválido, senha curta)
    - Testar submit com campos vazios (exibe ambos os erros)
    - Testar submit com sucesso (redirect para /pets)
    - Testar estado de loading (texto "Entrando...", botão disabled)
    - Testar General_Error após falha de login
    - Testar toast "Funcionalidade em breve"
    - Testar atributos de acessibilidade (aria-describedby, aria-invalid, aria-busy, labels, input types)
    - _Requirements: 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 6.4 Write unit tests for LoginPage
    - Criar arquivo `__tests__/app/LoginPage.test.tsx`
    - Testar redirect quando usuário já autenticado
    - Testar loading spinner enquanto isLoading
    - Testar renderização do LoginForm quando não autenticado
    - Testar que LoginForm não é renderizado durante redirect
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- O projeto já possui Vitest, fast-check e @testing-library/react configurados
- O AuthContext existente em `/contexts/AuthContext.tsx` não precisa ser alterado
- A identidade visual segue a paleta definida com primary-500 (#0D7377)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["4.2", "4.5"] },
    { "id": 4, "tasks": ["4.3"] },
    { "id": 5, "tasks": ["4.4"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "6.4"] }
  ]
}
```
