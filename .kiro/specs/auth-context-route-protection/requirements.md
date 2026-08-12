# Requirements Document

## Introduction

Este documento define os requisitos para a feature de autenticação e proteção de rotas do portal Pet Care. A feature refatora o AuthContext existente para incluir dados do usuário (nome e email), persistência de sessão via localStorage, e implementa um mecanismo de proteção de rotas que redireciona visitantes não autenticados para a página de login. O objetivo é diferenciar visitantes de usuários logados, protegendo áreas restritas e oferecendo uma experiência personalizada.

## Glossary

- **AuthContext**: Context API do React responsável por gerenciar e expor o estado de autenticação globalmente na aplicação
- **AuthProvider**: Componente Provider que encapsula a árvore de componentes e fornece o estado de autenticação via AuthContext
- **User**: Objeto que representa o usuário autenticado, contendo nome e email
- **ProtectedRoute**: Componente wrapper client-side que verifica autenticação e redireciona para /login caso o usuário não esteja autenticado
- **Token**: String fictícia armazenada em localStorage sob a chave `petcare_token` para simular persistência de sessão
- **Loading_State**: Estado intermediário exibido enquanto o AuthProvider verifica a existência de token no localStorage durante a inicialização
- **Route_Group**: Mecanismo do Next.js App Router que permite agrupar rotas sob um layout compartilhado sem afetar a URL (padrão `(nome)`)

## Requirements

### Requirement 1: Tipagem do módulo de autenticação

**User Story:** Como desenvolvedor, quero tipos TypeScript bem definidos para o módulo de autenticação, para que o código seja seguro e autocompletável.

#### Acceptance Criteria

1. THE Auth_Module SHALL export uma interface `User` com as propriedades `nome` (string) e `email` (string)
2. THE Auth_Module SHALL export uma interface `AuthContextType` com as propriedades `user` (User | null), `isAuthenticated` (boolean), `isLoading` (boolean), `login` (função que recebe email e senha como strings e retorna Promise<boolean>, onde true indica autenticação bem-sucedida e false indica credenciais inválidas) e `logout` (função síncrona que retorna void)
3. THE Auth_Module SHALL definir os tipos em `/types/auth.ts` como arquivo dedicado, e todos os módulos consumidores (AuthContext, Header, ProtectedRoute, mock auth) SHALL importar os tipos exclusivamente deste arquivo
4. WHEN o projeto é compilado com TypeScript strict mode, THE Auth_Module SHALL produzir zero erros de tipagem no arquivo `/types/auth.ts` e em todos os módulos que importam seus tipos

### Requirement 2: Gerenciamento de estado de autenticação

**User Story:** Como usuário, quero que o sistema mantenha meu estado de login, para que eu possa navegar entre páginas sem perder a sessão.

#### Acceptance Criteria

1. THE AuthProvider SHALL expor as propriedades `user` (objeto com `nome` e `email`, ou `null`), `isAuthenticated` (boolean), `isLoading` (boolean), `login` (função assíncrona) e `logout` (função síncrona) via AuthContext
2. WHEN o AuthProvider é montado, THE AuthProvider SHALL definir `isLoading` como true, verificar se existe um valor não-vazio na chave `petcare_token` do localStorage e na chave `petcare_user`, e definir `isLoading` como false após a conclusão da verificação
3. WHILE um valor não-vazio existe nas chaves `petcare_token` e `petcare_user` do localStorage, THE AuthProvider SHALL manter `isAuthenticated` como true e `user` com o objeto deserializado de `petcare_user` contendo `nome` e `email`
4. WHEN a função `login` é chamada com sucesso, THE AuthProvider SHALL armazenar o token na chave `petcare_token`, armazenar o objeto do usuário serializado na chave `petcare_user` do localStorage, definir `isAuthenticated` como true e `user` com os dados fornecidos
5. WHEN a função `logout` é chamada, THE AuthProvider SHALL remover as chaves `petcare_token` e `petcare_user` do localStorage, definir `isAuthenticated` como false e `user` como null
6. IF o localStorage não estiver disponível ou lançar exceção ao ser acessado, THEN THE AuthProvider SHALL inicializar com `isAuthenticated` false, `user` null e `isLoading` false, sem lançar erros para a aplicação

### Requirement 3: Fluxo de login com mock

**User Story:** Como usuário, quero fazer login com email e senha, para que eu possa acessar as áreas restritas do portal.

#### Acceptance Criteria

1. WHEN o usuário invoca `login` com um email válido e a senha "123456", THE AuthContext SHALL autenticar o usuário após um delay de exatamente 1000 milissegundos
2. WHEN a autenticação é bem-sucedida, THE AuthContext SHALL definir `user` como `{ nome: "Usuário PetCare", email: <email_informado> }` e `isAuthenticated` como true
3. WHEN a autenticação é bem-sucedida, THE AuthContext SHALL armazenar um token fictício na chave `petcare_token` e o objeto User serializado na chave `petcare_user` do localStorage
4. WHEN a autenticação é bem-sucedida, THE AuthContext SHALL retornar `true` na Promise do login
5. WHEN o usuário invoca `login` com uma senha diferente de "123456", THE AuthContext SHALL retornar `false` na Promise do login após o delay de 1000ms sem alterar `user`, `isAuthenticated` ou localStorage
6. WHEN o usuário invoca `login` com um email que não contém "@" seguido de domínio com "." e pelo menos dois caracteres, THE AuthContext SHALL retornar `false` na Promise do login após o delay de 1000ms sem alterar o estado

### Requirement 4: Fluxo de logout

**User Story:** Como usuário, quero encerrar minha sessão de forma segura, para que meus dados não fiquem acessíveis no navegador.

#### Acceptance Criteria

1. WHEN o usuário invoca `logout`, THE AuthContext SHALL definir `user` como null e `isAuthenticated` como false
2. WHEN o usuário invoca `logout`, THE AuthContext SHALL remover as chaves `petcare_token` e `petcare_user` do localStorage
3. WHEN o usuário invoca `logout` e o estado e o localStorage foram limpos com sucesso, THE AuthContext SHALL redirecionar o navegador para a rota `/` utilizando o router do Next.js (useRouter de next/navigation)
4. IF o localStorage não estiver disponível durante o logout, THEN THE AuthContext SHALL ainda assim definir `user` como null e `isAuthenticated` como false e redirecionar para a rota `/` sem lançar erros

### Requirement 5: Proteção de rotas autenticadas

**User Story:** Como dono do produto, quero que rotas restritas estejam protegidas, para que visitantes não autenticados não acessem conteúdo privado.

#### Acceptance Criteria

1. THE ProtectedRoute SHALL envolver as rotas `/pets`, `/agenda`, `/financeiro` e `/carteirinha` utilizando um Route_Group `(protected)` com layout compartilhado em `/app/(protected)/layout.tsx`
2. WHILE o AuthProvider está verificando o estado inicial de autenticação (isLoading === true), THE ProtectedRoute SHALL exibir um loading spinner centralizado vertical e horizontalmente no viewport
3. THE Loading_State SHALL comunicar o estado de carregamento para tecnologias assistivas utilizando `aria-live="polite"` e `role="status"`
4. IF a verificação de autenticação concluir e o usuário não estiver autenticado (`isAuthenticated === false` e `isLoading === false`), THEN THE ProtectedRoute SHALL redirecionar para `/login`
5. IF a verificação de autenticação concluir e o usuário estiver autenticado (`isAuthenticated === true`), THEN THE ProtectedRoute SHALL renderizar o conteúdo da página protegida (children)

### Requirement 6: Redirecionamento da página de login

**User Story:** Como usuário autenticado, quero ser redirecionado automaticamente ao acessar /login, para que eu não veja a tela de login desnecessariamente.

#### Acceptance Criteria

1. WHEN um usuário autenticado (`isAuthenticated === true` e `isLoading === false`) acessa a rota `/login`, THE Login_Page SHALL redirecionar para `/pets`
2. WHEN um usuário não autenticado (`isAuthenticated === false` e `isLoading === false`) acessa a rota `/login`, THE Login_Page SHALL renderizar o conteúdo de login normalmente
3. WHILE o AuthProvider está verificando o estado inicial (isLoading === true), THE Login_Page SHALL exibir um indicador de carregamento em vez de exibir brevemente o formulário de login

### Requirement 7: Renderização condicional do Header

**User Story:** Como usuário, quero que o menu de navegação reflita meu estado de login, para que eu veja apenas os links relevantes ao meu contexto.

#### Acceptance Criteria

1. WHILE o usuário está autenticado, THE Header SHALL renderizar apenas os itens de navegação com visibility "authenticated" (Meus Pets, Agenda, Financeiro, Carteirinha, Logout) e não renderizar no DOM os itens com visibility "public"
2. WHILE o usuário não está autenticado, THE Header SHALL renderizar apenas os itens de navegação com visibility "public" (Home, Planos, Login) e não renderizar no DOM os itens com visibility "authenticated"
3. WHEN o estado de autenticação muda (login ou logout), THE Header SHALL atualizar a exibição dos itens de navegação no mesmo ciclo de renderização, sem necessidade de recarregar a página
4. WHEN o usuário clica no item "Logout" (type "button"), THE Header SHALL invocar a função logout do AuthContext, transitando o estado para não autenticado e exibindo os itens com visibility "public"

### Requirement 8: Dados mock de autenticação

**User Story:** Como desenvolvedor, quero que os dados mock de autenticação estejam centralizados, para que sejam fáceis de substituir por chamadas reais de API no futuro.

#### Acceptance Criteria

1. THE Auth_Mock SHALL ser definido em `/mocks/auth.ts` como módulo dedicado, exportando uma função `mockLogin(email: string, senha: string)` que retorna `Promise<{ success: boolean; user?: User }>`
2. WHEN `mockLogin` é invocada, THE Auth_Mock SHALL resolver a Promise após um delay de 1000 milissegundos, simulando latência de rede
3. THE Auth_Mock SHALL considerar o email válido quando a string contém exatamente um caractere "@" seguido de pelo menos um caractere, um "." e pelo menos dois caracteres após o ponto (ex: `x@y.zz`)
4. WHEN o email possui formato válido e a senha é exatamente "123456", THE Auth_Mock SHALL resolver a Promise com `{ success: true, user: { nome: "Usuário PetCare", email: <email_informado> } }`
5. IF o email não possui formato válido ou a senha não é "123456", THEN THE Auth_Mock SHALL resolver a Promise com `{ success: false }` sem lançar exceções
