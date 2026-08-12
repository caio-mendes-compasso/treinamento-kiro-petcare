# Design Document

## Overview

A feature é dividida em dois módulos client-side dentro do App Router do Next.js:

1. **Módulo Financeiro** (`/financeiro`) — exibe resumo financeiro, filtros e listagem de faturas com ações simuladas
2. **Módulo Carteirinha** (`/carteirinha`) — exibe card visual com flip animation mostrando dados do plano/pet

Ambos são Client Components (`"use client"`) pois dependem de estado local, interações e contextos React (AuthContext, PetsContext). Os dados são derivados inteiramente de mocks existentes (`mocks/plans.ts`, `mocks/pets.ts`) sem chamadas a API.

## Architecture

```text
app/(protected)/financeiro/page.tsx  →  FinanceiroPage (composição)
app/(protected)/carteirinha/page.tsx →  CarteirinhaPage (composição)

components/financeiro/
├── SummaryCards.tsx          → Card_Resumo com totais
├── InvoiceFilters.tsx        → Botões de filtro por status
├── InvoiceList.tsx           → Lista de faturas filtradas
├── InvoiceCard.tsx           → Card individual de fatura
├── invoiceUtils.ts           → Geração mock + cálculos puros
└── __tests__/                → Property e unit tests

components/carteirinha/
├── PetSelector.tsx           → Seletor de pet (tabs/dropdown)
├── PlanCard.tsx              → Container com flip animation
├── PlanCardFront.tsx         → Frente da carteirinha
├── PlanCardBack.tsx          → Verso da carteirinha
└── __tests__/                → Property e unit tests

types/
└── financeiro.ts             → Tipos Invoice, InvoiceStatus, etc.
```

## Components and Interfaces

### FinanceiroPage

Componente de página que orquestra o módulo financeiro.

```typescript
// app/(protected)/financeiro/page.tsx
"use client";

export default function FinanceiroPage() {
  // Usa useAuth() para obter o tutor e plano
  // Usa generateInvoices(plan) para gerar 12 meses de faturas
  // Gerencia estado do filtro ativo (default: "todos")
  // Compõe: SummaryCards + InvoiceFilters + InvoiceList
}
```

### CarteirinhaPage

Componente de página que orquestra o módulo carteirinha.

```typescript
// app/(protected)/carteirinha/page.tsx
"use client";

export default function CarteirinhaPage() {
  // Usa usePets() para obter a lista de pets
  // Gerencia estado do pet selecionado (default: primeiro)
  // Condicional: exibe PetSelector apenas se pets.length > 1
  // Compõe: PetSelector? + PlanCard + botão "Baixar Carteirinha"
}
```

### SummaryCards

Exibe 3 cards de resumo no topo: Total Pago, Pendente, Vencido.

```typescript
interface SummaryCardsProps {
  invoices: Invoice[];
}
```

### InvoiceFilters

Exibe botões de filtro com destaque visual no filtro ativo.

```typescript
type FilterOption = "todos" | "pago" | "pendente" | "vencido";

interface InvoiceFiltersProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}
```

### InvoiceList

Renderiza a lista de faturas filtradas.

```typescript
interface InvoiceListProps {
  invoices: Invoice[];
}
```

### InvoiceCard

Card individual de uma fatura com badges coloridos e botões de ação.

```typescript
interface InvoiceCardProps {
  invoice: Invoice;
  onCopyBarcode: (invoice: Invoice) => void;
  onSecondCopy: (invoice: Invoice) => void;
}
```

### PetSelector

Seletor de pet para a carteirinha (tabs horizontais para poucos pets).

```typescript
interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (petId: string) => void;
}
```

### PlanCard

Container com lógica de flip animation (CSS 3D).

```typescript
interface PlanCardProps {
  pet: Pet;
  plan: Plan;
  userName: string;
}
```

### PlanCardFront

Frente da carteirinha com dados do plano.

```typescript
interface PlanCardFrontProps {
  planName: string;
  planColor: string;
  userName: string;
  petName: string;
  planNumber: string;   // PC-2025-XXXXXX
  validUntil: string;   // Data de validade
}
```

### PlanCardBack

Verso da carteirinha com dados do pet.

```typescript
interface PlanCardBackProps {
  pet: Pet;
}
```

## Data Models

### Types (types/financeiro.ts)

```typescript
export type InvoiceStatus = "Pago" | "Pendente" | "Vencido";

export interface Invoice {
  id: string;
  month: string;        // Nome do mês (e.g., "Janeiro 2025")
  monthIndex: number;   // 0-11 para ordenação
  year: number;
  amount: number;       // Valor numérico (derivado do plano)
  status: InvoiceStatus;
  dueDate: string;      // ISO date
  barcode: string;      // Código de barras mock
}

export type FilterOption = "todos" | "pago" | "pendente" | "vencido";
```

### Constantes de cor por plano

```typescript
export const planColors: Record<string, string> = {
  basico: "#6B7280",    // gray-500
  plus: "#0D7377",      // primary-500
  premium: "#7C3AED",   // violet-600
};
```

## Pure Logic Functions (invoiceUtils.ts)

```typescript
/**
 * Gera 12 meses de faturas mock baseadas no preço do plano.
 * Os primeiros meses são "Pago", meses recentes "Pendente",
 * e meses passados sem pagamento "Vencido".
 */
export function generateInvoices(planPrice: number): Invoice[];

/**
 * Filtra faturas por status.
 * "todos" retorna todas as faturas sem alteração.
 */
export function filterInvoices(
  invoices: Invoice[],
  filter: FilterOption
): Invoice[];

/**
 * Calcula os totais por status.
 */
export function calculateSummary(invoices: Invoice[]): {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
};

/**
 * Formata um número como moeda brasileira (R$ X.XXX,XX).
 */
export function formatCurrency(value: number): string;

/**
 * Gera número do plano no formato PC-2025-XXXXXX.
 */
export function generatePlanNumber(petId: string): string;
```

## Interfaces & Interactions

### Fluxo Financeiro

1. Tutor acessa `/financeiro`
2. `FinanceiroPage` obtém plano contratado (mock: "Plus" hardcoded para MVP)
3. `generateInvoices(plan.price)` cria 12 faturas
4. `SummaryCards` calcula e exibe totais
5. `InvoiceFilters` gerencia filtro ativo (default: "todos")
6. `InvoiceList` exibe faturas filtradas via `filterInvoices()`
7. Ações nos `InvoiceCard` disparam toasts via `window.alert()` ou toast state

### Fluxo Carteirinha

1. Tutor acessa `/carteirinha`
2. `CarteirinhaPage` obtém pets via `usePets()` e user via `useAuth()`
3. Se `pets.length > 1`, renderiza `PetSelector`
4. `PlanCard` gerencia estado de flip (boolean `isFlipped`)
5. Click ou hover toggles `isFlipped`
6. CSS aplica `rotateY(180deg)` com `transition: transform 0.6s`
7. Botão "Baixar Carteirinha" exibe toast/alert de confirmação

### Atribuição de plano (Mock)

Para MVP, o plano contratado será obtido de uma constante mock:

```typescript
// mocks/subscription.ts
import { plans } from "./plans";

export const userSubscription = {
  planId: "plus",
  plan: plans.find((p) => p.id === "plus")!,
  startDate: "2025-01-01",
};
```

## Error Handling

| Cenário                      | Tratamento                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Lista de pets vazia          | Exibe mensagem "Nenhum pet cadastrado. Cadastre um pet para ver a carteirinha." com link para /pets  |
| Plano não encontrado         | Fallback para plano Básico                                                                          |
| Clipboard API indisponível   | Fallback para `window.alert()` com o código                                                         |
| localStorage indisponível    | Dados mantidos apenas em memória durante a sessão                                                   |

## Flip Animation (CSS)

```css
/* Estrutura CSS 3D para flip */
.card-container {
  perspective: 1000px;
}

.card-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
}

.card-back {
  transform: rotateY(180deg);
}
```

Implementado com Tailwind classes + inline styles para o `transform`.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Summary calculation matches invoice sums by status

*For any* array of invoices with arbitrary statuses and amounts, the calculated summary totals SHALL equal the sum of amounts for invoices with status "Pago" (totalPaid), "Pendente" (totalPending), and "Vencido" (totalOverdue) respectively.

**Validates: Requirements 1.2**

### Property 2: Currency formatting produces valid Brazilian format

*For any* non-negative number, the `formatCurrency` function SHALL produce a string matching the pattern `R$ X.XXX,XX` with exactly two decimal places, using dot as thousands separator and comma as decimal separator.

**Validates: Requirements 1.3**

### Property 3: Overdue highlight is applied if and only if overdue total is greater than zero

*For any* array of invoices, the overdue summary card SHALL display red highlight (#EF4444) if and only if the sum of amounts for invoices with status "Vencido" is greater than zero.

**Validates: Requirements 1.4, 1.5**

### Property 4: Filter function returns only invoices matching the selected status

*For any* array of invoices and any filter option, `filterInvoices` SHALL return: all invoices when filter is "todos"; only invoices with status "Pago" when filter is "pago"; only invoices with status "Pendente" when filter is "pendente"; only invoices with status "Vencido" when filter is "vencido". Additionally, the union of filtered results for all three status filters SHALL equal the full invoice list.

**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

### Property 5: Invoice generation produces exactly 12 months with correct plan price

*For any* valid plan price (positive number), `generateInvoices` SHALL produce exactly 12 invoices, each with amount equal to the plan price, with unique month references covering 12 consecutive months.

**Validates: Requirements 3.5**

### Property 6: Pet selector visibility depends on pet count

*For any* list of pets, the pet selector SHALL be visible if and only if the list contains more than one pet.

**Validates: Requirements 5.1, 5.2**

### Property 7: Selecting a pet updates the card with that pet's information

*For any* list of pets with more than one pet, and for any pet selected from that list, the card SHALL display the selected pet's name, species, and breed.

**Validates: Requirements 5.3**

### Property 8: Card front displays all required identification fields

*For any* combination of pet, plan, and user, the card front SHALL contain: the text "Pet Care", the plan name, the user's name, the pet's name, a plan number matching the format PC-2025-XXXXXX, and a validity date.

**Validates: Requirements 6.2**

### Property 9: Card back displays pet info and emergency data

*For any* pet, the card back SHALL display: the pet's species, the pet's breed, the emergency phone "0800-PET-CARE", and a QR code placeholder. If the pet has a photo (non-null), the photo SHALL be displayed; otherwise a placeholder SHALL be shown.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 10: Double flip returns card to original side

*For any* initial card state (front or back), flipping twice SHALL return the card to its original visible side. Equivalently, flipping is its own inverse: `flip(flip(state)) === state`.

**Validates: Requirements 8.1**

## Testing Strategy

Os testes desta feature utilizam uma abordagem dual:

- **Property-based tests (fast-check)**: Validam as propriedades universais definidas na seção Correctness Properties acima, com mínimo de 100 iterações por propriedade. Focam nas funções puras (`invoiceUtils.ts`) e na lógica de componentes (visibilidade do seletor, conteúdo do card, idempotência do flip).
- **Unit tests (Vitest + React Testing Library)**: Cobrem exemplos específicos, edge cases (lista vazia de pets, plano não encontrado) e interações de UI (click em filtros, ações de fatura).

Os testes ficam em `components/financeiro/__tests__/` e `components/carteirinha/__tests__/`, seguindo o padrão já estabelecido no projeto (e.g., `components/agenda/__tests__/`).
