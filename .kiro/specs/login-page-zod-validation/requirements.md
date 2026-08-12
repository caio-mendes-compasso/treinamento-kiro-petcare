# Requirements Document

## Introduction

Página de Login com validação Zod para o sistema Pet Care. Permite que usuários cadastrados acessem sua área restrita através de um formulário seguro com feedback claro sobre erros de credenciais. O formulário utiliza validação client-side com Zod para garantir dados corretos antes do envio, e consome o AuthContext existente para autenticação via mock.

## Glossary

- **Login_Page**: Página localizada em `/app/login/page.tsx` que exibe o formulário de autenticação do usuário
- **Login_Form**: Componente client-side (`/components/auth/LoginForm.tsx`) que encapsula os campos de email e senha com validação Zod
- **Login_Schema**: Schema Zod definido em `/types/auth.ts` que valida os campos email e senha do formulário
- **Auth_Context**: Context API do React (`/contexts/AuthContext.tsx`) que gerencia estado de autenticação e expõe o método `login(email, senha)`
- **User**: Pessoa cadastrada que deseja acessar a área restrita do sistema Pet Care
- **Validation_Error**: Mensagem de erro exibida inline abaixo de um campo quando o valor não atende às regras do Login_Schema
- **General_Error**: Mensagem de erro exibida acima ou abaixo do formulário quando as credenciais são rejeitadas pelo Auth_Context

## Requirements

### Requirement 1: Validação de Campos com Zod

**User Story:** As a User, I want my login form inputs to be validated before submission, so that I receive immediate feedback about invalid data.

#### Acceptance Criteria

1. THE Login_Schema SHALL validate the email field as a non-empty string with a maximum length of 254 characters in valid email format, producing the error message "Email inválido" when the value is empty or not a valid email format
2. THE Login_Schema SHALL validate the senha field as a string with minimum length of 6 characters and maximum length of 128 characters, producing the error message "Senha deve ter no mínimo 6 caracteres" when the value has fewer than 6 characters
3. WHEN a User leaves the email field (onBlur event), THE Login_Form SHALL validate the email field against the Login_Schema and display the Validation_Error in a visible text element immediately below the email input field, associated via aria-describedby
4. WHEN a User leaves the senha field (onBlur event), THE Login_Form SHALL validate the senha field against the Login_Schema and display the Validation_Error in a visible text element immediately below the senha input field, associated via aria-describedby
5. WHEN a User submits the Login_Form with one or more invalid fields, THE Login_Form SHALL prevent submission and display all Validation_Errors below their respective fields simultaneously
6. WHEN a User modifies a field value that currently displays a Validation_Error and then triggers the next onBlur event on that field, THE Login_Form SHALL re-validate the field and remove the Validation_Error if the field value now passes validation
7. IF the Login_Form is submitted and all fields are empty, THEN THE Login_Form SHALL display Validation_Errors for both the email and senha fields simultaneously

### Requirement 2: Submissão e Autenticação

**User Story:** As a User, I want to submit my credentials and be authenticated, so that I can access my restricted area.

#### Acceptance Criteria

1. WHEN a User submits the Login_Form with fields that pass client-side validation (non-empty email in valid format and non-empty senha), THE Login_Form SHALL call Auth_Context.login with the email and senha values
2. WHILE the Auth_Context.login call is in progress, THE Login_Form SHALL replace the submit button label with the text "Entrando..." and display a spinner indicator on the submit button
3. WHILE the Auth_Context.login call is in progress, THE Login_Form SHALL disable the submit button to prevent duplicate submissions
4. WHEN Auth_Context.login returns success (true), THE Login_Page SHALL redirect the User to the `/pets` route
5. WHEN Auth_Context.login returns failure (false), THE Login_Form SHALL display a General_Error message indicating that the email or password is invalid
6. WHEN a User submits the Login_Form with valid fields, THE Login_Form SHALL clear any previously displayed General_Error before initiating authentication
7. WHEN Auth_Context.login returns failure (false), THE Login_Form SHALL preserve the current values in the email and senha fields so the User can correct and retry without re-entering all data

### Requirement 3: Redirecionamento de Usuário Autenticado

**User Story:** As an authenticated User, I want to be automatically redirected from the login page, so that I do not see a login form when I am already logged in.

#### Acceptance Criteria

1. WHEN an authenticated User navigates to the Login_Page, THE Login_Page SHALL redirect the User to the `/pets` route without rendering the Login_Form at any point during the redirect process
2. WHILE the Auth_Context `isLoading` property is `true`, THE Login_Page SHALL display an accessible loading spinner (with `role="status"` and a screen-reader-only text label) instead of the Login_Form
3. IF the Auth_Context finishes loading and `isAuthenticated` is `true` but the redirect has not yet completed, THEN THE Login_Page SHALL render no visible content instead of displaying the Login_Form

### Requirement 4: Layout e Apresentação Visual

**User Story:** As a User, I want the login page to be visually clear and centered, so that I can easily identify and use the login form.

#### Acceptance Criteria

1. THE Login_Page SHALL center the Login_Form vertically and horizontally within the viewport using full viewport height (min-h-screen)
2. THE Login_Form SHALL be contained within a white card with rounded corners (rounded-lg), shadow (shadow-md), internal padding, and a maximum width of 448px (max-w-md)
3. THE Login_Page SHALL display the title "Pet Care" as a visible heading above the Login_Form
4. THE Login_Form SHALL display the submit button with background color primary-500, white text, and width spanning the full width of the form container
5. THE Login_Form SHALL display a "Esqueci minha senha" link positioned below the submit button and styled as a text link with primary-500 color
6. WHEN a User activates the "Esqueci minha senha" link, THE Login_Page SHALL display a toast notification with the text "Funcionalidade em breve" that remains visible for at least 3 seconds or until the user dismisses it
7. THE Login_Page SHALL maintain the centered card layout on viewports from 320px width and above, with the card adapting its horizontal padding for viewports at or above the md breakpoint (768px)

### Requirement 5: Acessibilidade

**User Story:** As a User using assistive technology, I want the login form to be fully accessible, so that I can authenticate without barriers.

#### Acceptance Criteria

1. THE Login_Form SHALL associate each label element with its corresponding input field via matching htmlFor and id attributes
2. THE Login_Form SHALL associate each Validation_Error with its corresponding input field via aria-describedby attribute, where the aria-describedby value references the id of the error message element
3. WHEN a User submits the Login_Form with validation errors, THE Login_Form SHALL move focus to the first field in DOM order that contains an error and set aria-invalid="true" on each field that has a validation error
4. WHILE the Auth_Context.login call is in progress, THE submit button SHALL indicate the busy state via aria-busy attribute set to "true" and SHALL be disabled to prevent duplicate submissions
5. THE Login_Form SHALL use semantic HTML form elements including a form tag with an onSubmit handler
6. THE Login_Form SHALL set the input type attribute to "email" for the email field and "password" for the senha field so that assistive technologies can convey the expected input format
