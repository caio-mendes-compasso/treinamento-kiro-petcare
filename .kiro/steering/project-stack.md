# Stack e Estrutura do Projeto - Pet Care

## Stack Principal

- **Framework:** Next.js 14+ com App Router
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS
- **Fonte:** Inter (Google Fonts via next/font)
- **Linting:** ESLint
- **Validação de formulários:** Zod
- **Abordagem responsiva:** Mobile-first

## Estrutura de Pastas

```
/app          → Rotas e páginas (App Router)
/components   → Componentes reutilizáveis da UI
/contexts     → React Contexts para estado global
/types        → Tipos e interfaces TypeScript
/mocks        → Dados mockados para desenvolvimento
```

## Convenções

### Componentes
- Usar function components com arrow functions
- Nomes de componentes em PascalCase
- Um componente por arquivo
- Colocar componentes específicos de página em subpastas dentro de `/components`

### TypeScript
- Sempre tipar props com interfaces (prefixo `Props` no nome, ex: `ButtonProps`)
- Evitar `any` — usar tipos explícitos ou `unknown`
- Definir tipos compartilhados em `/types`

### Estilização
- Usar classes utilitárias do Tailwind diretamente nos elementos
- Mobile-first: estilizar para mobile e usar breakpoints (`sm:`, `md:`, `lg:`) para telas maiores
- Evitar CSS customizado quando Tailwind resolver

### Formulários
- Validar todos os formulários com schemas Zod
- Definir schemas junto ao componente do formulário ou em `/types`
- Mostrar mensagens de erro inline nos campos

### Dados Mock
- Manter dados mockados em `/mocks` com tipagem TypeScript
- Simular estrutura de resposta de API real

### Imports
- Usar path aliases (`@/`) para imports absolutos
- Organizar imports: React/Next → libs externas → componentes → tipos → mocks
