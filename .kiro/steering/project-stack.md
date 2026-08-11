# Stack e Estrutura do Projeto - Pet Care

## Stack Principal

- **Framework**: Next.js 14+ com App Router
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: Tailwind CSS
- **Fonte**: Inter (via next/font/google)
- **Linting**: ESLint
- **Validação de formulários**: Zod

## Estrutura de Pastas

```
/app          → Rotas e páginas (App Router)
/components   → Componentes reutilizáveis
/contexts     → Context API do React
/types        → Tipos e interfaces TypeScript
/mocks        → Dados mockados para desenvolvimento
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

### Componentes
- Um componente por arquivo
- Nomeação em PascalCase
- Componentes de UI genéricos ficam em `/components/ui`
- Componentes específicos de feature ficam em `/components/{feature}`

### Validação
- Schemas Zod ficam junto ao formulário ou em `/types` quando reutilizáveis
- Usar `z.infer<typeof schema>` para derivar tipos dos schemas

### App Router
- Usar Server Components por padrão
- Marcar com `"use client"` apenas quando necessário (hooks, interatividade)
- Layouts compartilhados em `layout.tsx`
- Loading states em `loading.tsx`
