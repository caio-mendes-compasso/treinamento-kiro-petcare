# Implementation Plan: Multi-Step Plan Purchase

## Overview

Implementação do fluxo multi-step de contratação de plano de saúde pet na rota `/planos`. O fluxo é construído como um Client Component único com `useReducer`, validação Zod por etapa, máscaras de input, e navegação sequencial por 4 steps até a tela de sucesso. Todos os dados são mockados localmente.

## Tasks

- [x] 1. Criar módulos utilitários e de dados
  - [x] 1.1 Criar `components/planos/breeds.ts` com mapeamento espécie → raças
    - Exportar `breedsBySpecies` com chaves `"cao"` e `"gato"` e arrays de raças conforme design
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 1.2 Criar `components/planos/masks.ts` com funções de máscara
    - Implementar `applyCpfMask`, `applyPhoneMask` e `unmask`
    - CPF: formato `XXX.XXX.XXX-XX`
    - Telefone: formato `(XX) XXXXX-XXXX`
    - _Requirements: 3.2, 3.3_

  - [x] 1.3 Criar `components/planos/schemas.ts` com schemas Zod de validação
    - `planSelectionSchema` para step 1
    - `tutorSchema` para step 2 (fullName, cpf, email, phone)
    - `petSchema` para step 3 (name, species, breed, birthDate, weight)
    - _Requirements: 2.4, 3.4, 3.5, 3.6, 4.6, 7.1_

  - [x] 1.4 Criar `components/planos/purchaseReducer.ts` com reducer, types e initialState
    - Definir interfaces `PurchaseState`, `TutorData`, `PetData`, `StepErrors`
    - Definir union type `PurchaseAction` com todas as actions
    - Implementar `purchaseReducer` com lógica de transições
    - Exportar `initialState`
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [x] 1.5 Write property tests for masks (Properties 5, 6, 13)
    - **Property 5: CPF mask format** — Para qualquer string de 11 dígitos, `applyCpfMask` produz formato `XXX.XXX.XXX-XX` com length 14
    - **Property 6: Phone mask format** — Para qualquer string de 11 dígitos, `applyPhoneMask` produz formato `(XX) XXXXX-XXXX` com length 15
    - **Property 13: Mask round-trip preserves digits** — `unmask(applyCpfMask(digits)) === digits` e `unmask(applyPhoneMask(digits)) === digits`
    - **Validates: Requirements 3.2, 3.3**

  - [x] 1.6 Write property tests for schemas (Properties 7, 8)
    - **Property 7: CPF validation rejects non-11-digit strings** — Strings que não são exatamente 11 dígitos numéricos falham na validação
    - **Property 8: Email validation rejects invalid formats** — Strings sem formato de email válido falham na validação
    - **Validates: Requirements 3.5, 3.6**

  - [x] 1.7 Write property tests for reducer (Properties 2, 3, 4, 9)
    - **Property 2: Advance transitions to next step** — NEXT_STEP com step N ∈ {1,2,3} produz currentStep N+1
    - **Property 3: Back preserves data and decrements step** — BACK com step N ∈ {2,3,4} produz currentStep N-1 preservando dados
    - **Property 4: Plan selection invariant** — Qualquer sequência de SELECT_PLAN resulta em exatamente um selectedPlanId
    - **Property 9: Species change resets breed** — SET_SPECIES sempre limpa breed para string vazia
    - **Validates: Requirements 1.3, 1.4, 2.2, 2.3, 4.5**

- [x] 2. Checkpoint - Módulos utilitários
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implementar componentes visuais das etapas
  - [x] 3.1 Criar `components/planos/Stepper.tsx`
    - Renderizar 4 etapas com labels: Escolha do Plano, Dados do Tutor, Dados do Pet, Resumo
    - Destacar etapa ativa com cor primária, etapas completas com checkmark, pendentes em gray
    - Responsivo: horizontal em desktop, compacto em mobile
    - _Requirements: 1.2_

  - [x] 3.2 Criar `components/planos/PlanStep.tsx`
    - Renderizar 3 cards de planos importados de `mocks/plans.ts`
    - Card selecionado com `border-2 border-primary-500`, não-selecionado com `border border-gray-200`
    - Exibir nome, preço e lista de benefícios de cada plano
    - Disparar `SELECT_PLAN` ao clicar em um card
    - Exibir mensagem de erro de validação quando presente
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.3 Criar `components/planos/TutorStep.tsx`
    - Campos: nome completo, CPF (com máscara), email, telefone (com máscara)
    - Todos marcados como required com labels descritivas
    - Aplicar `applyCpfMask` e `applyPhoneMask` no onChange, armazenar raw digits no state
    - Exibir erros de validação por campo (borda vermelha + mensagem)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.4 Criar `components/planos/PetStep.tsx`
    - Campos: nome do pet, espécie (select), raça (select dinâmico), data de nascimento, peso
    - Select de espécie com opções Cão e Gato
    - Select de raça filtrado por `breedsBySpecies[species]`
    - Disparar `SET_SPECIES` ao mudar espécie (reseta raça)
    - Exibir erros de validação por campo
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 3.5 Criar `components/planos/SummaryStep.tsx`
    - Exibir nome do plano selecionado e preço mensal
    - Exibir todos os dados do tutor (nome, CPF formatado, email, telefone formatado)
    - Exibir todos os dados do pet (nome, espécie, raça, data nascimento, peso)
    - Checkbox de termos e condições (desmarcado por default)
    - Disparar `TOGGLE_TERMS` ao clicar no checkbox
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 3.6 Criar `components/planos/SuccessScreen.tsx`
    - Mensagem de confirmação de sucesso
    - Sem chamadas HTTP
    - _Requirements: 6.1, 6.2_

  - [x] 3.7 Criar `components/planos/NavigationBar.tsx`
    - Botão "Voltar" (secundário) — oculto no step 1
    - Botão "Avançar" (primário) — texto "Contratar" no step 4
    - Botão "Contratar" desabilitado quando `termsAccepted` é false no step 4
    - _Requirements: 1.3, 1.4, 1.5, 5.5, 5.6_

  - [x] 3.8 Write property test for Stepper (Property 1)
    - **Property 1: Stepper highlights exactly the current step**
    - Para qualquer step index 1-4, exatamente um step é visualmente destacado
    - **Validates: Requirements 1.2**

- [x] 4. Checkpoint - Componentes de etapa
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Integrar fluxo principal
  - [x] 5.1 Criar `components/planos/PlanPurchaseFlow.tsx`
    - Client Component com `"use client"`
    - Instanciar `useReducer(purchaseReducer, initialState)`
    - Implementar `handleNext` com validação Zod por step + `mapZodErrors`
    - Renderizar condicionalmente: `SuccessScreen` se `completed`, senão Stepper + StepBody + NavigationBar
    - Layout responsivo com `max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8`
    - _Requirements: 1.1, 1.3, 5.6, 7.1, 7.2, 7.3_

  - [x] 5.2 Atualizar `app/planos/page.tsx` para re-exportar PlanPurchaseFlow
    - Import e render de `PlanPurchaseFlow` como default export da página
    - _Requirements: 1.1_

  - [x] 5.3 Write property tests for validation flow (Properties 11, 12)
    - **Property 11: Validation blocks advance on invalid data** — Com dados inválidos, currentStep não muda e errors é populado
    - **Property 12: Valid fields preserved on validation failure** — Campos válidos permanecem inalterados após falha de validação
    - **Validates: Requirements 7.1, 7.2, 7.3**

  - [x] 5.4 Write unit tests for PlanPurchaseFlow integration
    - Testar fluxo completo: seleção de plano → tutor → pet → resumo → sucesso
    - Testar que botão voltar não aparece no step 1
    - Testar que botão contratar fica desabilitado sem termos aceitos
    - Testar que dados são preservados ao navegar entre steps
    - **Property 10: Summary displays all entered data unchanged**
    - **Validates: Requirements 1.5, 5.2, 5.3, 5.5**

- [x] 6. Checkpoint final
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All implementation uses TypeScript, React 18, Next.js 14 App Router, Tailwind CSS, and Zod
- Input masks store raw digits internally and display formatted values to the user
- The `plans` mock data is imported from `mocks/plans.ts` (already exists)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["1.7", "3.1", "3.2", "3.6"] },
    { "id": 3, "tasks": ["3.3", "3.4", "3.5", "3.7", "3.8"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4"] }
  ]
}
```
