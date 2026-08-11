# Implementation Plan: Layout Base

## Overview

Implementação da estrutura visual base do portal Pet Care: Header com navegação condicional, Footer informativo, Sidebar mobile com focus trap, LayoutWrapper global e rotas placeholder. Abordagem incremental começando pela tipagem e dados mock, seguido pelos componentes individuais, e finalizando com integração no layout.

## Tasks

- [x] 1. Definir tipos e dados de navegação
  - [x] 1.1 Criar tipos TypeScript de navegação em `/types/navigation.ts`
    - Definir e exportar o tipo `NavItem` com propriedades: `label` (string), `href` (string), `visibility` (`"public" | "authenticated"`), `type` (`"link" | "button"`)
    - Definir e exportar o tipo `NavigationConfig` como array de `NavItem`
    - _Requirements: 9.1, 9.2_

  - [x] 1.2 Criar dados mock de navegação em `/mocks/navigation.ts`
    - Exportar array `navigationItems` do tipo `NavigationConfig` com os 8 itens: Home, Planos, Login (public) e Meus Pets, Agenda, Financeiro, Carteirinha, Logout (authenticated)
    - Usar tipagem importada de `@/types/navigation.ts`
    - _Requirements: 2.1, 2.2, 9.3_

- [x] 2. Implementar AuthContext
  - [x] 2.1 Criar AuthContext e AuthProvider em `/contexts/AuthContext.tsx`
    - Marcar com `"use client"`
    - Definir interface `AuthContextType` com `isAuthenticated: boolean`, `login: () => void`, `logout: () => void`
    - Implementar `AuthProvider` com useState controlando estado de autenticação (iniciar como `false`)
    - Exportar hook `useAuth()` que retorna o contexto, com fallback seguro (não autenticado) caso Provider esteja ausente
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Implementar componente Footer
  - [x] 3.1 Criar Footer em `/components/layout/Footer.tsx`
    - Server Component (sem `"use client"`)
    - Usar elemento semântico `<footer>` como container
    - Aplicar `bg-gray-900 text-gray-300` como estilo base
    - Exibir telefone `(16) 5555-3553`, email `contato@petcare.com`, links institucionais (Termos de Uso, Política de Privacidade, Fale Conosco com `href="#"`), copyright `© 2025 Pet Care`
    - Layout responsivo: coluna única em mobile (`flex-col`), múltiplas colunas em desktop (`md:flex-row` ou grid)
    - Aplicar `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2` nos links interativos
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 8.5_

- [x] 4. Implementar componente Sidebar
  - [x] 4.1 Criar Sidebar em `/components/layout/Sidebar.tsx`
    - Marcar com `"use client"`
    - Definir props: `isOpen: boolean`, `onClose: () => void`, `navItems: NavItem[]`, `currentPath: string`
    - Importar tipos de `@/types/navigation.ts`
    - Renderizar overlay escuro (opacidade 50%+) que fecha sidebar ao clicar
    - Renderizar painel lateral com botão fechar (X) com `aria-label="Fechar menu de navegação"`
    - Renderizar links de navegação com estilos ativo/inativo conforme `currentPath`
    - Aplicar `aria-hidden="true"` quando fechada, não renderizar overlay quando fechada
    - Fechar ao clicar em link, overlay, botão X
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.3, 9.3, 9.4_

  - [x] 4.2 Implementar focus trap e atalhos de teclado na Sidebar
    - Implementar focus trap manual: Tab cicla entre elementos focáveis do painel, Shift+Tab cicla reverso
    - Fechar sidebar ao pressionar tecla Escape e retornar foco para o Hamburger_Icon (via callback)
    - Garantir área de toque mínima de 44x44px nos elementos interativos em mobile
    - _Requirements: 3.8, 3.10, 6.6, 8.4_

  - [x] 4.3 Implementar proteção contra cliques rápidos na Sidebar
    - Garantir que múltiplos cliques rápidos no Hamburger_Icon mantenham estado consistente (sem flicker)
    - Utilizar batching de React setState para garantir consistência
    - _Requirements: 3.9_

- [x] 5. Implementar componente Header
  - [x] 5.1 Criar Header em `/components/layout/Header.tsx`
    - Marcar com `"use client"`
    - Usar `useAuth()` para determinar items de navegação e `usePathname()` para rota ativa
    - Usar elemento semântico `<header>` como container com `sticky top-0 z-50 bg-white shadow-sm`
    - Aplicar `border-b border-gray-200`
    - Conteúdo interno com `px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto`
    - Renderizar logo: emoji 🐾 + texto "Pet Care" como link com `href="/"`, `font-bold text-xl text-primary-500`, `aria-label="Pet Care - Ir para página inicial"`
    - Usar `<nav>` com `aria-label="Navegação principal"`
    - Importar tipos de `@/types/navigation.ts` e items de `@/mocks/navigation.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 8.6, 9.3, 9.4_

  - [x] 5.2 Implementar navegação desktop no Header
    - Exibir links inline com `space-x-6` quando viewport >= md (768px): `hidden md:flex`
    - Filtrar `navigationItems` por `visibility` conforme estado de autenticação
    - Aplicar estilo ativo (`text-primary-500 font-semibold`) ao link cujo `href` === pathname atual
    - Aplicar estilo inativo (`text-gray-700 hover:text-primary-500`) aos demais links
    - Botão Logout chama `logout()` do AuthContext
    - Aplicar `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2` em todos os links/botões
    - Navegação completa via teclado (Tab) seguindo ordem visual
    - _Requirements: 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.2_

  - [x] 5.3 Implementar Hamburger button e integração com Sidebar no Header
    - Exibir botão hamburger apenas em mobile: `md:hidden`
    - Atributo `aria-label="Abrir menu de navegação"` no hamburger
    - Gerenciar estado `isSidebarOpen` com useState
    - Passar props para componente Sidebar: `isOpen`, `onClose`, `navItems` (filtrados), `currentPath`
    - Garantir que ao transicionar para desktop (>= md), sidebar fecha automaticamente via useEffect com matchMedia
    - _Requirements: 1.6, 3.1, 6.2, 6.5, 8.3_

- [x] 6. Checkpoint - Verificar componentes individuais
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementar LayoutWrapper e integração no layout
  - [x] 7.1 Criar LayoutWrapper em `/components/layout/LayoutWrapper.tsx`
    - Server Component (sem `"use client"`)
    - Aceitar prop `children: React.ReactNode`
    - Renderizar container flex vertical (`flex flex-col min-h-screen`)
    - Renderizar Header como primeiro elemento
    - Renderizar `<main className="flex-grow">` com `{children}` entre Header e Footer
    - Renderizar Footer como último elemento
    - Garantir que Footer fica no bottom mesmo com conteúdo menor que viewport
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Integrar AuthProvider e LayoutWrapper no `app/layout.tsx`
    - Envolver `{children}` com `AuthProvider` e dentro dele o `LayoutWrapper`
    - Manter configuração existente de fonte Inter e metadata
    - Garantir abordagem mobile-first sem overflow horizontal de 320px a 1280px
    - _Requirements: 5.3, 6.1, 6.3, 6.4_

- [x] 8. Criar rotas placeholder
  - [x] 8.1 Criar páginas placeholder para rotas públicas
    - Criar `/app/login/page.tsx` com `<h1>Login</h1>` como Server Component default export
    - Criar `/app/planos/page.tsx` com `<h1>Planos</h1>` como Server Component default export
    - _Requirements: 7.1, 7.2_

  - [x] 8.2 Criar páginas placeholder para rotas autenticadas
    - Criar `/app/pets/page.tsx` com `<h1>Meus Pets</h1>` como Server Component default export
    - Criar `/app/agenda/page.tsx` com `<h1>Agenda</h1>` como Server Component default export
    - Criar `/app/financeiro/page.tsx` com `<h1>Financeiro</h1>` como Server Component default export
    - Criar `/app/carteirinha/page.tsx` com `<h1>Carteirinha</h1>` como Server Component default export
    - _Requirements: 7.3, 7.4, 7.5, 7.6_

- [x] 9. Checkpoint - Validação final de integração
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Testes automatizados
  - [ ]* 10.1 Write property test: Navigation filtering by authentication state
    - **Property 1: Navigation filtering by authentication state**
    - **Validates: Requirements 2.1, 2.2**
    - Gerar arrays aleatórios de NavItem com visibility mista + boolean auth state
    - Verificar que apenas items com visibility correta aparecem, na ordem original

  - [ ]* 10.2 Write property test: Active route styling is mutually exclusive
    - **Property 2: Active route styling is mutually exclusive and correct**
    - **Validates: Requirements 2.4, 2.5**
    - Gerar pathnames aleatórios + arrays de NavItem com hrefs aleatórios
    - Verificar que exatamente os items com href === pathname recebem estilo ativo

  - [ ]* 10.3 Write property test: Focus trap containment
    - **Property 3: Focus trap containment**
    - **Validates: Requirements 3.8**
    - Gerar sequências aleatórias de Tab/Shift+Tab keypresses
    - Verificar que focus nunca escapa do container da Sidebar

  - [ ]* 10.4 Write property test: LayoutWrapper children pass-through
    - **Property 4: LayoutWrapper children pass-through**
    - **Validates: Requirements 5.5**
    - Gerar conteúdo React aleatório (strings, elementos)
    - Verificar que conteúdo aparece inalterado no main

  - [ ]* 10.5 Write unit tests for Header component
    - Testar renderização do logo com href="/", classes sticky, HTML semântico, aria-labels
    - Testar nav links visíveis e hamburger hidden em md+
    - Testar hamburger visível e nav links hidden em <md
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 8.1, 8.2, 8.6_

  - [ ]* 10.6 Write unit tests for Sidebar component
    - Testar abertura ao clicar hamburger, fechamento via overlay/X/Escape/link
    - Testar toggling de aria-hidden
    - Testar navegação por teclado entre links e botão fechar
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.10, 8.3, 8.4_

  - [ ]* 10.7 Write unit tests for Footer component
    - Testar conteúdo estático: telefone, email, links, copyright
    - Testar elemento semântico `<footer>`
    - Testar focus rings nos links
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 8.5_

  - [ ]* 10.8 Write unit tests for LayoutWrapper and AuthContext
    - Testar ordem de renderização (Header → main → Footer)
    - Testar flex column + min-h-screen
    - Testar que logout muda estado para não autenticado
    - _Requirements: 5.1, 5.2, 5.4, 2.3_

- [x] 11. Final checkpoint - Build e validação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- O projeto usa TypeScript com Next.js 14 App Router e Tailwind CSS
- Componentes `"use client"` apenas onde necessário (Header, Sidebar, AuthContext)
- Footer e LayoutWrapper são Server Components

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["3.1", "4.1", "8.1", "8.2"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3"] },
    { "id": 5, "tasks": ["7.1"] },
    { "id": 6, "tasks": ["7.2"] },
    { "id": 7, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7", "10.8"] }
  ]
}
```
