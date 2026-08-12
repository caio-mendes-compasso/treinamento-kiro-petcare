# Requirements Document

## Introduction

Este documento especifica os requisitos para duas funcionalidades da área logada do Pet Care: a Área Financeira (/financeiro), que permite ao tutor visualizar faturas do plano de saúde pet e simular ações de pagamento, e a Carteirinha do Plano (/carteirinha), que exibe um card visual no formato carteirinha para cada pet vinculado ao plano contratado. Ambas as funcionalidades utilizam dados mock derivados do plano contratado e dos pets cadastrados.

## Glossary

- **Sistema_Financeiro**: Módulo da aplicação Pet Care responsável pela visualização de faturas e simulação de pagamento, acessível na rota /financeiro
- **Sistema_Carteirinha**: Módulo da aplicação Pet Care responsável pela exibição da carteirinha digital do plano, acessível na rota /carteirinha
- **Fatura**: Registro mensal de cobrança associado ao plano contratado, contendo mês de referência, valor e status de pagamento
- **Status_Fatura**: Estado de uma fatura, podendo ser "Pago", "Pendente" ou "Vencido"
- **Card_Resumo**: Componente visual no topo da área financeira que exibe totalizadores (Total Pago, Pendente, Vencido)
- **Carteirinha**: Card visual com aspect-ratio 1.6:1 contendo informações do plano associadas a um pet específico
- **Tutor**: Usuário autenticado titular do plano de saúde pet
- **Pet**: Animal de estimação cadastrado no sistema e vinculado ao plano do tutor
- **Plano**: Plano de saúde pet contratado pelo tutor (Básico, Plus ou Premium), com preço mensal definido
- **Toast**: Notificação temporária exibida na interface para confirmar uma ação do usuário
- **Flip_Animation**: Animação CSS de rotação 3D que revela o verso da carteirinha ao interagir

## Requirements

### Requirement 1: Resumo Financeiro

**User Story:** Como tutor logado, quero visualizar um resumo dos valores pagos, pendentes e vencidos no topo da área financeira, para ter uma visão rápida da minha situação de pagamento.

#### Acceptance Criteria

1. WHEN o Tutor acessa a rota /financeiro, THE Sistema_Financeiro SHALL exibir três Card_Resumo no topo da página: "Total Pago", "Pendente" e "Vencido"
2. THE Sistema_Financeiro SHALL calcular o valor de cada Card_Resumo somando os valores das faturas correspondentes ao Status_Fatura respectivo
3. THE Sistema_Financeiro SHALL formatar os valores dos Card_Resumo no padrão monetário brasileiro (R$ X.XXX,XX)
4. WHILE o valor do Card_Resumo "Vencido" for maior que zero, THE Sistema_Financeiro SHALL exibir o Card_Resumo "Vencido" com destaque visual na cor vermelha (#EF4444)
5. WHILE o valor do Card_Resumo "Vencido" for igual a zero, THE Sistema_Financeiro SHALL exibir o Card_Resumo "Vencido" sem destaque visual em vermelho

### Requirement 2: Filtros de Faturas

**User Story:** Como tutor logado, quero filtrar minhas faturas por status para encontrar rapidamente as faturas que preciso verificar.

#### Acceptance Criteria

1. THE Sistema_Financeiro SHALL exibir opções de filtro com as categorias: "Todos", "Pagos", "Pendentes" e "Vencidos"
2. WHEN o Tutor seleciona o filtro "Todos", THE Sistema_Financeiro SHALL exibir todas as faturas independente do Status_Fatura
3. WHEN o Tutor seleciona o filtro "Pagos", THE Sistema_Financeiro SHALL exibir apenas faturas com Status_Fatura igual a "Pago"
4. WHEN o Tutor seleciona o filtro "Pendentes", THE Sistema_Financeiro SHALL exibir apenas faturas com Status_Fatura igual a "Pendente"
5. WHEN o Tutor seleciona o filtro "Vencidos", THE Sistema_Financeiro SHALL exibir apenas faturas com Status_Fatura igual a "Vencido"
6. THE Sistema_Financeiro SHALL destacar visualmente o filtro ativo em relação aos demais filtros inativos
7. WHEN a página /financeiro é carregada, THE Sistema_Financeiro SHALL selecionar o filtro "Todos" como padrão

### Requirement 3: Listagem de Faturas

**User Story:** Como tutor logado, quero visualizar a lista das minhas faturas com informações claras de mês, valor e status, para acompanhar meu histórico de pagamentos.

#### Acceptance Criteria

1. THE Sistema_Financeiro SHALL exibir cada Fatura com: mês de referência, valor formatado em reais (R$ X.XXX,XX) e badge de Status_Fatura
2. THE Sistema_Financeiro SHALL exibir a badge de Status_Fatura "Pago" na cor verde (#10B981)
3. THE Sistema_Financeiro SHALL exibir a badge de Status_Fatura "Pendente" na cor amarela (#F59E0B)
4. THE Sistema_Financeiro SHALL exibir a badge de Status_Fatura "Vencido" na cor vermelha (#EF4444)
5. THE Sistema_Financeiro SHALL gerar 12 meses de faturas mock derivadas do preço do Plano contratado pelo Tutor

### Requirement 4: Ações de Fatura

**User Story:** Como tutor logado, quero copiar o código de barras e obter a segunda via de uma fatura para facilitar o pagamento.

#### Acceptance Criteria

1. THE Sistema_Financeiro SHALL exibir um botão "Copiar código de barras" em cada Fatura
2. WHEN o Tutor clica no botão "Copiar código de barras", THE Sistema_Financeiro SHALL exibir um Toast confirmando que o código foi copiado
3. THE Sistema_Financeiro SHALL exibir um botão "2ª via" em cada Fatura
4. WHEN o Tutor clica no botão "2ª via", THE Sistema_Financeiro SHALL simular o download exibindo um Toast ou alert de confirmação

### Requirement 5: Seletor de Pet na Carteirinha

**User Story:** Como tutor logado com mais de um pet, quero selecionar qual pet desejo visualizar na carteirinha para ver as informações corretas de cada animal.

#### Acceptance Criteria

1. WHILE o Tutor possui mais de um Pet cadastrado, THE Sistema_Carteirinha SHALL exibir um seletor de Pet no topo da página /carteirinha
2. WHILE o Tutor possui apenas um Pet cadastrado, THE Sistema_Carteirinha SHALL exibir a Carteirinha do Pet único sem exibir o seletor
3. WHEN o Tutor seleciona um Pet no seletor, THE Sistema_Carteirinha SHALL atualizar a Carteirinha com as informações do Pet selecionado
4. WHEN a página /carteirinha é carregada, THE Sistema_Carteirinha SHALL exibir a Carteirinha do primeiro Pet da lista como padrão

### Requirement 6: Carteirinha Frente

**User Story:** Como tutor logado, quero visualizar a frente da carteirinha com as informações do plano e do pet para apresentar em clínicas veterinárias.

#### Acceptance Criteria

1. THE Sistema_Carteirinha SHALL exibir a Carteirinha com aspect-ratio de 1.6:1
2. THE Sistema_Carteirinha SHALL exibir na frente da Carteirinha: logotipo "Pet Care", nome do Plano contratado, nome do Tutor, nome do Pet selecionado, número do plano no formato PC-2025-XXXXXX e data de validade
3. THE Sistema_Carteirinha SHALL aplicar a cor correspondente ao Plano contratado no nome do plano exibido na Carteirinha
4. THE Sistema_Carteirinha SHALL aplicar um gradiente sutil no fundo da Carteirinha para um visual limpo e profissional

### Requirement 7: Carteirinha Verso

**User Story:** Como tutor logado, quero visualizar o verso da carteirinha com os dados do animal e informações de emergência para uso em situações de atendimento.

#### Acceptance Criteria

1. THE Sistema_Carteirinha SHALL exibir no verso da Carteirinha: foto do Pet (ou placeholder quando foto for nula), espécie e raça do Pet, telefone de emergência 0800-PET-CARE e QR Code placeholder
2. WHEN o Pet selecionado possui foto cadastrada, THE Sistema_Carteirinha SHALL exibir a foto do Pet no verso da Carteirinha
3. WHEN o Pet selecionado não possui foto cadastrada, THE Sistema_Carteirinha SHALL exibir um placeholder visual no lugar da foto

### Requirement 8: Animação de Flip da Carteirinha

**User Story:** Como tutor logado, quero interagir com a carteirinha para ver frente e verso de forma intuitiva e visualmente agradável.

#### Acceptance Criteria

1. WHEN o Tutor clica na Carteirinha, THE Sistema_Carteirinha SHALL executar uma Flip_Animation revelando o lado oposto (frente para verso ou verso para frente)
2. WHEN o Tutor posiciona o cursor sobre a Carteirinha em dispositivos desktop, THE Sistema_Carteirinha SHALL executar a Flip_Animation revelando o verso
3. THE Sistema_Carteirinha SHALL implementar a Flip_Animation usando transformações CSS 3D com transição suave

### Requirement 9: Download da Carteirinha

**User Story:** Como tutor logado, quero baixar a carteirinha para tê-la salva no meu dispositivo e poder apresentá-la offline.

#### Acceptance Criteria

1. THE Sistema_Carteirinha SHALL exibir um botão "Baixar Carteirinha" abaixo da Carteirinha
2. WHEN o Tutor clica no botão "Baixar Carteirinha", THE Sistema_Carteirinha SHALL exibir um Toast ou alert confirmando a simulação do download

### Requirement 10: Responsividade e Acessibilidade

**User Story:** Como tutor logado, quero acessar a área financeira e a carteirinha em qualquer dispositivo de forma acessível e responsiva.

#### Acceptance Criteria

1. THE Sistema_Financeiro SHALL seguir abordagem mobile-first, adaptando o layout para telas maiores com breakpoints md e lg
2. THE Sistema_Carteirinha SHALL seguir abordagem mobile-first, adaptando o layout para telas maiores com breakpoints md e lg
3. THE Sistema_Financeiro SHALL utilizar elementos semânticos HTML e atributos ARIA para garantir acessibilidade com leitores de tela
4. THE Sistema_Carteirinha SHALL utilizar elementos semânticos HTML e atributos ARIA para garantir acessibilidade com leitores de tela
5. THE Sistema_Financeiro SHALL aplicar focus states visíveis em todos os elementos interativos (botões e filtros)
6. THE Sistema_Carteirinha SHALL aplicar focus states visíveis em todos os elementos interativos (botão de download e seletor de pet)
