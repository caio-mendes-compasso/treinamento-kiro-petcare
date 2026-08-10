# Identidade Visual - Pet Care

## Paleta de Cores

- **Primária:** Azul petróleo `#0D7377`
- **Fundo:** Branco `#FFFFFF`
- **Texto principal:** Cinza escuro `#1F2937` (gray-800)
- **Texto secundário:** Cinza médio `#6B7280` (gray-500)
- **Borda/Divisor:** Cinza claro `#E5E7EB` (gray-200)
- **Hover primário:** `#0A5C5F` (tom mais escuro do primário)
- **Destaque suave:** `#E6F4F4` (tom claro do primário para backgrounds sutis)

## Configuração Tailwind

As cores customizadas devem ser registradas em `tailwind.config.ts`:

```ts
colors: {
  primary: {
    DEFAULT: '#0D7377',
    dark: '#0A5C5F',
    light: '#E6F4F4',
  },
}
```

Usar as classes `bg-primary`, `text-primary`, `bg-primary-dark`, `bg-primary-light` nos componentes.

## Tipografia

- **Fonte:** Inter (via `next/font/google`)
- **Títulos:** `font-bold` ou `font-semibold`
- **Corpo:** `font-normal`, tamanho base (`text-base` / `text-sm`)

## Componentes Visuais

- Botões primários: `bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark`
- Botões secundários: `border border-primary text-primary rounded-lg px-4 py-2 hover:bg-primary-light`
- Cards: `bg-white rounded-xl shadow-sm border border-gray-200 p-4`
- Inputs: `border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent`

## Diretrizes Gerais

- Manter contraste adequado (WCAG AA) entre texto e fundo
- Usar `bg-primary-light` para destacar seções ou estados ativos
- Ícones seguem a cor do texto ou primária conforme contexto
- Espaçamentos consistentes com a escala do Tailwind (`p-4`, `gap-4`, `mb-6`)
- Cantos arredondados padrão: `rounded-lg` para elementos interativos, `rounded-xl` para cards
