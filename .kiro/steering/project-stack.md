# Stack e Estrutura do Projeto - Pet Care

## Stack Principal

- **Framework**: Next.js 14.2.21 com App Router
- **Linguagem**: TypeScript 5.4 (strict mode)
- **Estilização**: Tailwind CSS 3.4
- **Fonte**: Inter (via next/font/google)
- **Linting**: ESLint 8 (eslint-config-next)
- **Validação de formulários**: Zod 3.23
- **Testes**: Vitest 4.1 + Testing Library 16.3 + fast-check 4.9 (property-based testing)
- **Test Environment**: jsdom (via vitest config)
- **Path Alias**: `@/*` → `./*` (configurado em tsconfig.json e vitest.config.ts)

## Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Iniciar build de produção
npm run lint       # Executar ESLint
npm run test       # Executar testes (single run, vitest --run)
npm run test:watch # Executar testes em watch mode (vitest)
```

## Estrutura de Pastas

```
frontend/
├── app/                        → Rotas e páginas (App Router)
│   ├── layout.tsx              → Layout raiz
│   ├── page.tsx                → Landing page (pública)
│   ├── globals.css             → Estilos globais
│   ├── login/                  → Página de login (pública)
│   ├── planos/                 → Página de planos (pública)
│   └── (protected)/            → Route group autenticado
│       ├── layout.tsx          → Layout com sidebar/header
│       ├── agenda/             → Agendamento de consultas
│       ├── carteirinha/        → Carteirinha do plano
│       ├── financeiro/         → Faturas e financeiro
│       └── pets/               → Gerenciamento de pets
├── components/                 → Componentes reutilizáveis
│   ├── ui/                     → Componentes UI genéricos (Toast)
│   ├── layout/                 → Componentes de layout (Header, Footer, Sidebar, LayoutWrapper)
│   ├── auth/                   → Componentes de autenticação
│   ├── agenda/                 → Componentes da feature agenda
│   ├── carteirinha/            → Componentes da feature carteirinha
│   ├── financeiro/             → Componentes da feature financeiro
│   ├── home/                   → Componentes da landing page
│   ├── pets/                   → Componentes da feature pets
│   └── planos/                 → Componentes da página de planos
├── contexts/                   → Context API do React
│   ├── AuthContext.tsx         → Contexto de autenticação
│   └── PetsContext.tsx         → Contexto de pets do usuário
├── types/                      → Tipos e interfaces TypeScript
│   ├── agenda.ts               → Tipos de agendamento
│   ├── auth.ts                 → Tipos de autenticação
│   ├── financeiro.ts           → Tipos financeiros
│   ├── navigation.ts          → Tipos de navegação
│   └── pets.ts                 → Tipos de pets
├── mocks/                      → Dados mockados para desenvolvimento
│   ├── auth.ts                 → Mock de autenticação
│   ├── breeds.ts              → Mock de raças
│   ├── navigation.ts          → Mock de navegação
│   ├── pets.ts                → Mock de pets
│   ├── plans.ts               → Mock de planos
│   ├── subscription.ts        → Mock de assinatura
│   └── testimonials.ts        → Mock de depoimentos
└── __tests__/                  → Testes unitários e de integração
    ├── app/                    → Testes de páginas
    ├── components/             → Testes de componentes
    ├── contexts/               → Testes de contexts
    ├── integration/            → Testes de integração
    ├── mocks/                  → Mocks para testes
    └── types/                  → Testes de tipos
```

## Convenções

### Estilização
- Mobile-first: sempre começar pelos estilos mobile e usar breakpoints para telas maiores
- Usar classes utilitárias do Tailwind, evitar CSS customizado
- Breakpoints padrão: `sm:`, `md:`, `lg:`, `xl:`

### TypeScript
- Tipos compartilhados ficam em `/types`
- Interfaces de props são definidas no próprio arquivo do componente
- Usar `type` para union types e `interface` para objetos
- Usar o alias `@/` para imports (ex: `import { Pet } from '@/types/pets'`)

### Componentes
- Um componente por arquivo
- Nomeação em PascalCase
- Componentes de UI genéricos ficam em `/components/ui`
- Componentes específicos de feature ficam em `/components/{feature}`
- Componentes de layout ficam em `/components/layout`

### Validação
- Schemas Zod ficam junto ao formulário ou em `/types` quando reutilizáveis
- Usar `z.infer<typeof schema>` para derivar tipos dos schemas

### App Router
- Usar Server Components por padrão
- Marcar com `"use client"` apenas quando necessário (hooks, interatividade)
- Layouts compartilhados em `layout.tsx`
- Loading states em `loading.tsx`
- Route group `(protected)` para rotas que exigem autenticação

### Testes
- Testes unitários e de componentes com Vitest + Testing Library
- Property-based testing com fast-check para lógica de negócio
- Testes colocalizados em `__tests__/` dentro de cada pasta de componentes (para property tests)
- Testes gerais na pasta raiz `__tests__/` separados por tipo
- Convenção de nomenclatura: `{Component}.property.test.ts(x)` para property tests
- Rodar testes: `npm run test` (single run) ou `npm run test:watch`
- Vitest configurado com `globals: true` (não precisa importar `describe`, `it`, `expect`)
- Alias `@/` disponível nos testes via resolve.alias no vitest.config.ts
