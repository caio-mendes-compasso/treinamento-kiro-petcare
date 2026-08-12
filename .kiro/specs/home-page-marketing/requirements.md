# Requirements Document

## Introduction

A Home Page é a porta de entrada do portal Pet Care. Ela deve comunicar de forma clara o valor do serviço de planos de saúde para pets, apresentar os planos disponíveis com comparativo visual, exibir depoimentos de clientes e converter visitantes em contratantes através de CTAs estratégicos que direcionam para a página de planos (`/planos`).

## Glossary

- **Home_Page**: Página principal do portal Pet Care acessível na rota raiz (`/`), contendo todas as seções de marketing
- **Hero_Banner**: Seção de destaque no topo da Home_Page com título principal, subtítulo e botão de chamada para ação
- **Benefits_Section**: Seção que apresenta os diferenciais do serviço em formato de grid de cards
- **Plans_Comparison**: Seção com comparativo visual dos três planos disponíveis (Básico, Plus, Premium)
- **Testimonials_Section**: Seção que exibe depoimentos de clientes em cards com avatar, nome e texto
- **CTA_Section**: Seção final de chamada para ação com destaque visual para conversão
- **CTA_Button**: Botão de chamada para ação que redireciona o usuário para a página de planos
- **Plan_Card**: Card individual dentro da Plans_Comparison que exibe nome, preço, lista de features e botão de contratação
- **Benefit_Card**: Card individual dentro da Benefits_Section que exibe ícone, título e descrição de um diferencial
- **Testimonial_Card**: Card individual dentro da Testimonials_Section que exibe avatar, nome e texto de depoimento
- **Visitor**: Usuário não autenticado que acessa a Home_Page

## Requirements

### Requirement 1: Hero Banner

**User Story:** As a Visitor, I want to see a visually impactful banner when I access the Home Page, so that I immediately understand the value proposition of the Pet Care service.

#### Acceptance Criteria

1. THE Home_Page SHALL render the Hero_Banner as the first content section in the document flow, positioned at the top of the page before any other content sections
2. THE Hero_Banner SHALL display the title "Cuidado completo para quem você ama"
3. THE Hero_Banner SHALL display the subtitle "Planos a partir de R$ 49,90/mês"
4. THE Hero_Banner SHALL display a CTA_Button with the text "Conheça nossos planos" styled as a primary action button
5. WHEN the Visitor clicks the CTA_Button in the Hero_Banner, THE Home_Page SHALL navigate to the `/planos` route
6. THE Hero_Banner SHALL occupy 100% of the viewport width and apply a minimum vertical padding of 64px (top and bottom) on mobile viewports and 96px on viewports 768px and above
7. THE Hero_Banner SHALL use the `primary-50` background color
8. THE Hero_Banner SHALL center-align all content (title, subtitle, and CTA_Button) horizontally within the banner on all viewport widths

### Requirement 2: Benefits Section

**User Story:** As a Visitor, I want to see the key benefits of the Pet Care service, so that I can understand why I should choose this service over competitors.

#### Acceptance Criteria

1. THE Benefits_Section SHALL display the heading "Por que escolher o Pet Care?"
2. THE Benefits_Section SHALL display exactly 4 Benefit_Cards in a responsive grid layout
3. WHILE the viewport width is below 768px, THE Benefits_Section SHALL display Benefit_Cards in a single column layout
4. WHILE the viewport width is between 768px and 1023px, THE Benefits_Section SHALL display Benefit_Cards in a 2-column grid layout
5. WHILE the viewport width is 1024px or above, THE Benefits_Section SHALL display Benefit_Cards in a 4-column grid layout
6. THE Benefits_Section SHALL display a Benefit_Card with icon "🏥", title "Consultas ilimitadas", and description "Sem limite de consultas para seu pet"
7. THE Benefits_Section SHALL display a Benefit_Card with icon "🌐", title "Rede credenciada", and description "Mais de 500 clínicas parceiras"
8. THE Benefits_Section SHALL display a Benefit_Card with icon "🚨", title "Emergência 24h", and description "Atendimento de urgência a qualquer hora"
9. THE Benefits_Section SHALL display a Benefit_Card with icon "📱", title "App de acompanhamento", and description "Acompanhe tudo pelo portal"
10. THE Benefit_Card SHALL use white background with border-radius of 8px, a shadow-sm box-shadow, and a 1px gray-200 border with 24px padding
11. THE Benefit_Card SHALL display its content vertically in the following order: icon, title, and description

### Requirement 3: Plans Comparison

**User Story:** As a Visitor, I want to compare the available plans side by side, so that I can choose the plan that best fits my needs and budget.

#### Acceptance Criteria

1. THE Plans_Comparison SHALL display exactly 3 Plan_Cards in the following order from left to right (or top to bottom on mobile): "Básico", "Plus", "Premium"
2. THE Plans_Comparison SHALL display a Plan_Card for "Básico" with price "R$ 49,90/mês" and features listed in this order: "Consultas", "Vacinas"
3. THE Plans_Comparison SHALL display a Plan_Card for "Plus" with price "R$ 89,90/mês" and features listed in this order: "Consultas", "Vacinas", "Exames", "Emergência"
4. THE Plans_Comparison SHALL display a Plan_Card for "Premium" with price "R$ 149,90/mês" and features listed in this order: "Consultas", "Vacinas", "Exames", "Emergência", "Cirurgias", "Internação"
5. THE Plans_Comparison SHALL highlight the "Plus" Plan_Card with a visually distinct border using the primary-500 color and a "Mais popular" badge visible above or within the card header
6. THE Plan_Card SHALL display the plan name, price, a list of features each preceded by a check icon, and a "Contratar" CTA_Button
7. WHEN the Visitor clicks the "Contratar" CTA_Button on any Plan_Card, THE Plans_Comparison SHALL navigate to the `/planos` route
8. WHILE the viewport width is below 768px, THE Plans_Comparison SHALL stack Plan_Cards vertically in a single column
9. WHILE the viewport width is 768px or above, THE Plans_Comparison SHALL display Plan_Cards side by side in a single row

### Requirement 4: Testimonials Section

**User Story:** As a Visitor, I want to read testimonials from other customers, so that I feel confident about the quality of the service.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL display exactly 3 Testimonial_Cards
2. THE Testimonial_Card SHALL display a circular avatar placeholder of 64x64 pixels, a customer name limited to 50 characters, and a testimonial text limited to 200 characters
3. THE Testimonials_Section SHALL display testimonials from "Maria Silva", "João Santos", and "Ana Oliveira"
4. THE Testimonials_Section SHALL use a responsive grid layout that displays 1 column on viewports below 768px and 3 columns on viewports of 768px and above
5. IF a testimonial avatar image fails to load, THEN THE Testimonial_Card SHALL display a fallback placeholder that maintains the same 64x64 pixel circular shape and dimensions as the original avatar area without causing a broken image error
6. THE Testimonials_Section SHALL display a section heading text above the Testimonial_Cards

### Requirement 5: Final CTA Section

**User Story:** As a Visitor, I want to see a compelling final call to action, so that I am motivated to subscribe to a plan after reviewing all the information.

#### Acceptance Criteria

1. THE CTA_Section SHALL display the title "Seu pet merece o melhor"
2. THE CTA_Section SHALL display the subtitle "Escolha o plano ideal e garanta saúde e bem-estar para seu melhor amigo"
3. THE CTA_Section SHALL display a CTA_Button with the text "Contratar agora"
4. WHEN the Visitor clicks the CTA_Button in the CTA_Section, THE Home_Page SHALL navigate to the `/planos` route
5. THE CTA_Section SHALL use `bg-primary-500` background with white text and center-aligned content
6. THE CTA_Section SHALL be rendered as the last content section on the Home_Page, appearing after the Testimonials_Section

### Requirement 6: Responsive Layout

**User Story:** As a Visitor, I want the Home Page to display correctly on any device, so that I can browse the content on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Home_Page SHALL use a mobile-first approach where base styles target viewports below 768px and progressively enhanced styles are applied at breakpoints of 768px (md) and 1024px (lg)
2. THE Home_Page SHALL render all sections in a single-column layout on viewports below 768px and expand to multi-column grids on viewports of 768px and above
3. THE Home_Page SHALL maintain readable text without horizontal scrolling on viewports from 320px width and above
4. IF a text content exceeds its container width, THEN THE Home_Page SHALL wrap the text using CSS word-wrap or overflow-wrap without breaking the layout or introducing horizontal scrollbars

### Requirement 7: Visual Consistency and Accessibility

**User Story:** As a Visitor, I want the Home Page to have a consistent visual identity and be accessible, so that I have a professional and inclusive browsing experience.

#### Acceptance Criteria

1. THE Home_Page SHALL apply the primary color (#0D7377) as the background or border color on all interactive elements including CTA_Buttons, navigation links, and form controls in their default state
2. THE Home_Page SHALL use headings in hierarchical order starting with a single h1 for the Hero_Banner title, followed by h2 for section titles, and h3 for subsection titles where applicable, with no skipped heading levels
3. THE Home_Page SHALL render CTA_Buttons as semantic anchor elements (when navigating to a URL) or button elements (when performing an action), each including a visible text label or an aria-label attribute with a description of the action of at least 3 characters
4. THE Home_Page SHALL ensure a minimum contrast ratio of 4.5:1 between text and background colors for normal text (below 18pt) and a minimum of 3:1 for large text (18pt or above)
5. THE Home_Page SHALL provide alt text of between 5 and 125 characters describing the content or function of all informative images, and an empty alt attribute (alt="") for decorative images
6. THE Home_Page SHALL provide a visible focus indicator with a minimum 2px outline on all interactive elements when they receive keyboard focus, and all interactive elements SHALL be reachable and operable using only the keyboard via Tab and Enter/Space keys

### Requirement 8: Mock Data Structure

**User Story:** As a developer, I want plan and testimonial data stored in reusable mock files, so that the same data can be consumed by the Home Page and future pages.

#### Acceptance Criteria

1. THE Home_Page SHALL import and render plan data from a `/mocks/plans.ts` file that exports a named array of at least 3 plan objects
2. THE Home_Page SHALL import and render testimonial data from a `/mocks/testimonials.ts` file that exports a named array of at least 3 testimonial objects
3. THE `/mocks/plans.ts` file SHALL export an array of plan objects where each object contains a name (string, max 50 characters), a numeric price value, a features list containing between 1 and 10 string items, and a highlighted boolean flag where exactly one plan in the array has highlighted set to true
4. THE `/mocks/testimonials.ts` file SHALL export an array of testimonial objects where each object contains a name (string, max 80 characters), an avatar placeholder path (string referencing an image path), and testimonial text (string, max 300 characters)
5. THE Home_Page SHALL use `next/link` for all internal navigation links to the `/planos` route
6. THE `/mocks/plans.ts` file SHALL export a corresponding TypeScript type definition for the plan object, and THE `/mocks/testimonials.ts` file SHALL export a corresponding TypeScript type definition for the testimonial object
