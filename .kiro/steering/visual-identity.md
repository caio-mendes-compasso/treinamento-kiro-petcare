# Identidade Visual - Pet Care

## Paleta de Cores

### Cor Primária
- **Azul Petróleo**: `#0D7377`
- Usar como cor principal para botões, links, ícones ativos e destaques
- Variações sugeridas:
  - Lighter: `#10908F` (hover states)
  - Darker: `#095B5E` (active/pressed states)
  - Lightest: `#E6F4F4` (backgrounds sutis, badges)

### Cor de Fundo
- **Branco**: `#FFFFFF` como fundo principal
- `#F9FAFB` (gray-50) para seções alternadas ou cards

### Cores Neutras
- Texto principal: `#111827` (gray-900)
- Texto secundário: `#6B7280` (gray-500)
- Bordas: `#E5E7EB` (gray-200)
- Divisores: `#F3F4F6` (gray-100)

### Cores Semânticas
- Sucesso: `#10B981` (emerald-500)
- Erro: `#EF4444` (red-500)
- Alerta: `#F59E0B` (amber-500)
- Info: `#0D7377` (mesma primária)

## Configuração Tailwind

No `tailwind.config.ts`, a cor primária está configurada assim:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#E6F4F4',
        100: '#CCE9E9',
        200: '#99D3D4',
        300: '#66BDBF',
        400: '#33A7A9',
        500: '#0D7377',
        600: '#0B5F62',
        700: '#095B5E',
        800: '#064345',
        900: '#042E30',
      },
    },
  },
}
```

Também existem keyframes e animações customizadas:
- `toast-in`: animação de entrada para componentes Toast (fade-in + slide-up)

## Regras de Uso

### Botões
- Primário: `bg-primary-500 text-white hover:bg-primary-600`
- Secundário: `border border-primary-500 text-primary-500 hover:bg-primary-50`
- Desabilitado: `bg-gray-300 text-gray-500 cursor-not-allowed`

### Links
- Padrão: `text-primary-500 hover:text-primary-600 underline`
- Navegação: `text-gray-700 hover:text-primary-500`

### Cards e Containers
- Fundo branco com sombra sutil: `bg-white rounded-lg shadow-sm border border-gray-200`
- Padding padrão: `p-4 md:p-6`

### Tipografia
- Headings: `text-gray-900 font-semibold`
- Body: `text-gray-700`
- Caption/Helper: `text-gray-500 text-sm`

### Ícones e Elementos Ativos
- Ícones ativos/selecionados: `text-primary-500`
- Ícones inativos: `text-gray-400`

### Focus States (Acessibilidade)
- Usar `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2` em elementos interativos

## Espaçamento Padrão

- Entre seções: `space-y-8` ou `gap-8`
- Entre cards: `gap-4 md:gap-6`
- Padding de página: `px-4 md:px-6 lg:px-8`
- Border radius padrão: `rounded-lg` (8px)
