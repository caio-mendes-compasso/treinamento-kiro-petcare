# Implementation Plan: Home Page Marketing

## Overview

Implementação da Home Page de marketing do portal Pet Care, composta por 5 seções (Hero Banner, Benefits, Plans Comparison, Testimonials, Final CTA) como Server Components Next.js com dados mockados, navegação via `next/link`, layout responsivo mobile-first com Tailwind CSS e acessibilidade WCAG.

## Tasks

- [x] 1. Criar arquivos de dados mock e tipos
  - [x] 1.1 Criar `/mocks/plans.ts` com interface Plan e array de planos
    - Exportar interface `Plan` com campos: id, name, price, priceLabel, features, highlighted
    - Exportar array `plans` com 3 objetos (Básico, Plus, Premium) conforme especificado
    - Plus deve ter `highlighted: true`, os demais `false`
    - _Requirements: 8.1, 8.3, 8.6_

  - [x] 1.2 Criar `/mocks/testimonials.ts` com interface Testimonial e array de depoimentos
    - Exportar interface `Testimonial` com campos: id, name, avatar, text
    - Exportar array `testimonials` com 3 objetos (Maria Silva, João Santos, Ana Oliveira)
    - Textos e nomes conforme dados do design
    - _Requirements: 8.2, 8.4, 8.6_

- [x] 2. Implementar componentes de seção da Home Page
  - [x] 2.1 Criar `components/home/HeroBanner.tsx`
    - Server Component com `<section>` usando bg-primary-50, py-16 md:py-24, full width
    - `<h1>` com texto "Cuidado completo para quem você ama"
    - `<p>` com subtítulo "Planos a partir de R$ 49,90/mês"
    - `<Link href="/planos">` com texto "Conheça nossos planos" estilizado como botão primário
    - Todo conteúdo centralizado horizontalmente
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [x] 2.2 Criar `components/home/BenefitsSection.tsx`
    - Server Component com heading `<h2>` "Por que escolher o Pet Care?"
    - Grid responsivo: 1col mobile, 2col md, 4col lg
    - 4 Benefit_Cards com dados inline (icon, title, description)
    - Cards com bg-white, rounded-lg, shadow-sm, border gray-200, p-6
    - Conteúdo vertical: icon → title → description
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11_

  - [x] 2.3 Criar `components/home/PlansComparison.tsx`
    - Server Component importando `plans` e `Plan` de `@/mocks/plans`
    - Heading `<h2>` para a seção
    - Grid responsivo: 1col mobile, 3col md (side by side)
    - PlanCard interno com: nome, preço, lista de features com check icon, botão "Contratar" via `<Link href="/planos">`
    - Card Plus destacado com borda primary-500 e badge "Mais popular"
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [x] 2.4 Criar `components/home/TestimonialsSection.tsx`
    - Server Component importando `testimonials` e `Testimonial` de `@/mocks/testimonials`
    - Heading `<h2>` para a seção
    - Grid responsivo: 1col mobile, 3col md
    - TestimonialCard interno com avatar circular 64x64, nome e texto
    - Fallback de avatar com div contendo iniciais do nome quando imagem falha (requer "use client" no card)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 2.5 Criar `components/home/CTASection.tsx`
    - Server Component com `<section>` usando bg-primary-500, text-white, centralizado
    - `<h2>` com "Seu pet merece o melhor"
    - `<p>` com subtítulo "Escolha o plano ideal e garanta saúde e bem-estar para seu melhor amigo"
    - `<Link href="/planos">` com texto "Contratar agora" estilizado como botão branco
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 3. Integrar componentes na página principal
  - [x] 3.1 Atualizar `app/page.tsx` para compor todas as seções
    - Importar HeroBanner, BenefitsSection, PlansComparison, TestimonialsSection, CTASection
    - Renderizar na ordem: Hero → Benefits → Plans → Testimonials → CTA
    - Garantir que a página é um Server Component (sem "use client")
    - Aplicar overflow-wrap: break-word para prevenir scroll horizontal
    - Usar next/link para toda navegação interna
    - _Requirements: 1.1, 5.6, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 8.5_

- [x] 4. Checkpoint - Verificar renderização e navegação
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Garantir acessibilidade e conformidade visual
  - [x] 5.1 Revisar hierarquia de headings e semântica em todos os componentes
    - Verificar h1 único no HeroBanner, h2 para cada seção, sem pulos de nível
    - CTAs como `<a>` (via next/link) com texto visível ou aria-label ≥ 3 chars
    - Focus indicator com ring-2 ring-primary-500 ring-offset-2 em todos interativos
    - Alt text em imagens informativas (5-125 chars), alt="" em decorativas
    - Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
    - Todos elementos interativos acessíveis via Tab + Enter/Space
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 6. Testes unitários e de propriedade
  - [ ]* 6.1 Escrever testes unitários para HeroBanner e CTASection
    - Criar `__tests__/components/HeroBanner.test.tsx`
    - Criar `__tests__/components/CTASection.test.tsx`
    - Verificar textos renderizados, links com href="/planos", estrutura semântica
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 6.2 Escrever testes unitários para BenefitsSection
    - Criar `__tests__/components/BenefitsSection.test.tsx`
    - Verificar heading, 4 cards com conteúdo correto, classes responsivas
    - _Requirements: 2.1, 2.2, 2.6, 2.7, 2.8, 2.9_

  - [ ]* 6.3 Escrever testes unitários para PlansComparison
    - Criar `__tests__/components/PlansComparison.test.tsx`
    - Verificar 3 cards, dados corretos, destaque no Plus, links para /planos
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 6.4 Escrever testes unitários para TestimonialsSection
    - Criar `__tests__/components/TestimonialsSection.test.tsx`
    - Verificar 3 cards, nomes corretos, avatar fallback ao simular erro de imagem
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [ ]* 6.5 Escrever property test para Plan mock data structure
    - **Property 5: Plans mock data structure invariants**
    - Criar `__tests__/mocks/plans.property.test.ts`
    - Gerar arrays de planos aleatórios → validar name ≤50 chars, price > 0, features 1-10 items, exatamente 1 highlighted
    - **Validates: Requirements 8.3**

  - [ ]* 6.6 Escrever property test para Testimonial mock data structure
    - **Property 6: Testimonials mock data structure invariants**
    - Criar `__tests__/mocks/testimonials.property.test.ts`
    - Gerar arrays de testimonials aleatórios → validar name ≤80 chars, avatar non-empty, text ≤300 chars
    - **Validates: Requirements 8.4**

  - [ ]* 6.7 Escrever property test para heading hierarchy
    - **Property 3: Heading hierarchy correctness**
    - Criar `__tests__/app/HomePage.property.test.tsx`
    - Renderizar página completa → extrair headings → verificar h1 único + h2 sequenciais sem pulos
    - **Validates: Requirements 7.2**

  - [ ]* 6.8 Escrever property test para acessibilidade de elementos interativos
    - **Property 4: Accessibility attributes on interactive and informative elements**
    - Adicionar em `__tests__/app/HomePage.property.test.tsx`
    - Coletar todos links/buttons → verificar semântica e labels; coletar imagens → verificar alt text
    - **Validates: Requirements 7.3, 7.5**

  - [ ]* 6.9 Escrever property test para PlanCard rendering completeness
    - **Property 1: Plan card rendering completeness**
    - Criar `__tests__/components/PlansComparison.property.test.tsx`
    - Gerar planos válidos aleatórios → renderizar PlanCard → verificar presença de name, price, todas features com check, link /planos
    - **Validates: Requirements 3.6, 3.7**

  - [ ]* 6.10 Escrever property test para Testimonial card character constraints
    - **Property 2: Testimonial card character constraints**
    - Criar `__tests__/components/TestimonialsSection.property.test.tsx`
    - Gerar testimonials com nomes/textos de comprimentos variados → verificar truncamento correto (nome ≤50 visíveis, texto ≤200 visíveis, avatar 64x64)
    - **Validates: Requirements 4.2**

- [x] 7. Checkpoint final - Garantir todos os testes passam
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- All components are Server Components except TestimonialCard (needs "use client" for avatar fallback via onError)
- Navigation uses `next/link` exclusively for internal routes
- Styling follows the visual identity steering (primary-500: #0D7377, Tailwind classes)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.5"] },
    { "id": 2, "tasks": ["2.3", "2.4"] },
    { "id": 3, "tasks": ["3.1"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6"] },
    { "id": 6, "tasks": ["6.7", "6.8", "6.9", "6.10"] }
  ]
}
```
