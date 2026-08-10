# Implementation Plan: Layout Base

## Overview

Implementação da estrutura de navegação fundamental do portal Pet Care: AuthContext para gerenciamento de estado, Header com navegação condicional, Footer com informações de contato, MobileMenu com sidebar, middleware de proteção de rotas, e criação de todas as páginas da aplicação. A implementação segue a abordagem mobile-first com Tailwind CSS e Next.js App Router.

## Tasks

- [x] 1. Criar tipos, constantes e AuthContext
  - [x] 1.1 Criar interfaces e tipos base em `/types`
    - Criar arquivo `types/navigation.ts` com interfaces `NavigationItem`, `ContactInfo`, `FooterLink`
    - Criar arquivo `types/auth.ts` com interfaces `User`, `AuthContextType`, `AuthState`
    - Exportar as constantes de navegação `PUBLIC_NAV`, `AUTH_NAV`, `PROTECTED_ROUTES`
    - _Requirements: 3.1, 4.1, 7.9_

  - [x] 1.2 Implementar o AuthContext (`contexts/AuthContext.tsx`)
    - Criar o AuthProvider como Client Component com `"use client"`
    - Implementar estado `isAuthenticated`, `user`, `loading`
    - Implementar funções `login()` e `logout()` com persistência via cookie
    - Implementar hook `useAuth()` com erro descritivo se fora do provider
    - Gerenciar estado `loading` durante verificação inicial de autenticação
    - _Requirements: 3.1, 3.4, 4.1, 4.3, 4.5_

  - [x]* 1.3 Escrever testes unitários para o AuthContext
    - Testar que `useAuth()` lança erro fora do provider
    - Testar que `login()` atualiza estado para autenticado
    - Testar que `logout()` atualiza estado para não autenticado
    - Testar que `loading` inicia como `true` e resolve
    - _Requirements: 3.4, 4.3, 4.5_

- [x] 2. Implementar o Footer (Server Component)
  - [x] 2.1 Criar o componente Footer (`components/Footer.tsx`)
    - Implementar como Server Component (sem `"use client"`)
    - Exibir informações de contato: email, telefone, endereço
    - Exibir mínimo 3 links de navegação auxiliar
    - Aplicar `bg-primary` (#0D7377) com texto branco (#FFFFFF)
    - Layout responsivo: coluna única em mobile, 3 colunas em desktop (grid md:grid-cols-3)
    - Padding horizontal de 16px em mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.2_

  - [x]* 2.2 Escrever testes unitários para o Footer
    - Testar presença de email, telefone e endereço
    - Testar que há pelo menos 3 links de navegação
    - Testar classes de layout responsivo (flex-col e md:grid-cols-3)
    - Testar cores bg-primary e text-white
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 3. Implementar o Header e MobileMenu
  - [x] 3.1 Criar o componente Header (`components/Header.tsx`)
    - Implementar como Client Component com `"use client"` (consome AuthContext)
    - Exibir logo "Pet Care" à esquerda com `text-xl font-bold`
    - Aplicar `bg-primary` (#0D7377), texto branco, sticky top-0, z-10+, h-16, px-4, w-full
    - Renderizar Menu_Público quando `isAuthenticated === false` ou `loading === true`
    - Renderizar Menu_Autenticado + botão Logout quando `isAuthenticated === true`
    - Exibir links inline em desktop (≥ 768px), ocultar em mobile
    - Exibir HamburgerButton em mobile (< 768px), ocultar em desktop
    - Botão hamburger com área de toque mínima 44x44px
    - Link Login estilizado como botão (`bg-white text-primary rounded-lg`)
    - Botão Logout estilizado como botão (visualmente distinto dos links)
    - Hover em elementos interativos aplica `hover:bg-primary-dark`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.4, 5.1, 5.2, 8.2, 8.3, 9.1, 9.3_

  - [x] 3.2 Criar o componente MobileMenu (`components/MobileMenu.tsx`)
    - Implementar como Client Component com props `isOpen`, `onClose`, `isAuthenticated`, `onLogout`
    - Renderizar sidebar com transição slide-in da esquerda (duration-300)
    - Renderizar backdrop semi-transparente
    - Fechar ao clicar em link de navegação
    - Fechar ao clicar no backdrop
    - Fechar com tecla Escape e retornar foco ao HamburgerButton
    - Aplicar `aria-modal="true"`, `role="dialog"`, focus trap
    - Exibir links correspondentes ao estado de autenticação
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 8.4_

  - [x]* 3.3 Escrever testes unitários para Header
    - Testar logo "Pet Care" com classes text-xl font-bold
    - Testar bg-primary, sticky, z-10+ no Header
    - Testar Menu_Público exibido quando não autenticado (3 links)
    - Testar Login estilizado como botão
    - Testar Menu_Autenticado exibido quando autenticado (4 links + Logout)
    - Testar que Menu_Autenticado não aparece quando não autenticado
    - Testar que Menu_Público não aparece quando autenticado
    - Testar Logout chama logout() e redireciona para /
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4_

  - [x]* 3.4 Escrever testes unitários para MobileMenu
    - Testar abertura com transição ao clicar hamburger
    - Testar fechamento ao clicar em link
    - Testar fechamento ao clicar backdrop
    - Testar fechamento com Escape e retorno de foco
    - Testar ARIA attributes (aria-modal, role="dialog")
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [x]* 3.5 Escrever teste de propriedade para navegação condicional
    - **Property 3: Navigation items rendered match authentication state**
    - Para qualquer estado de autenticação, os itens renderizados correspondem exatamente ao conjunto esperado (PUBLIC_NAV ou AUTH_NAV), sem sobreposição
    - **Validates: Requirements 3.1, 3.3, 4.1, 4.4**

- [x] 4. Checkpoint - Verificar componentes base
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Configurar rotas e páginas da aplicação
  - [x] 5.1 Criar as páginas de rotas públicas
    - Criar `app/page.tsx` (Home) com heading "Pet Care"
    - Criar `app/login/page.tsx` com heading "Login"
    - Criar `app/planos/page.tsx` com heading "Planos"
    - Cada página como Server Component com conteúdo placeholder
    - _Requirements: 7.1, 7.2, 7.3, 7.11_

  - [x] 5.2 Criar as páginas de rotas protegidas
    - Criar `app/pets/page.tsx` com heading "Meus Pets"
    - Criar `app/agenda/page.tsx` com heading "Agenda"
    - Criar `app/financeiro/page.tsx` com heading "Financeiro"
    - Criar `app/carteirinha/page.tsx` com heading "Carteirinha"
    - Cada página como Server Component com conteúdo placeholder
    - _Requirements: 7.4, 7.5, 7.6, 7.7_

  - [x] 5.3 Criar página 404 (`app/not-found.tsx`)
    - Exibir mensagem indicando que o conteúdo não foi encontrado
    - Link para voltar à Home
    - _Requirements: 7.10_

- [x] 6. Integrar Layout Wrapper e Middleware
  - [x] 6.1 Atualizar `app/layout.tsx` com AuthProvider, Header e Footer
    - Importar e envolver children com AuthProvider
    - Renderizar Header acima do conteúdo
    - Renderizar Footer abaixo do conteúdo
    - Aplicar flex-grow na área de conteúdo (main com `flex-1`)
    - Garantir estrutura flex column com min-h-screen
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.8_

  - [x] 6.2 Implementar middleware de proteção de rotas (`middleware.ts`)
    - Criar arquivo `middleware.ts` na raiz do projeto
    - Verificar cookie de autenticação nas rotas protegidas
    - Redirecionar para `/login` se cookie ausente
    - Configurar matcher: `["/pets", "/agenda", "/financeiro", "/carteirinha"]`
    - Permitir acesso irrestrito a rotas públicas (`/`, `/login`, `/planos`)
    - _Requirements: 7.9, 7.11_

  - [x]* 6.3 Escrever teste de propriedade para proteção de rotas
    - **Property 1: Protected routes redirect unauthenticated users**
    - Para qualquer rota protegida e um usuário não autenticado, o middleware redireciona para `/login`
    - **Validates: Requirements 7.9**

  - [x]* 6.4 Escrever teste de propriedade para rotas públicas
    - **Property 2: Public routes are accessible regardless of authentication state**
    - Para qualquer rota pública e qualquer estado de autenticação, o sistema renderiza sem redirecionamento
    - **Validates: Requirements 7.11**

- [x] 7. Final checkpoint - Garantir integração completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia requirements específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Property tests validam propriedades universais de corretude (navegação condicional e proteção de rotas)
- Unit tests validam exemplos específicos e edge cases
- A implementação usa TypeScript com Tailwind CSS seguindo abordagem mobile-first
- Componentes seguem convenções do projeto: PascalCase, `export default`, Client Components apenas quando necessário

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["1.3", "2.2", "5.1", "5.2", "5.3"] },
    { "id": 3, "tasks": ["3.1"] },
    { "id": 4, "tasks": ["3.2"] },
    { "id": 5, "tasks": ["3.3", "3.4", "3.5"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["6.2"] },
    { "id": 8, "tasks": ["6.3", "6.4"] }
  ]
}
```
