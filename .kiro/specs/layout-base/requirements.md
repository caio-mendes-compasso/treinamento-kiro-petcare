# Requirements Document

## Introduction

O portal Pet Care precisa de uma estrutura visual consistente composta por Header, Footer e Sidebar, aplicada em todas as páginas por meio de um layout wrapper global. A navegação deve se adaptar ao estado de autenticação do usuário (público vs autenticado) e ser totalmente responsiva, garantindo uma experiência profissional e fluida em dispositivos móveis, tablets e desktops.

## Glossary

- **Header**: Componente de cabeçalho fixo no topo da página contendo logo, navegação e controles de autenticação
- **Footer**: Componente de rodapé exibido na parte inferior da página com informações de contato e links institucionais
- **Sidebar**: Painel lateral de navegação exibido em dispositivos móveis, ativado pelo ícone hamburger
- **LayoutWrapper**: Componente wrapper que encapsula Header e Footer em todas as páginas da aplicação
- **Navigation_Menu**: Conjunto de links de navegação exibidos no Header ou Sidebar, variando conforme estado de autenticação
- **Public_Menu**: Menu exibido para usuários não autenticados contendo Home, Planos e Login
- **Authenticated_Menu**: Menu exibido para usuários autenticados contendo Meus Pets, Agenda, Financeiro, Carteirinha e Logout
- **Hamburger_Icon**: Ícone de três linhas horizontais que aciona a abertura da Sidebar em dispositivos móveis
- **Breakpoint_MD**: Ponto de transição responsiva do Tailwind CSS (768px) onde a navegação muda de hamburger para menu inline

## Requirements

### Requirement 1: Header com Logo e Navegação

**User Story:** Como um usuário do portal, eu quero ver um cabeçalho consistente com logo e navegação em todas as páginas, para que eu possa identificar o portal e navegar facilmente entre seções.

#### Acceptance Criteria

1. THE Header SHALL exibir o logo composto pelo emoji 🐾 seguido do texto "Pet Care" como um link clicável com atributo `href="/"`, renderizado com `font-bold text-xl text-primary-500`
2. THE Header SHALL ser posicionado como sticky no topo da viewport com z-index 50, fundo branco e sombra sutil (`sticky top-0 z-50 bg-white shadow-sm`)
3. THE Header SHALL aplicar borda inferior cinza clara (`border-b border-gray-200`)
4. THE Header SHALL aplicar padding horizontal responsivo (`px-4 md:px-6 lg:px-8`) e padding vertical de 16px (`py-4`) ao conteúdo interno, com largura máxima de `max-w-7xl` centralizado horizontalmente
5. WHILE o viewport possui largura igual ou superior ao Breakpoint_MD (768px), THE Header SHALL exibir o Navigation_Menu como links inline alinhados horizontalmente à direita do logo, com espaçamento de `space-x-6` entre os itens
6. WHILE o viewport possui largura inferior ao Breakpoint_MD (768px), THE Header SHALL exibir o Hamburger_Icon como único controle de navegação, posicionado à direita do logo, ocultando todos os links inline do Navigation_Menu
7. THE Header SHALL utilizar o elemento semântico HTML `<header>` como container e `<nav>` com atributo `aria-label="Navegação principal"` para a navegação

### Requirement 2: Navegação Condicional por Estado de Autenticação

**User Story:** Como um usuário do portal, eu quero ver opções de navegação adequadas ao meu estado de autenticação, para que eu acesse apenas as funcionalidades disponíveis para mim.

#### Acceptance Criteria

1. WHILE o usuário não está autenticado, THE Navigation_Menu SHALL exibir os itens na seguinte ordem: Home (rota `/`), Planos (rota `/planos`) e Login (rota `/login`), sem exibir nenhum item do Authenticated_Menu
2. WHILE o usuário está autenticado, THE Navigation_Menu SHALL exibir os itens na seguinte ordem: Meus Pets (rota `/pets`), Agenda (rota `/agenda`), Financeiro (rota `/financeiro`), Carteirinha (rota `/carteirinha`) e um botão Logout como último elemento, sem exibir nenhum item do Public_Menu
3. WHEN o usuário clica no botão Logout, THE Navigation_Menu SHALL alterar o estado de autenticação para não autenticado e exibir o Public_Menu
4. THE Navigation_Menu SHALL aplicar estilo `text-primary-500 font-semibold` ao link cuja rota corresponde exatamente ao pathname atual da URL (correspondência exata, sem considerar sub-rotas)
5. THE Navigation_Menu SHALL aplicar estilo `text-gray-700 hover:text-primary-500` a todos os links que não correspondem à rota ativa

### Requirement 3: Sidebar para Navegação Mobile

**User Story:** Como um usuário mobile, eu quero acessar a navegação por meio de um menu lateral, para que eu navegue entre as seções mesmo em telas pequenas.

#### Acceptance Criteria

1. WHEN o usuário clica no Hamburger_Icon, THE Sidebar SHALL abrir exibindo um painel lateral com os itens do Navigation_Menu
2. THE Sidebar SHALL exibir um overlay escuro (background com opacidade mínima de 50%) sobre o conteúdo da página enquanto estiver aberta
3. THE Sidebar SHALL exibir um botão de fechar (ícone X) no topo do painel
4. WHEN o usuário clica no overlay (fora do painel), THE Sidebar SHALL fechar
5. WHEN o usuário clica em um link de navegação dentro da Sidebar, THE Sidebar SHALL fechar e navegar para a rota correspondente
6. WHEN o usuário clica no botão de fechar (X), THE Sidebar SHALL fechar
7. WHILE a Sidebar está fechada, THE Sidebar SHALL aplicar o atributo `aria-hidden="true"` ao painel e não renderizar o overlay
8. WHILE a Sidebar está aberta, THE Sidebar SHALL capturar o foco do teclado dentro do painel (focus trap), impedindo que Tab navegue para elementos fora da Sidebar
9. WHEN múltiplos cliques rápidos ocorrem no Hamburger_Icon, THE Sidebar SHALL manter estado consistente sem exibir comportamento inesperado (sem estados intermediários ou flicker)
10. WHEN o usuário pressiona a tecla Escape enquanto a Sidebar está aberta, THE Sidebar SHALL fechar e retornar o foco para o Hamburger_Icon

### Requirement 4: Footer com Informações de Contato

**User Story:** Como um usuário do portal, eu quero ver informações de contato e links institucionais no rodapé, para que eu possa encontrar meios de comunicação e informações legais.

#### Acceptance Criteria

1. THE Footer SHALL exibir o número de telefone (16) 5555-3553
2. THE Footer SHALL exibir o endereço de email "contato@petcare.com" como texto visível
3. THE Footer SHALL exibir os links: Termos de Uso, Política de Privacidade e Fale Conosco, todos com atributo `href="#"` (não funcionais, apenas visuais)
4. THE Footer SHALL exibir o texto de copyright "© 2025 Pet Care"
5. THE Footer SHALL aplicar estilo de fundo escuro (`bg-gray-900`) com texto claro (`text-gray-300`)
6. THE Footer SHALL utilizar o elemento semântico HTML `<footer>` como container
7. WHILE o viewport possui largura inferior ao Breakpoint_MD, THE Footer SHALL empilhar as seções de conteúdo verticalmente em coluna única
8. WHILE o viewport possui largura igual ou superior ao Breakpoint_MD, THE Footer SHALL distribuir as seções de conteúdo horizontalmente em múltiplas colunas

### Requirement 5: Layout Wrapper Global

**User Story:** Como um desenvolvedor, eu quero um wrapper de layout que aplique Header e Footer automaticamente em todas as páginas, para que a estrutura visual seja consistente sem duplicação de código.

#### Acceptance Criteria

1. THE LayoutWrapper SHALL renderizar o componente Header como primeiro elemento filho, antes do conteúdo da página recebido via prop `children`
2. THE LayoutWrapper SHALL renderizar o componente Footer como último elemento filho, após o conteúdo da página recebido via prop `children`
3. THE LayoutWrapper SHALL ser utilizado no arquivo `app/layout.tsx` como wrapper direto do `{children}`, de forma que todas as páginas da aplicação recebam Header e Footer sem importação individual
4. THE LayoutWrapper SHALL envolver o conteúdo da página em um elemento `<main>` com `flex-grow: 1`, dentro de um container flex vertical (`flex-direction: column`) com altura mínima de 100vh, garantindo que o Footer permaneça na parte inferior da viewport mesmo quando o conteúdo da página for menor que a área disponível
5. THE LayoutWrapper SHALL aceitar `children` do tipo `React.ReactNode` e renderizá-lo integralmente entre o Header e o Footer sem modificação

### Requirement 6: Responsividade Mobile-First

**User Story:** Como um usuário, eu quero que o portal funcione bem em qualquer dispositivo, para que eu tenha uma boa experiência tanto no celular quanto no computador.

#### Acceptance Criteria

1. THE LayoutWrapper SHALL seguir a abordagem mobile-first, aplicando estilos base sem media queries de min-width e utilizando exclusivamente os breakpoints do Tailwind CSS (md: 768px, lg: 1024px, xl: 1280px) para aplicar estilos progressivamente em telas maiores
2. WHEN o viewport é redimensionado cruzando o Breakpoint_MD, THE Header SHALL transicionar entre Hamburger_Icon e menu inline sem sobreposição de elementos, sem exibição simultânea de ambos os menus, e preservando o estado de autenticação do Navigation_Menu
3. THE Header SHALL manter o comportamento sticky em todos os tamanhos de viewport a partir da largura mínima suportada de 320px
4. WHILE o viewport possui largura entre 320px e 1280px, THE LayoutWrapper SHALL renderizar todo o conteúdo sem overflow horizontal e sem necessidade de scroll horizontal
5. WHEN o viewport é redimensionado de uma largura inferior ao Breakpoint_MD para uma largura igual ou superior, IF a Sidebar está aberta, THEN THE Sidebar SHALL fechar automaticamente
6. THE LayoutWrapper SHALL garantir que elementos interativos (links e botões) possuam área de toque mínima de 44x44px em viewports com largura inferior ao Breakpoint_MD

### Requirement 7: Rotas Placeholder

**User Story:** Como um desenvolvedor, eu quero que todas as rotas planejadas existam como páginas placeholder, para que a navegação funcione de ponta a ponta e permita desenvolvimento incremental.

#### Acceptance Criteria

1. THE Application SHALL conter uma página placeholder na rota `/login` com um elemento `<h1>` contendo o texto "Login", implementada como Server Component padrão exportado em `/app/login/page.tsx`
2. THE Application SHALL conter uma página placeholder na rota `/planos` com um elemento `<h1>` contendo o texto "Planos", implementada como Server Component padrão exportado em `/app/planos/page.tsx`
3. THE Application SHALL conter uma página placeholder na rota `/pets` com um elemento `<h1>` contendo o texto "Meus Pets", implementada como Server Component padrão exportado em `/app/pets/page.tsx`
4. THE Application SHALL conter uma página placeholder na rota `/agenda` com um elemento `<h1>` contendo o texto "Agenda", implementada como Server Component padrão exportado em `/app/agenda/page.tsx`
5. THE Application SHALL conter uma página placeholder na rota `/financeiro` com um elemento `<h1>` contendo o texto "Financeiro", implementada como Server Component padrão exportado em `/app/financeiro/page.tsx`
6. THE Application SHALL conter uma página placeholder na rota `/carteirinha` com um elemento `<h1>` contendo o texto "Carteirinha", implementada como Server Component padrão exportado em `/app/carteirinha/page.tsx`

### Requirement 8: Acessibilidade na Navegação

**User Story:** Como um usuário que depende de tecnologias assistivas, eu quero que a navegação seja acessível via teclado e leitores de tela, para que eu possa utilizar o portal de forma independente.

#### Acceptance Criteria

1. THE Header SHALL permitir navegação completa via teclado (tecla Tab) por todos os links e controles interativos, seguindo a ordem visual da esquerda para a direita
2. THE Header SHALL aplicar indicador visual de foco (`focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`) em todos os elementos interativos (links, botões)
3. THE Hamburger_Icon SHALL possuir atributo `aria-label="Abrir menu de navegação"` e o botão de fechar da Sidebar SHALL possuir `aria-label="Fechar menu de navegação"`
4. THE Sidebar SHALL permitir navegação por teclado (Tab) entre todos os links e o botão de fechar quando aberta
5. THE Footer SHALL aplicar indicador visual de foco (`focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`) nos links interativos
6. THE Logo link SHALL possuir atributo `aria-label="Pet Care - Ir para página inicial"`

### Requirement 9: Tipagem de Navegação

**User Story:** Como um desenvolvedor, eu quero ter tipos TypeScript definidos para os itens de navegação, para que o desenvolvimento seja mais seguro e previsível.

#### Acceptance Criteria

1. THE Application SHALL definir e exportar em `/types/navigation.ts` um tipo `NavItem` contendo as propriedades: `label` (string), `href` (string), `visibility` (`"public"` | `"authenticated"`), e `type` (`"link"` | `"button"`)
2. THE Application SHALL exportar em `/types/navigation.ts` um tipo `NavigationConfig` que represente um array de `NavItem`
3. THE Navigation_Menu SHALL utilizar o tipo `NavItem` importado de `@/types/navigation.ts` como type annotation para cada item ao renderizar links e botões de navegação
4. THE Header e THE Sidebar SHALL importar os tipos de `@/types/navigation.ts` para garantir tipagem consistente entre todos os pontos de renderização do menu
