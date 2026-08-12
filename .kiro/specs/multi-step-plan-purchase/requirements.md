# Requirements Document

## Introduction

Fluxo multi-step para contratação de plano de saúde pet na rota `/planos`. O fluxo é acessível tanto por visitantes quanto por usuários logados, sem pré-preenchimento de dados. A interface guia o usuário por 4 etapas (escolha do plano, dados do tutor, dados do pet, resumo e confirmação) com validação por etapa, stepper visual de progresso e simulação local de contratação (sem chamadas HTTP reais).

## Glossary

- **Plan_Purchase_Flow**: Componente Client Component na rota `/planos` que gerencia o fluxo multi-step de contratação de plano via estado interno com useReducer
- **Stepper**: Indicador visual fixo no topo do fluxo que exibe as 4 etapas e destaca a etapa atual
- **Plan_Card**: Card interativo que exibe nome, preço e benefícios de um plano disponível para seleção
- **Tutor_Form**: Formulário da etapa 2 para captura de dados pessoais do responsável pelo pet
- **Pet_Form**: Formulário da etapa 3 para captura de dados do animal de estimação
- **Summary_Screen**: Tela da etapa 4 que consolida todos os dados preenchidos para revisão antes da confirmação
- **Success_Screen**: Tela exibida após confirmação indicando que a contratação foi simulada com sucesso
- **Zod_Validator**: Módulo de validação baseado em schemas Zod que valida os dados de cada etapa antes de permitir avanço

## Requirements

### Requirement 1: Navegação Multi-step

**User Story:** Como visitante ou usuário logado, quero navegar por um fluxo guiado de etapas para contratar um plano, de modo que o processo seja claro e organizado.

#### Acceptance Criteria

1. THE Plan_Purchase_Flow SHALL render as a Client Component on the `/planos` route managing steps via useReducer internal state
2. THE Stepper SHALL display 4 labeled steps (Escolha do Plano, Dados do Tutor, Dados do Pet, Resumo) and visually highlight the current active step
3. WHEN the user completes validation for the current step and clicks the advance button, THE Plan_Purchase_Flow SHALL transition to the next step
4. WHEN the user clicks the back button on steps 2, 3, or 4, THE Plan_Purchase_Flow SHALL return to the previous step preserving all previously entered data
5. THE Plan_Purchase_Flow SHALL NOT display a back button on step 1

### Requirement 2: Escolha do Plano (Step 1)

**User Story:** Como visitante ou usuário logado, quero visualizar e selecionar um plano de saúde pet, de modo que eu possa escolher a opção que melhor atende às necessidades do meu animal.

#### Acceptance Criteria

1. THE Plan_Purchase_Flow SHALL display 3 plan cards (Básico R$49,90/mês, Plus R$89,90/mês, Premium R$149,90/mês) with their respective benefits sourced from the plans mock
2. WHEN the user selects a plan card, THE Plan_Card SHALL apply a distinct visual highlight (border-primary-500) to indicate selection
3. THE Plan_Purchase_Flow SHALL display only one plan as selected at any time
4. WHEN the user attempts to advance without selecting a plan, THE Zod_Validator SHALL prevent progression and display a validation error message

### Requirement 3: Dados do Tutor (Step 2)

**User Story:** Como visitante ou usuário logado, quero preencher meus dados pessoais, de modo que a contratação do plano fique vinculada ao responsável pelo pet.

#### Acceptance Criteria

1. THE Tutor_Form SHALL display fields for full name, CPF, email, and phone number, all marked as required
2. THE Tutor_Form SHALL apply an input mask in the format XXX.XXX.XXX-XX to the CPF field
3. THE Tutor_Form SHALL apply an input mask in the format (XX) XXXXX-XXXX to the phone field
4. WHEN the user attempts to advance with empty or invalid fields, THE Zod_Validator SHALL prevent progression and display specific validation error messages for each invalid field
5. WHEN the user provides a CPF that does not match the 11-digit numeric format, THE Zod_Validator SHALL display a validation error for the CPF field
6. WHEN the user provides an email that does not match a valid email format, THE Zod_Validator SHALL display a validation error for the email field

### Requirement 4: Dados do Pet (Step 3)

**User Story:** Como visitante ou usuário logado, quero informar os dados do meu pet, de modo que o plano contratado seja adequado ao perfil do animal.

#### Acceptance Criteria

1. THE Pet_Form SHALL display fields for pet name, species (select), breed (select), birth date, and weight, all marked as required
2. THE Pet_Form SHALL provide species options as Cão and Gato in a select input
3. WHEN the user selects Cão as species, THE Pet_Form SHALL display breed options Golden Retriever, Labrador, Bulldog, Poodle, and SRD
4. WHEN the user selects Gato as species, THE Pet_Form SHALL display breed options Siamês, Persa, Maine Coon, and SRD
5. WHEN the user changes the species selection, THE Pet_Form SHALL reset the breed field to empty
6. WHEN the user attempts to advance with empty or invalid fields, THE Zod_Validator SHALL prevent progression and display specific validation error messages for each invalid field

### Requirement 5: Resumo e Confirmação (Step 4)

**User Story:** Como visitante ou usuário logado, quero revisar todos os dados informados e o valor do plano antes de confirmar, de modo que eu possa verificar se tudo está correto.

#### Acceptance Criteria

1. THE Summary_Screen SHALL display the selected plan name and monthly price
2. THE Summary_Screen SHALL display all tutor data (full name, CPF, email, phone) as entered in step 2
3. THE Summary_Screen SHALL display all pet data (name, species, breed, birth date, weight) as entered in step 3
4. THE Summary_Screen SHALL display a terms and conditions acceptance checkbox that is unchecked by default
5. WHEN the terms checkbox is unchecked, THE Plan_Purchase_Flow SHALL disable the contract button
6. WHEN the terms checkbox is checked and the user clicks the contract button, THE Plan_Purchase_Flow SHALL perform local validation and display the Success_Screen

### Requirement 6: Tela de Sucesso

**User Story:** Como visitante ou usuário logado, quero receber uma confirmação visual de que minha contratação foi realizada, de modo que eu tenha certeza de que o processo foi concluído.

#### Acceptance Criteria

1. WHEN the contract action completes successfully, THE Success_Screen SHALL display a success confirmation message
2. THE Success_Screen SHALL NOT trigger any HTTP request to external services

### Requirement 7: Validação por Etapa

**User Story:** Como visitante ou usuário logado, quero que cada etapa valide meus dados antes de avançar, de modo que eu corrija erros antes de prosseguir.

#### Acceptance Criteria

1. THE Zod_Validator SHALL validate all fields of the current step before allowing navigation to the next step
2. WHEN validation fails, THE Plan_Purchase_Flow SHALL display error messages adjacent to the respective invalid fields
3. THE Plan_Purchase_Flow SHALL preserve all valid field values when validation fails, requiring the user to correct only the invalid fields
