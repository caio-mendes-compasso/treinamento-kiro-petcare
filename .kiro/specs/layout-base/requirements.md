# Requirements Document

## Introduction

O portal Pet Care necessita de uma estrutura de navegação consistente composta por Header, Footer e roteamento entre páginas. Esta fundação garante que o usuário transite entre as funcionalidades com experiência fluida, responsiva e acessível, independente do estado de autenticação ou dispositivo utilizado.

## Glossary

- **Portal**: A aplicação web Pet Care construída com Next.js App Router
- **Header**: Componente de cabeçalho fixo no topo de todas as páginas, contendo logo, navegação e ações do usuário
- **Footer**: Componente de rodapé fixo na base de todas as páginas, contendo informações de contato e links úteis
- **Menu_Público**: Conjunto de links de navegação exibido para usuários não autenticados (Home, Planos, Login)
- **Menu_Autenticado**: Conjunto de links de navegação exibido para usuários autenticados (Meus Pets, Agenda, Financeiro, Carteirinha)
- **MobileMenu**: Componente de menu lateral (sidebar) exibido em dispositivos com viewport inferior a 768px
- **Hamburger_Button**: Botão com ícone de três linhas horizontais que aciona a abertura do MobileMenu
- **Layout_Wrapper**: Componente que envolve todas as páginas com Header acima do conteúdo e Footer abaixo
- **Breakpoint_Mobile**: Largura de viewport inferior a 768px (abaixo do breakpoint `md` do Tailwind)
- **Breakpoint_Desktop**: Largura de viewport igual ou superior a 768px (breakpoint `md` do Tailwind)
- **AuthContext**: Contexto React que fornece o estado de autenticação do usuário para os componentes

## Requirements

### Requirement 1: Layout Wrapper

**User Story:** Como usuário do portal, eu quero que todas as páginas tenham uma estrutura visual consistente com cabeçalho e rodapé, para que eu tenha uma experiência de navegação coesa.

#### Acceptance Criteria

1. THE Layout_Wrapper SHALL renderizar o Header, a área de conteúdo da página e o Footer nesta ordem sequencial no DOM, onde o Header aparece primeiro, seguido do conteúdo, seguido do Footer
2. THE Layout_Wrapper SHALL envolver todas as 7 rotas do Portal (/, /login, /planos, /pets, /agenda, /financeiro, /carteirinha) de forma que Header e Footer estejam presentes em cada uma delas
3. THE Layout_Wrapper SHALL aplicar flex-grow na área de conteúdo para que ela ocupe todo o espaço vertical disponível entre o Header e o Footer
4. IF o conteúdo da página possuir altura inferior à viewport menos a altura do Header e do Footer, THEN THE Layout_Wrapper SHALL manter o Footer posicionado na base da viewport sem espaço vazio abaixo dele

### Requirement 2: Header — Estrutura e Logo

**User Story:** Como usuário do portal, eu quero visualizar a marca "Pet Care" no cabeçalho, para que eu identifique facilmente qual aplicação estou utilizando.

#### Acceptance Criteria

1. THE Header SHALL exibir o texto "Pet Care" como logo posicionado à esquerda do componente, com tamanho de fonte equivalente a `text-xl` (20px) e peso `font-bold` (700)
2. THE Header SHALL utilizar a cor de fundo primária (#0D7377) com texto na cor branca (#FFFFFF), mantendo contraste mínimo WCAG AA (razão 4.5:1)
3. WHILE o usuário rola a página, THE Header SHALL permanecer fixo no topo do viewport com posicionamento sticky e z-index suficiente para sobrepor o conteúdo abaixo (mínimo z-10)
4. THE Header SHALL ocupar 100% da largura do viewport com altura fixa de 64px (h-16) e padding horizontal de 16px (px-4)

### Requirement 3: Navegação Pública (Não Autenticado)

**User Story:** Como visitante não autenticado, eu quero acessar as páginas públicas pelo menu de navegação, para que eu conheça os planos e possa fazer login.

#### Acceptance Criteria

1. WHILE o usuário não estiver autenticado (isAuthenticated === false) no AuthContext, THE Header SHALL exibir o Menu_Público contendo exatamente 3 links na seguinte ordem da esquerda para a direita: Home (/), Planos (/planos) e Login (/login)
2. WHILE o usuário não estiver autenticado (isAuthenticated === false) no AuthContext, THE Header SHALL exibir o link de Login como um botão estilizado com fundo branco e texto na cor primária (bg-white text-primary), visualmente distinto dos demais links de navegação que utilizam apenas texto
3. WHILE o usuário não estiver autenticado (isAuthenticated === false) no AuthContext, THE Header SHALL ocultar todos os itens do Menu_Autenticado (Meus Pets, Agenda, Financeiro, Carteirinha e botão Logout), renderizando zero elementos desse menu no DOM
4. IF o AuthContext estiver em estado de carregamento (loading), THEN THE Header SHALL tratar o usuário como não autenticado e exibir o Menu_Público até que o estado de autenticação seja resolvido

### Requirement 4: Navegação Autenticada

**User Story:** Como usuário autenticado, eu quero acessar as funcionalidades do portal pelo menu de navegação, para que eu gerencie meus pets e serviços.

#### Acceptance Criteria

1. WHILE o usuário estiver autenticado no AuthContext (isAuthenticated === true), THE Header SHALL exibir o Menu_Autenticado contendo exatamente 4 links de navegação na seguinte ordem: Meus Pets (/pets), Agenda (/agenda), Financeiro (/financeiro) e Carteirinha (/carteirinha), cada um renderizado como elemento âncora clicável
2. WHILE o usuário estiver autenticado no AuthContext (isAuthenticated === true), THE Header SHALL exibir um botão de Logout renderizado como elemento `button` visualmente distinto dos links de navegação (estilizado como botão, não como link de texto)
3. WHEN o usuário clicar no botão de Logout, THE Header SHALL invocar a função logout() do AuthContext e o sistema SHALL redirecionar o usuário para a página inicial (/) em no máximo 1 segundo
4. WHILE o usuário estiver autenticado no AuthContext (isAuthenticated === true), THE Header SHALL não renderizar no DOM nenhum item do Menu_Público (Home, Planos, Login)
5. WHEN o AuthContext transicionar de autenticado (isAuthenticated === true) para não autenticado (isAuthenticated === false), THE Header SHALL exibir o Menu_Público e ocultar completamente o Menu_Autenticado e o botão de Logout

### Requirement 5: Menu Mobile

**User Story:** Como usuário em dispositivo móvel, eu quero acessar o menu de navegação através de um botão hamburger, para que eu navegue pelo portal sem que o menu ocupe espaço permanente na tela.

#### Acceptance Criteria

1. WHILE a viewport estiver abaixo do Breakpoint_Mobile, THE Header SHALL exibir o Hamburger_Button e ocultar os links de navegação inline
2. WHILE a viewport estiver no Breakpoint_Desktop ou acima, THE Header SHALL exibir os links de navegação inline e ocultar o Hamburger_Button
3. WHEN o usuário clicar no Hamburger_Button, THE MobileMenu SHALL exibir uma sidebar deslizando a partir da esquerda com uma transição de no máximo 300ms, apresentando um backdrop semi-transparente sobre o conteúdo da página e exibindo os links de navegação correspondentes ao estado de autenticação do AuthContext
4. WHEN o usuário clicar em um link dentro do MobileMenu, THE MobileMenu SHALL fechar a sidebar sem requerer ação adicional do usuário
5. WHEN o usuário clicar no backdrop do MobileMenu enquanto a sidebar estiver aberta, THE MobileMenu SHALL fechar a sidebar
6. WHEN o usuário pressionar a tecla Escape enquanto a sidebar do MobileMenu estiver aberta, THE MobileMenu SHALL fechar a sidebar e retornar o foco ao Hamburger_Button

### Requirement 6: Footer

**User Story:** Como usuário do portal, eu quero visualizar informações de contato e links úteis no rodapé, para que eu encontre formas de contato e navegação auxiliar.

#### Acceptance Criteria

1. THE Footer SHALL exibir as seguintes informações de contato do Pet Care: endereço de e-mail, número de telefone e endereço físico, cada uma visível como texto legível
2. THE Footer SHALL exibir no mínimo 3 links de navegação auxiliar que direcionem às seções principais do portal, cada link com texto descritivo identificando o destino
3. THE Footer SHALL utilizar a cor de fundo primária (#0D7377) com todo o texto na cor branca (#FFFFFF), mantendo contraste mínimo de 4.5:1 conforme WCAG AA
4. THE Footer SHALL ser renderizado como Server Component sem dependência de estado do cliente, sem utilizar a diretiva "use client"
5. THE Footer SHALL apresentar layout responsivo em coluna única em viewports abaixo do breakpoint md (768px) e em múltiplas colunas a partir do breakpoint md (768px)

### Requirement 7: Rotas da Aplicação

**User Story:** Como usuário do portal, eu quero acessar cada funcionalidade através de URLs específicas, para que eu navegue diretamente para a seção desejada.

#### Acceptance Criteria

1. THE Portal SHALL disponibilizar a rota `/` retornando a página Home com um heading identificável contendo o texto "Pet Care"
2. THE Portal SHALL disponibilizar a rota `/login` retornando a página Login com um heading identificável contendo o texto "Login"
3. THE Portal SHALL disponibilizar a rota `/planos` retornando a página Planos com um heading identificável contendo o texto "Planos"
4. THE Portal SHALL disponibilizar a rota `/pets` retornando a página Meus Pets com um heading identificável contendo o texto "Meus Pets"
5. THE Portal SHALL disponibilizar a rota `/agenda` retornando a página Agenda com um heading identificável contendo o texto "Agenda"
6. THE Portal SHALL disponibilizar a rota `/financeiro` retornando a página Financeiro com um heading identificável contendo o texto "Financeiro"
7. THE Portal SHALL disponibilizar a rota `/carteirinha` retornando a página Carteirinha com um heading identificável contendo o texto "Carteirinha"
8. THE Portal SHALL renderizar cada uma das 7 rotas definidas dentro do Layout_Wrapper, exibindo o Header acima e o Footer abaixo do conteúdo da página
9. IF o usuário não estiver autenticado no AuthContext e acessar uma rota protegida (/pets, /agenda, /financeiro ou /carteirinha), THEN THE Portal SHALL redirecionar o usuário para a rota `/login`
10. IF o usuário acessar uma rota não definida nas 7 rotas especificadas, THEN THE Portal SHALL exibir uma página de erro com indicação de que o conteúdo não foi encontrado
11. THE Portal SHALL permitir acesso às rotas `/`, `/login` e `/planos` independentemente do estado de autenticação do usuário

### Requirement 8: Responsividade Mobile-First

**User Story:** Como usuário em qualquer dispositivo, eu quero que o layout se adapte ao tamanho da minha tela, para que eu tenha uma experiência adequada em mobile, tablet e desktop.

#### Acceptance Criteria

1. THE Portal SHALL aplicar os estilos base para viewports abaixo de 768px (mobile) e aplicar variações progressivas a partir do breakpoint de 768px (md) para viewports maiores
2. WHILE o viewport estiver abaixo de 768px, THE Header SHALL exibir a navegação em formato de menu hamburger com botão de ativação de no mínimo 44x44px de área de toque
3. WHILE o viewport estiver a partir de 768px, THE Header SHALL exibir os links de navegação em formato inline (horizontal)
4. WHEN o usuário tocar no botão hamburger em viewport abaixo de 768px, THE Header SHALL alternar a visibilidade do menu de navegação entre expandido e recolhido
5. WHILE o viewport estiver abaixo de 768px, THE Footer SHALL exibir seu conteúdo em coluna única (empilhado verticalmente) com padding horizontal de 16px
6. WHILE o viewport estiver a partir de 768px, THE Footer SHALL exibir seu conteúdo distribuído em 3 colunas lado a lado

### Requirement 9: Tema Visual

**User Story:** Como stakeholder do produto, eu quero que o layout base siga a identidade visual definida, para que o portal transmita a marca Pet Care de forma consistente.

#### Acceptance Criteria

1. THE Header SHALL utilizar a cor de fundo `#0D7377` (azul petróleo) como cor primária
2. THE Footer SHALL utilizar a cor de fundo `#0D7377` (azul petróleo) como cor primária
3. WHILE o usuário mantém o cursor sobre um elemento interativo (link ou botão) no Header ou Footer, THE elemento SHALL exibir a cor de fundo `#0A5C5F`
4. THE Portal SHALL utilizar branco (`#FFFFFF`) como cor de fundo padrão do conteúdo das páginas
5. THE Portal SHALL exibir texto na cor branca (`#FFFFFF`) quando o fundo for a cor primária (`#0D7377`), e na cor `#1F2937` (gray-800) quando o fundo for branco
6. THE Portal SHALL aplicar a fonte Inter como família tipográfica padrão em todos os textos renderizados
7. THE Portal SHALL manter uma razão de contraste mínima de 4.5:1 (WCAG AA) entre a cor do texto e a cor de fundo em todos os elementos textuais
