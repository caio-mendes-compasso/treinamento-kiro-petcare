# Identidade Visual - Pet Care

## Paleta de Cores

| Token         | Cor        | Uso                                      |
|---------------|------------|------------------------------------------|
| `primary`     | `#0D7377`  | Botões, links, elementos de destaque     |
| `primary-dark`| `#0A5C5F`  | Hover de botões, bordas ativas           |
| `primary-light`| `#10908F` | Backgrounds sutis, badges                |
| `background`  | `#FFFFFF`  | Fundo principal das páginas              |
| `surface`     | `#F9FAFB`  | Cards, seções alternadas                 |
| `text`        | `#1F2937`  | Texto principal (gray-800)               |
| `text-muted`  | `#6B7280`  | Texto secundário (gray-500)              |
| `border`      | `#E5E7EB`  | Bordas e divisores (gray-200)            |
| `error`       | `#DC2626`  | Mensagens de erro, validação             |
| `success`     | `#16A34A`  | Confirmações, status positivo            |

## Configuração Tailwind

Estender o `tailwind.config.ts` com as cores do tema:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#0D7377',
        dark: '#0A5C5F',
        light: '#10908F',
      },
    },
  },
}
```

## Diretrizes de Uso

### Botões
- Primário: `bg-primary text-white hover:bg-primary-dark`
- Secundário/outline: `border border-primary text-primary hover:bg-primary hover:text-white`
- Desabilitado: `bg-gray-300 text-gray-500 cursor-not-allowed`

### Tipografia
- Títulos: `text-gray-800 font-bold`
- Corpo: `text-gray-700`
- Auxiliar: `text-gray-500 text-sm`

### Cards e Containers
- Card padrão: `bg-white rounded-lg shadow-sm border border-gray-200 p-4`
- Seção destacada: `bg-gray-50 rounded-lg p-6`

### Links
- Padrão: `text-primary hover:text-primary-dark underline-offset-2 hover:underline`

### Inputs
- Normal: `border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary`
- Erro: `border-red-500 focus:ring-red-500`

### Espaçamento
- Padding de página: `px-4 py-6 md:px-8 md:py-8`
- Gap entre elementos: `gap-4` (padrão), `gap-6` (seções)
