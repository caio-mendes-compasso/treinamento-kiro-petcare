# Design Document: Multi-Step Plan Purchase

## Overview

Fluxo multi-step para contratação de plano de saúde pet na rota `/planos`. Implementado como um único Client Component com `useReducer` para gerenciar estado, validação Zod por etapa, e dados mockados (sem chamadas HTTP). O usuário navega por 4 etapas sequenciais até a confirmação.

## Architecture

O fluxo de contratação de plano é implementado como um único Client Component na rota `/planos`, utilizando `useReducer` para gerenciar estado de navegação entre etapas, dados de formulário e erros de validação. Não há sub-rotas nem chamadas HTTP — todo o fluxo é local com dados mockados.

### Padrão Arquitetural

```
┌─────────────────────────────────────────────────┐
│  PlanPurchaseFlow (Client Component)            │
│  ┌───────────────────────────────────────────┐  │
│  │  useReducer(purchaseReducer, initialState)│  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌──────────┐  ┌────────┐        │
│  │ Stepper │  │ StepBody │  │ NavBar │        │
│  └─────────┘  └──────────┘  └────────┘        │
│                     │                           │
│       ┌─────────────┼─────────────┐            │
│       │             │             │            │
│  ┌────▼───┐  ┌─────▼────┐  ┌────▼───┐        │
│  │PlanStep│  │TutorStep │  │PetStep │        │
│  └────────┘  └──────────┘  └────────┘        │
│                                    │            │
│                             ┌──────▼─────┐     │
│                             │SummaryStep │     │
│                             └────────────┘     │
│                                    │            │
│                             ┌──────▼─────┐     │
│                             │SuccessScreen│    │
│                             └────────────┘     │
└─────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. O `purchaseReducer` é a única fonte de verdade para estado do fluxo
2. Cada sub-componente de etapa recebe `state` e `dispatch` como props
3. Validação Zod é executada no handler de "avançar" antes de dispatchar `NEXT_STEP`
4. Dados do mock `plans` são importados diretamente (sem fetch)

## Components and Interfaces

### PlanPurchaseFlow

Componente raiz do fluxo. Monta o reducer e renderiza condicionalmente a etapa atual.

```typescript
"use client";

import { useReducer } from "react";
import { purchaseReducer, initialState } from "./purchaseReducer";

export default function PlanPurchaseFlow() {
  const [state, dispatch] = useReducer(purchaseReducer, initialState);

  if (state.completed) {
    return <SuccessScreen />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <Stepper currentStep={state.currentStep} />
      <StepBody state={state} dispatch={dispatch} />
      <NavigationBar
        currentStep={state.currentStep}
        onBack={() => dispatch({ type: "BACK" })}
        onNext={() => handleNext(state, dispatch)}
      />
    </div>
  );
}
```

### Stepper

Indicador visual de progresso com 4 etapas. Destaca a etapa ativa com cor primária.

```typescript
interface StepperProps {
  currentStep: number; // 1-4
}

function Stepper({ currentStep }: StepperProps) {
  const steps = [
    "Escolha do Plano",
    "Dados do Tutor",
    "Dados do Pet",
    "Resumo",
  ];
  // Renderiza steps com indicador visual ativo/completo/pendente
}
```

### PlanStep (Step 1)

Exibe 3 cards de planos. Permite seleção de exatamente um.

### TutorStep (Step 2)

Formulário com campos nome, CPF (com máscara), email, telefone (com máscara).

### PetStep (Step 3)

Formulário com campos nome do pet, espécie (select), raça (select dinâmico), data de nascimento, peso.

### SummaryStep (Step 4)

Exibe todos os dados consolidados + checkbox de termos.

### SuccessScreen

Tela final de confirmação sem interações adicionais.

## Data Models

### State

```typescript
interface PurchaseState {
  currentStep: 1 | 2 | 3 | 4;
  completed: boolean;
  selectedPlanId: string | null;
  tutorData: TutorData;
  petData: PetData;
  termsAccepted: boolean;
  errors: StepErrors;
}

interface TutorData {
  fullName: string;
  cpf: string;       // raw digits, e.g. "12345678901"
  email: string;
  phone: string;     // raw digits, e.g. "11999998888"
}

interface PetData {
  name: string;
  species: "" | "cao" | "gato";
  breed: string;
  birthDate: string; // ISO date string "YYYY-MM-DD"
  weight: string;    // string to handle input, parsed as number for validation
}

interface StepErrors {
  plan?: string;
  tutor?: Partial<Record<keyof TutorData, string>>;
  pet?: Partial<Record<keyof PetData, string>>;
}
```

### Actions

```typescript
type PurchaseAction =
  | { type: "SELECT_PLAN"; planId: string }
  | { type: "SET_TUTOR_FIELD"; field: keyof TutorData; value: string }
  | { type: "SET_PET_FIELD"; field: keyof PetData; value: string }
  | { type: "SET_SPECIES"; species: "" | "cao" | "gato" }
  | { type: "TOGGLE_TERMS" }
  | { type: "NEXT_STEP" }
  | { type: "BACK" }
  | { type: "SET_ERRORS"; errors: StepErrors }
  | { type: "COMPLETE" };
```

### Reducer Logic

```typescript
function purchaseReducer(state: PurchaseState, action: PurchaseAction): PurchaseState {
  switch (action.type) {
    case "SELECT_PLAN":
      return { ...state, selectedPlanId: action.planId, errors: { ...state.errors, plan: undefined } };

    case "SET_TUTOR_FIELD":
      return {
        ...state,
        tutorData: { ...state.tutorData, [action.field]: action.value },
        errors: { ...state.errors, tutor: { ...state.errors.tutor, [action.field]: undefined } },
      };

    case "SET_PET_FIELD":
      return {
        ...state,
        petData: { ...state.petData, [action.field]: action.value },
        errors: { ...state.errors, pet: { ...state.errors.pet, [action.field]: undefined } },
      };

    case "SET_SPECIES":
      return {
        ...state,
        petData: { ...state.petData, species: action.species, breed: "" },
        errors: { ...state.errors, pet: { ...state.errors.pet, species: undefined, breed: undefined } },
      };

    case "TOGGLE_TERMS":
      return { ...state, termsAccepted: !state.termsAccepted };

    case "NEXT_STEP":
      if (state.currentStep < 4) {
        return { ...state, currentStep: (state.currentStep + 1) as 1 | 2 | 3 | 4, errors: {} };
      }
      return state;

    case "BACK":
      if (state.currentStep > 1) {
        return { ...state, currentStep: (state.currentStep - 1) as 1 | 2 | 3 | 4, errors: {} };
      }
      return state;

    case "SET_ERRORS":
      return { ...state, errors: action.errors };

    case "COMPLETE":
      return { ...state, completed: true };

    default:
      return state;
  }
}

const initialState: PurchaseState = {
  currentStep: 1,
  completed: false,
  selectedPlanId: null,
  tutorData: { fullName: "", cpf: "", email: "", phone: "" },
  petData: { name: "", species: "", breed: "", birthDate: "", weight: "" },
  termsAccepted: false,
  errors: {},
};
```

## Validation Schemas (Zod)

```typescript
import { z } from "zod";

// Step 1 — Plan Selection
export const planSelectionSchema = z.object({
  selectedPlanId: z.string().min(1, "Selecione um plano"),
});

// Step 2 — Tutor Data
export const tutorSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\d{11}$/, "Telefone deve conter 11 dígitos numéricos"),
});

// Step 3 — Pet Data
export const petSchema = z.object({
  name: z.string().min(1, "Nome do pet é obrigatório").max(50),
  species: z.enum(["cao", "gato"], { errorMap: () => ({ message: "Selecione a espécie" }) }),
  breed: z.string().min(1, "Selecione a raça"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  weight: z.string().regex(/^\d+(\.\d{1,2})?$/, "Peso inválido"),
});

export type TutorData = z.infer<typeof tutorSchema>;
export type PetData = z.infer<typeof petSchema>;
```

## Input Mask Functions

```typescript
/**
 * Applies CPF mask: XXX.XXX.XXX-XX
 * Input: raw digit string (e.g. "12345678901")
 * Output: masked string (e.g. "123.456.789-01")
 */
export function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/**
 * Applies phone mask: (XX) XXXXX-XXXX
 * Input: raw digit string (e.g. "11999998888")
 * Output: masked string (e.g. "(11) 99999-8888")
 */
export function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

/**
 * Strips mask characters, returning only digits
 */
export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}
```

## Breed Mapping

```typescript
export const breedsBySpecies: Record<"cao" | "gato", string[]> = {
  cao: ["Golden Retriever", "Labrador", "Bulldog", "Poodle", "SRD"],
  gato: ["Siamês", "Persa", "Maine Coon", "SRD"],
};
```

## Validation Flow (handleNext)

```typescript
function handleNext(state: PurchaseState, dispatch: React.Dispatch<PurchaseAction>): void {
  const result = validateCurrentStep(state);

  if (!result.success) {
    dispatch({ type: "SET_ERRORS", errors: mapZodErrors(result.error) });
    return;
  }

  if (state.currentStep === 4) {
    if (!state.termsAccepted) return;
    dispatch({ type: "COMPLETE" });
  } else {
    dispatch({ type: "NEXT_STEP" });
  }
}

function validateCurrentStep(state: PurchaseState): z.SafeParseReturnType<unknown, unknown> {
  switch (state.currentStep) {
    case 1:
      return planSelectionSchema.safeParse({ selectedPlanId: state.selectedPlanId ?? "" });
    case 2:
      return tutorSchema.safeParse(state.tutorData);
    case 3:
      return petSchema.safeParse(state.petData);
    case 4:
      return { success: true, data: state } as z.SafeParseReturnType<unknown, unknown>;
  }
}
```

## Error Handling

| Cenário | Comportamento |
|---------|---------------|
| Campo obrigatório vazio | Mensagem de erro abaixo do campo, borda vermelha |
| CPF com formato inválido | "CPF deve conter 11 dígitos numéricos" |
| Email inválido | "Email inválido" |
| Telefone inválido | "Telefone deve conter 11 dígitos numéricos" |
| Nenhum plano selecionado | "Selecione um plano" |
| Peso inválido | "Peso inválido" |
| Tentativa de avançar com erros | Navegação bloqueada, erros exibidos |
| Voltar etapa | Erros limpos, dados preservados |

## UI Patterns

- **Botão Primário (Avançar/Contratar)**: `bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- **Botão Secundário (Voltar)**: `border border-primary-500 text-primary-500 hover:bg-primary-50`
- **Botão Desabilitado**: `bg-gray-300 text-gray-500 cursor-not-allowed`
- **Card Selecionado**: `border-2 border-primary-500`
- **Card Não-selecionado**: `border border-gray-200`
- **Campo com Erro**: `border-red-500 focus:ring-red-500`
- **Mensagem de Erro**: `text-red-500 text-sm mt-1`
- **Stepper Ativo**: `text-primary-500 font-semibold` com indicador circular preenchido
- **Stepper Completo**: `text-primary-500` com checkmark
- **Stepper Pendente**: `text-gray-400`

## File Structure

```
app/planos/
  page.tsx                  → Re-exports PlanPurchaseFlow

components/planos/
  PlanPurchaseFlow.tsx      → Client Component principal
  Stepper.tsx               → Indicador de progresso
  PlanStep.tsx              → Step 1 — seleção de plano
  TutorStep.tsx             → Step 2 — dados do tutor
  PetStep.tsx               → Step 3 — dados do pet
  SummaryStep.tsx           → Step 4 — resumo
  SuccessScreen.tsx         → Tela de sucesso
  NavigationBar.tsx         → Botões voltar/avançar
  purchaseReducer.ts        → Reducer + initialState + types
  schemas.ts                → Zod schemas de validação
  masks.ts                  → Funções de máscara (CPF, telefone)
  breeds.ts                 → Mapeamento espécie → raças
```

## Testing Strategy

### Abordagem Dual

- **Testes de propriedade (fast-check)**: Validam propriedades universais do reducer, funções de máscara e schemas Zod com 100+ iterações aleatórias
- **Testes unitários (vitest)**: Verificam exemplos específicos, renderização de componentes e edge cases

### Foco dos Property Tests

| Área | O que varia | Propriedade |
|------|-------------|-------------|
| Reducer (navegação) | Step atual, dados preenchidos | Transições corretas, preservação de dados |
| Masks (CPF/phone) | Strings de dígitos | Formato de saída, round-trip com unmask |
| Schemas Zod | Inputs inválidos variados | Rejeição correta de formatos inválidos |
| Species → Breed | Espécie selecionada | Reset de raça ao mudar espécie |

### Foco dos Unit Tests

- Renderização dos componentes de cada etapa
- Exibição correta dos dados mockados de planos
- Integração Stepper ↔ currentStep
- Checkbox de termos desabilita/habilita botão
- Tela de sucesso renderiza após confirmação

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Stepper highlights exactly the current step

*For any* valid step index (1 through 4), the Stepper component SHALL visually highlight exactly one step — the one matching the current step index — while all other steps remain unhighlighted.

**Validates: Requirements 1.2**

### Property 2: Advance transitions to next step

*For any* step N in {1, 2, 3} with valid data for that step, dispatching `NEXT_STEP` SHALL produce a state with `currentStep` equal to N+1.

**Validates: Requirements 1.3**

### Property 3: Back preserves data and decrements step

*For any* step N in {2, 3, 4} and any form data present in state, dispatching `BACK` SHALL produce a state with `currentStep` equal to N-1 while preserving all `tutorData`, `petData`, and `selectedPlanId` values unchanged.

**Validates: Requirements 1.4**

### Property 4: Plan selection invariant — exactly one selected

*For any* sequence of `SELECT_PLAN` actions, the resulting state SHALL always contain exactly one `selectedPlanId` (the most recently selected), and visually only that plan card displays the selection highlight.

**Validates: Requirements 2.2, 2.3**

### Property 5: CPF mask format

*For any* string of exactly 11 digits, applying `applyCpfMask` SHALL produce a string matching the pattern `XXX.XXX.XXX-XX` where X is a digit, and the output has length 14.

**Validates: Requirements 3.2**

### Property 6: Phone mask format

*For any* string of exactly 11 digits, applying `applyPhoneMask` SHALL produce a string matching the pattern `(XX) XXXXX-XXXX` where X is a digit, and the output has length 15.

**Validates: Requirements 3.3**

### Property 7: CPF validation rejects non-11-digit strings

*For any* string that does not consist of exactly 11 numeric digits, the `tutorSchema` CPF field validation SHALL return a failure result.

**Validates: Requirements 3.5**

### Property 8: Email validation rejects invalid formats

*For any* string that does not conform to a valid email format (missing @, missing domain, etc.), the `tutorSchema` email field validation SHALL return a failure result.

**Validates: Requirements 3.6**

### Property 9: Species change resets breed

*For any* state where `petData.breed` is non-empty, dispatching `SET_SPECIES` with any species value SHALL produce a state where `petData.breed` is an empty string.

**Validates: Requirements 4.5**

### Property 10: Summary displays all entered data unchanged

*For any* valid `tutorData` and `petData` combination, the Summary_Screen SHALL render every field value exactly as stored in state, with no transformation or loss.

**Validates: Requirements 5.2, 5.3**

### Property 11: Validation blocks advance on invalid data

*For any* step with at least one field failing Zod schema validation, attempting to advance SHALL NOT change `currentStep` and SHALL populate the `errors` object with messages for the invalid fields.

**Validates: Requirements 7.1, 7.2**

### Property 12: Valid fields preserved on validation failure

*For any* form state where some fields are valid and others invalid, after a failed validation attempt, all valid field values SHALL remain unchanged in state.

**Validates: Requirements 7.3**

### Property 13: Mask round-trip preserves digits

*For any* string of digits (up to 11 characters), applying a mask function followed by `unmask` SHALL return the original digit string. That is: `unmask(applyCpfMask(digits)) === digits` and `unmask(applyPhoneMask(digits)) === digits`.

**Validates: Requirements 3.2, 3.3**
