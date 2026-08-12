# Implementation Plan: Auth Context & Route Protection

## Overview

Refatorar o módulo de autenticação existente do Pet Care para suportar dados de usuário, persistência via localStorage, proteção de rotas com Route Groups do Next.js App Router, e renderização condicional do Header. A implementação segue uma abordagem incremental: tipos → mock → AuthContext → proteção de rotas → Header → integração.

## Tasks

- [x] 1. Definir tipos e módulo mock de autenticação
  - [x] 1.1 Criar arquivo de tipos `/types/auth.ts`
    - Definir interface `User` com propriedades `nome` (string) e `email` (string)
    - Definir interface `AuthContextType` com `user`, `isAuthenticated`, `isLoading`, `login`, `logout`
    - Definir interface `MockLoginResponse` com `success` (boolean) e `user?` (User)
    - Exportar todos os tipos para consumo pelos demais módulos
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Criar módulo mock `/mocks/auth.ts`
    - Implementar função `mockLogin(email: string, senha: string): Promise<MockLoginResponse>`
    - Adicionar delay de 1000ms via `setTimeout` + `Promise`
    - Implementar validação de email com regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`
    - Validar senha exatamente igual a "123456"
    - Retornar `{ success: true, user: { nome: "Usuário PetCare", email } }` para credenciais válidas
    - Retornar `{ success: false }` para credenciais inválidas, sem lançar exceções
    - Importar tipos de `/types/auth.ts`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 1.3 Write property test for mockLogin - invalid credentials rejection
    - **Property 3: Invalid credentials are always rejected**
    - Gerar strings aleatórias que não passam na validação de email ou senhas diferentes de "123456"
    - Verificar que `mockLogin` retorna `{ success: false }` consistentemente
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 3.5, 3.6, 8.3, 8.5**

  - [x] 1.4 Write property test for mockLogin - valid credentials acceptance
    - **Property 4: Valid credentials always produce successful authentication**
    - Gerar emails válidos aleatórios que correspondem ao regex e usar senha "123456"
    - Verificar que `mockLogin` retorna `{ success: true, user: { nome: "Usuário PetCare", email } }`
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 3.1, 3.4, 8.4**

- [x] 2. Refatorar AuthContext com dados de usuário e persistência
  - [x] 2.1 Refatorar `/contexts/AuthContext.tsx`
    - Importar tipos de `/types/auth.ts` e `mockLogin` de `/mocks/auth.ts`
    - Adicionar estado `user` (User | null), manter `isAuthenticated`, adicionar `isLoading`
    - Implementar `useEffect` na montagem para verificar `petcare_token` e `petcare_user` no localStorage
    - Validar que `petcare_user` é JSON parseável com campos `nome` e `email` do tipo string
    - Se ambas as chaves existem e são válidas: definir `user` e `isAuthenticated: true`
    - Se não existem ou são inválidas: manter estado não autenticado
    - Definir `isLoading: false` após conclusão da verificação
    - Envolver todas operações de localStorage em try/catch
    - Implementar função `login(email, senha)` que chama `mockLogin`, persiste token e user no localStorage
    - Implementar função `logout()` que limpa localStorage, reseta estado e redireciona para `/` via `router.push`
    - Usar `useRouter` de `next/navigation` para redirecionamento no logout
    - Atualizar interface do contexto para `AuthContextType` de `/types/auth.ts`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4_

  - [x] 2.2 Write property test for login/session persistence round-trip
    - **Property 1: Login and session persistence round-trip**
    - Gerar emails válidos aleatórios, executar login, simular remontagem do provider
    - Verificar que `user` é restaurado com mesmo `nome` e `email`, e `isAuthenticated` é `true`
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 2.3, 2.4, 3.1, 3.2, 3.3**

  - [x] 2.3 Write property test for logout clearing state
    - **Property 2: Logout always clears authentication state**
    - Gerar estados autenticados aleatórios (com User válido em contexto e localStorage)
    - Executar logout e verificar que `user === null`, `isAuthenticated === false`
    - Verificar que `petcare_token` e `petcare_user` foram removidos do localStorage
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 2.5, 4.1, 4.2**

- [x] 3. Checkpoint - Verificar módulo de autenticação
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implementar proteção de rotas com Route Groups
  - [x] 4.1 Criar layout protegido `/app/(protected)/layout.tsx`
    - Criar arquivo como Client Component (`"use client"`)
    - Usar `useAuth()` para verificar `isLoading` e `isAuthenticated`
    - Enquanto `isLoading === true`: exibir loading spinner centralizado vertical e horizontalmente
    - Spinner deve ter `aria-live="polite"` e `role="status"` para acessibilidade
    - Se `isAuthenticated === false` e `isLoading === false`: redirecionar para `/login` via `router.push`
    - Se `isAuthenticated === true`: renderizar `children`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 4.2 Migrar rotas protegidas para Route Group `(protected)`
    - Mover `/app/pets/page.tsx` para `/app/(protected)/pets/page.tsx`
    - Mover `/app/agenda/page.tsx` para `/app/(protected)/agenda/page.tsx`
    - Mover `/app/financeiro/page.tsx` para `/app/(protected)/financeiro/page.tsx`
    - Mover `/app/carteirinha/page.tsx` para `/app/(protected)/carteirinha/page.tsx`
    - Remover os diretórios originais vazios
    - _Requirements: 5.1_

  - [x] 4.3 Refatorar `/app/login/page.tsx` com redirecionamento condicional
    - Tornar Client Component (`"use client"`)
    - Usar `useAuth()` para verificar `isLoading` e `isAuthenticated`
    - Se `isLoading === true`: exibir indicador de carregamento
    - Se `isAuthenticated === true` e `isLoading === false`: redirecionar para `/pets`
    - Se `isAuthenticated === false` e `isLoading === false`: renderizar conteúdo de login
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 5. Refatorar Header com logout e renderização condicional
  - [x] 5.1 Atualizar `/components/layout/Header.tsx`
    - Importar `user` do `useAuth()` além de `isAuthenticated` e `logout`
    - Garantir que o botão "Logout" invoca `logout()` do AuthContext (já implementado, validar comportamento com redirect)
    - Verificar que a filtragem de itens por `visibility` funciona corretamente com o novo AuthContext
    - Garantir que ao mudar estado de autenticação, os itens atualizam sem reload de página
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 5.2 Write property test for navigation item filtering
    - **Property 5: Navigation item filtering matches authentication state**
    - Gerar configurações de navegação aleatórias com itens mistos de visibility "public" e "authenticated"
    - Para qualquer boolean `isAuthenticated`, filtrar e verificar que resultado contém exclusivamente itens correspondentes
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 7.1, 7.2**

- [x] 6. Checkpoint - Verificar proteção de rotas e integração
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Testes unitários e integração final
  - [x] 7.1 Write unit tests for AuthProvider lifecycle
    - Testar que AuthProvider expõe todas as propriedades corretas
    - Testar ciclo mount → isLoading true → verificação → isLoading false
    - Testar localStorage indisponível não quebra aplicação
    - Testar JSON corrompido no localStorage é tratado graciosamente
    - Testar login com credenciais válidas persiste no localStorage
    - Testar logout limpa localStorage e redireciona para /
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 4.3, 4.4_

  - [x] 7.2 Write unit tests for ProtectedLayout and LoginPage
    - Testar que ProtectedLayout exibe spinner com aria-live durante loading
    - Testar redirecionamento para /login quando não autenticado
    - Testar renderização de children quando autenticado
    - Testar LoginPage redireciona para /pets quando autenticado
    - Testar LoginPage exibe loading durante verificação
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3_

  - [x] 7.3 Write integration tests for full auth flow
    - Testar fluxo completo: login → navegação em rota protegida → logout → redirecionamento
    - Testar persistência entre remount do provider (simular reload)
    - Testar Header atualiza itens ao mudar estado de autenticação
    - _Requirements: 2.4, 4.3, 7.3_

- [x] 8. Final checkpoint - Verificar implementação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- A implementação usa TypeScript strict mode conforme convenção do projeto
- Testes requerem instalação de `vitest`, `@testing-library/react`, `fast-check` e `jsdom` como devDependencies
- O módulo mock (`/mocks/auth.ts`) substitui o AuthContext atual e deve ser o único ponto de mudança para integração com API real

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "1.4", "2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "4.1", "4.3"] },
    { "id": 4, "tasks": ["4.2", "5.1"] },
    { "id": 5, "tasks": ["5.2", "7.1", "7.2"] },
    { "id": 6, "tasks": ["7.3"] }
  ]
}
```
