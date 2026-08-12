# Requirements Document

## Introduction

Funcionalidade de agenda com calendário mensal e sistema de agendamento de consultas e exames para pets. O usuário logado pode visualizar horários disponíveis, selecionar um slot, escolher o tipo de atendimento e o pet, confirmar o agendamento e gerenciar seus agendamentos futuros. A persistência dos dados segue o padrão localStorage já utilizado no projeto. A lista de pets é obtida via PetsContext global compartilhado entre páginas.

## Glossary

- **Calendar_Component**: Componente de calendário mensal implementado manualmente (sem bibliotecas externas) que exibe os dias do mês em formato grid
- **Scheduling_Modal**: Modal/Dialog centralizado exibido ao clicar em um dia do calendário, contendo slots de horário, seleção de tipo e seleção de pet
- **Slot**: Horário disponível para agendamento (09:00, 10:00, 11:00, 14:00, 15:00, 16:00)
- **Blocked_Slot**: Slot indisponível para agendamento, simulado com 2 horários randômicos bloqueados por dia (mock)
- **Appointment**: Registro de agendamento contendo data, horário, tipo (Consulta ou Exame), pet associado e status
- **Appointments_List**: Lista de agendamentos futuros exibida abaixo do calendário em formato de cards
- **PetsContext**: Context global do React que fornece a lista de pets cadastrados, compartilhado entre as páginas de Pets e Agenda
- **Appointment_Type**: Classificação do agendamento como "Consulta" ou "Exame"
- **System**: O módulo de Agenda do aplicativo Pet Care

## Requirements

### Requirement 1: Navegação Mensal do Calendário

**User Story:** As a usuário logado, I want navegar entre meses no calendário, so that eu possa visualizar e planejar agendamentos em diferentes meses.

#### Acceptance Criteria

1. THE Calendar_Component SHALL exibir o mês atual como estado inicial com o nome do mês e ano no cabeçalho
2. THE Calendar_Component SHALL renderizar um grid com os dias do mês organizados por dia da semana (Dom–Sáb)
3. WHEN o usuário clicar no botão de mês anterior, THE Calendar_Component SHALL exibir o mês imediatamente anterior ao mês atual exibido
4. WHEN o usuário clicar no botão de próximo mês, THE Calendar_Component SHALL exibir o mês imediatamente seguinte ao mês atual exibido
5. THE Calendar_Component SHALL ser implementado sem uso de bibliotecas externas de calendário

### Requirement 2: Interação com Dias do Calendário

**User Story:** As a usuário logado, I want clicar em um dia para ver os horários disponíveis, so that eu possa escolher o melhor momento para o agendamento.

#### Acceptance Criteria

1. WHEN o usuário clicar em um dia válido (presente ou futuro), THE System SHALL abrir o Scheduling_Modal centralizado na tela
2. WHILE um dia está no passado (anterior à data atual), THE Calendar_Component SHALL exibir o dia com estilo desabilitado e impedir interação de clique
3. WHILE um dia possui pelo menos um Appointment agendado, THE Calendar_Component SHALL exibir um indicador visual nesse dia
4. THE Calendar_Component SHALL diferenciar visualmente o dia atual dos demais dias

### Requirement 3: Exibição de Slots no Modal

**User Story:** As a usuário logado, I want ver os horários disponíveis e bloqueados ao selecionar um dia, so that eu saiba quais opções estão livres para agendamento.

#### Acceptance Criteria

1. WHEN o Scheduling_Modal é aberto para um dia, THE Scheduling_Modal SHALL exibir 6 slots de horário: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
2. THE Scheduling_Modal SHALL exibir 2 Blocked_Slots por dia gerados de forma randômica (mock)
3. WHILE um Slot está bloqueado, THE Scheduling_Modal SHALL exibir o slot com estilo visual de indisponível e impedir seleção
4. WHILE um Slot já possui um Appointment agendado pelo usuário, THE Scheduling_Modal SHALL exibir o slot com estilo visual de ocupado e impedir seleção
5. WHEN o usuário clicar em um Slot disponível, THE Scheduling_Modal SHALL marcar o slot como selecionado com destaque visual

### Requirement 4: Formulário de Agendamento

**User Story:** As a usuário logado, I want selecionar o tipo de atendimento e o pet, so that o agendamento fique completo com todas as informações necessárias.

#### Acceptance Criteria

1. THE Scheduling_Modal SHALL exibir opções de Appointment_Type como radio buttons: "Consulta" e "Exame"
2. WHILE o usuário possui mais de um pet cadastrado no PetsContext, THE Scheduling_Modal SHALL exibir um seletor de pet
3. WHILE o usuário possui exatamente um pet cadastrado no PetsContext, THE Scheduling_Modal SHALL pré-selecionar automaticamente o único pet disponível
4. THE Scheduling_Modal SHALL exibir o botão "Confirmar agendamento"
5. WHILE nenhum Slot estiver selecionado ou nenhum Appointment_Type estiver escolhido, THE Scheduling_Modal SHALL manter o botão "Confirmar agendamento" desabilitado

### Requirement 5: Confirmação de Agendamento

**User Story:** As a usuário logado, I want confirmar meu agendamento, so that a consulta ou exame fique registrado na minha agenda.

#### Acceptance Criteria

1. WHEN o usuário clicar em "Confirmar agendamento" com slot, tipo e pet selecionados, THE System SHALL criar um novo Appointment com status "agendado"
2. WHEN um Appointment é criado, THE System SHALL persistir o Appointment no localStorage seguindo o padrão do projeto
3. WHEN um Appointment é criado, THE Scheduling_Modal SHALL fechar automaticamente
4. WHEN um Appointment é criado, THE Appointments_List SHALL atualizar para incluir o novo agendamento
5. WHEN um Appointment é criado, THE Calendar_Component SHALL atualizar o indicador visual no dia correspondente

### Requirement 6: Lista de Agendamentos Futuros

**User Story:** As a usuário logado, I want visualizar meus agendamentos futuros em uma lista, so that eu tenha controle sobre minhas próximas consultas e exames.

#### Acceptance Criteria

1. THE Appointments_List SHALL ser exibida abaixo do Calendar_Component
2. THE Appointments_List SHALL exibir apenas Appointments com data futura ou igual à data atual
3. THE Appointments_List SHALL exibir cada Appointment como um card contendo: data, horário, tipo (Consulta/Exame), nome do pet e status
4. THE Appointments_List SHALL ordenar os Appointments por data e horário em ordem crescente
5. WHEN a página de Agenda é carregada, THE System SHALL recuperar os Appointments armazenados no localStorage

### Requirement 7: Cancelamento de Agendamento

**User Story:** As a usuário logado, I want cancelar um agendamento existente, so that eu possa liberar o horário caso não precise mais comparecer.

#### Acceptance Criteria

1. THE Appointments_List SHALL exibir um botão "Cancelar" em cada card de Appointment
2. WHEN o usuário clicar no botão "Cancelar", THE System SHALL exibir um diálogo de confirmação antes de efetuar o cancelamento
3. WHEN o usuário confirmar o cancelamento no diálogo, THE System SHALL remover o Appointment do localStorage
4. WHEN o usuário confirmar o cancelamento no diálogo, THE Appointments_List SHALL atualizar removendo o card do agendamento cancelado
5. WHEN o usuário confirmar o cancelamento no diálogo, THE Calendar_Component SHALL atualizar o indicador visual do dia correspondente caso não haja mais agendamentos nesse dia
6. WHEN o usuário cancelar o diálogo de confirmação, THE System SHALL manter o Appointment inalterado

### Requirement 8: PetsContext Global

**User Story:** As a usuário logado, I want que meus pets sejam compartilhados entre a página de Pets e a Agenda, so that eu não precise recadastrar pets em diferentes áreas do aplicativo.

#### Acceptance Criteria

1. THE PetsContext SHALL fornecer a lista de pets cadastrados para todas as páginas protegidas
2. THE PetsContext SHALL inicializar com os dados de pets do localStorage ou com os dados mock padrão
3. WHEN a lista de pets é alterada na página de Pets, THE PetsContext SHALL refletir a alteração em todas as páginas que o consomem
4. THE PetsContext SHALL persistir alterações na lista de pets no localStorage

### Requirement 9: Responsividade e Acessibilidade

**User Story:** As a usuário, I want acessar a agenda de qualquer dispositivo, so that eu possa agendar consultas tanto no celular quanto no computador.

#### Acceptance Criteria

1. THE Calendar_Component SHALL seguir a abordagem mobile-first, exibindo o grid completo em telas pequenas com layout adaptado
2. THE Scheduling_Modal SHALL ocupar largura adequada em dispositivos móveis e manter tamanho máximo em telas maiores
3. THE System SHALL aplicar focus states visíveis (ring) em todos os elementos interativos para navegação por teclado
4. THE Scheduling_Modal SHALL ser fechável pela tecla Escape e por clique fora da área do modal
5. THE System SHALL utilizar a cor primária #0D7377 como cor de destaque em botões, indicadores e elementos ativos conforme identidade visual do projeto
