# Stack e Estrutura do Projeto - Pet Care

## Stack Principal

- **Framework:** Next.js 14+ com App Router
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS
- **Fonte:** Inter (via `next/font/google`)
- **Validação de formulários:** Zod
- **Linting:** ESLint com configuração padrão do Next.js
- **Design:** Responsivo, abordagem mobile-first

## Estrutura de Pastas

```
/app          → Rotas e páginas (App Router)
/components   → Componentes reutilizáveis da UI
/contexts     → Context providers do React
/types        → Tipos e interfaces TypeScript
/mocks        → Dados mock para desenvolvimento
```

## Convenções de Código

- Componentes utilizam `export default` e são nomeados em PascalCase
- Arquivos de componentes usam PascalCase (ex: `PetCard.tsx`)
- Tipos e interfaces ficam em `/types` e são exportados com `export`
- Usar `"use client"` apenas quando necessário (interatividade, hooks de estado)
- Preferir Server Components sempre que possível
- Estilização feita exclusivamente com classes utilitárias do Tailwind
- Formulários validados com schemas Zod antes do submit
- Responsividade segue breakpoints do Tailwind (`sm`, `md`, `lg`, `xl`)

## Padrões de Implementação

- Imports absolutos com alias `@/` apontando para a raiz do projeto
- Não usar `any` — tipar tudo explicitamente
- Dados mock em `/mocks` exportam arrays/objetos tipados
- Context providers envolvem a aplicação em `/app/layout.tsx`
- Erros de validação Zod são exibidos inline nos formulários
