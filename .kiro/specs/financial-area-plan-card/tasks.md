# Implementation Plan: Financial Area & Plan Card

## Overview

Implementação da Área Financeira (/financeiro) e Carteirinha do Plano (/carteirinha) usando TypeScript, Next.js App Router, Tailwind CSS. Os dados são derivados de mocks existentes. A implementação segue uma abordagem incremental: tipos → funções puras → componentes UI → páginas compostas → testes.

## Tasks

- [x] 1. Tipos e dados base
  - [x] 1.1 Criar tipos financeiros em `types/financeiro.ts`
    - Definir `InvoiceStatus`, `Invoice`, `FilterOption` e `planColors`
    - Exportar constantes de cores por plano
    - _Requirements: 1.2, 3.1, 3.2, 3.3, 3.4_

  - [x] 1.2 Criar mock de subscription em `mocks/subscription.ts`
    - Exportar `userSubscription` com planId "plus" e referência ao plano da lista
    - Importar plans de `mocks/plans.ts`
    - _Requirements: 3.5_

- [x] 2. Funções puras do módulo financeiro
  - [x] 2.1 Implementar `components/financeiro/invoiceUtils.ts`
    - Implementar `generateInvoices(planPrice)`: gera 12 faturas com status variados
    - Implementar `filterInvoices(invoices, filter)`: filtra por status ou retorna todas
    - Implementar `calculateSummary(invoices)`: soma totalPaid, totalPending, totalOverdue
    - Implementar `formatCurrency(value)`: formata para R$ X.XXX,XX
    - Implementar `generatePlanNumber(petId)`: formato PC-2025-XXXXXX
    - _Requirements: 1.2, 1.3, 2.2, 2.3, 2.4, 2.5, 3.5_

  - [x] 2.2 Property test: Summary calculation matches invoice sums
    - **Property 1: Summary calculation matches invoice sums by status**
    - **Validates: Requirements 1.2**
    - Criar `components/financeiro/__tests__/invoiceUtils.property.test.ts`

  - [x] 2.3 Property test: Currency formatting Brazilian format
    - **Property 2: Currency formatting produces valid Brazilian format**
    - **Validates: Requirements 1.3**

  - [x] 2.4 Property test: Filter returns only matching invoices
    - **Property 4: Filter function returns only invoices matching the selected status**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

  - [x] 2.5 Property test: Invoice generation produces 12 months
    - **Property 5: Invoice generation produces exactly 12 months with correct plan price**
    - **Validates: Requirements 3.5**

- [x] 3. Componentes do módulo financeiro
  - [x] 3.1 Implementar `components/financeiro/SummaryCards.tsx`
    - Exibir 3 cards: Total Pago, Pendente, Vencido com valores formatados
    - Destacar card "Vencido" em vermelho (#EF4444) quando valor > 0
    - Usar semântica HTML e ARIA labels
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.3_

  - [x] 3.2 Property test: Overdue highlight condition
    - **Property 3: Overdue highlight is applied if and only if overdue total is greater than zero**
    - **Validates: Requirements 1.4, 1.5**
    - Criar `components/financeiro/__tests__/SummaryCards.property.test.tsx`

  - [x] 3.3 Implementar `components/financeiro/InvoiceFilters.tsx`
    - Botões "Todos", "Pagos", "Pendentes", "Vencidos"
    - Destacar visualmente o filtro ativo com cor primária
    - Focus states visíveis com ring
    - _Requirements: 2.1, 2.6, 2.7, 10.5_

  - [x] 3.4 Implementar `components/financeiro/InvoiceCard.tsx`
    - Exibir mês de referência, valor formatado e badge colorido de status
    - Botões "Copiar código de barras" e "2ª via" com ações toast/alert
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_

  - [x] 3.5 Implementar `components/financeiro/InvoiceList.tsx`
    - Renderizar lista de InvoiceCard a partir das faturas filtradas
    - Layout responsivo mobile-first
    - _Requirements: 3.1, 10.1_

- [x] 4. Checkpoint - Módulo financeiro
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Página financeiro completa
  - [x] 5.1 Implementar `app/(protected)/financeiro/page.tsx`
    - Marcar como `"use client"`
    - Usar `useAuth()` para obter nome do tutor
    - Importar `userSubscription` para obter plano
    - Gerar faturas com `generateInvoices(plan.price)`
    - Gerenciar estado do filtro ativo (default: "todos")
    - Compor: SummaryCards + InvoiceFilters + InvoiceList
    - Layout responsivo com padding e spacing padrão
    - _Requirements: 1.1, 2.7, 10.1_

- [x] 6. Componentes do módulo carteirinha
  - [x] 6.1 Implementar `components/carteirinha/PetSelector.tsx`
    - Tabs horizontais com nome de cada pet
    - Destacar tab ativa com cor primária
    - Focus states e semântica ARIA (role="tablist")
    - _Requirements: 5.1, 5.2, 5.3, 10.4, 10.6_

  - [x] 6.2 Property test: Pet selector visibility
    - **Property 6: Pet selector visibility depends on pet count**
    - **Validates: Requirements 5.1, 5.2**
    - Criar `components/carteirinha/__tests__/PetSelector.property.test.tsx`

  - [x] 6.3 Property test: Selecting a pet updates card
    - **Property 7: Selecting a pet updates the card with that pet's information**
    - **Validates: Requirements 5.3**

  - [x] 6.4 Implementar `components/carteirinha/PlanCardFront.tsx`
    - Exibir: logotipo "Pet Care", nome do plano (com cor do plano), nome do tutor, nome do pet, número PC-2025-XXXXXX, data de validade
    - Gradiente sutil no fundo
    - Aspect-ratio 1.6:1
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.5 Property test: Card front required fields
    - **Property 8: Card front displays all required identification fields**
    - **Validates: Requirements 6.2**
    - Criar `components/carteirinha/__tests__/PlanCard.property.test.tsx`

  - [x] 6.6 Implementar `components/carteirinha/PlanCardBack.tsx`
    - Exibir: foto do pet (ou placeholder), espécie, raça, telefone 0800-PET-CARE, QR code placeholder
    - Lógica condicional de foto vs placeholder
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.7 Property test: Card back displays pet info
    - **Property 9: Card back displays pet info and emergency data**
    - **Validates: Requirements 7.1, 7.2, 7.3**

  - [x] 6.8 Implementar `components/carteirinha/PlanCard.tsx`
    - Container com flip animation CSS 3D (perspective, rotateY, backface-visibility)
    - Estado `isFlipped` toggle no click e hover (desktop)
    - Transição suave 0.6s
    - Compor PlanCardFront e PlanCardBack
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 6.9 Property test: Double flip returns to original side
    - **Property 10: Double flip returns card to original side**
    - **Validates: Requirements 8.1**

- [x] 7. Checkpoint - Módulo carteirinha
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Página carteirinha completa e integração
  - [x] 8.1 Implementar `app/(protected)/carteirinha/page.tsx`
    - Marcar como `"use client"`
    - Usar `usePets()` para obter lista de pets
    - Usar `useAuth()` para obter nome do tutor
    - Importar `userSubscription` para obter plano
    - Gerenciar estado de pet selecionado (default: primeiro)
    - Renderizar PetSelector apenas se pets.length > 1
    - Exibir mensagem de fallback se lista vazia com link para /pets
    - Botão "Baixar Carteirinha" com toast/alert de confirmação
    - Layout responsivo mobile-first
    - _Requirements: 5.1, 5.2, 5.4, 9.1, 9.2, 10.2_

- [x] 9. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marcadas com `*` são opcionais e podem ser ignoradas para um MVP mais rápido
- Cada task referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Property tests validam propriedades universais de corretude definidas no design
- Dados são inteiramente mock, sem chamadas a API
- Componentes usam Tailwind CSS com a paleta configurada (primary-500: #0D7377)
- Abordagem mobile-first em todos os componentes UI

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5"] },
    { "id": 3, "tasks": ["3.1", "3.3", "3.4", "3.5"] },
    { "id": 4, "tasks": ["3.2", "5.1"] },
    { "id": 5, "tasks": ["6.1", "6.4", "6.6", "6.8"] },
    { "id": 6, "tasks": ["6.2", "6.3", "6.5", "6.7", "6.9"] },
    { "id": 7, "tasks": ["8.1"] }
  ]
}
```
