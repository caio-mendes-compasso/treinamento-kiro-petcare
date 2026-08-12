# Histórias de Usuário — Semana 1: Frontend

> Cards prontos para criar no Trello. Cada seção = 1 card.
> Copie título, descrição e checklist diretamente para o Trello.
>
> **Board:** Pet Care Portal
> **Lista:** Sprint 1 - Frontend
> **Labels:** 🟢 Frontend | 🔵 Setup | 🟡 Auth

---

## Estrutura Monorepo

O projeto será criado como monorepo:

```
petcare-portal/          ← raiz do repo
├── frontend/            ← Next.js (Semana 1)
├── backend/             ← Spring Boot (Semana 2)
├── infra/               ← IaC / diagramas (Semana 2)
├── docs/                ← documentação
├── docker-compose.yml   ← orquestração local
└── README.md
```

---

## Card 1

**Título:** [SETUP] Criação do monorepo e projeto Next.js

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero configurar o monorepo do Pet Care com o projeto frontend Next.js para iniciar o desenvolvimento.

**Critérios de Aceite:**
- [ ] Repositório criado no GitHub
- [ ] Estrutura monorepo: `/frontend`, `/backend`, `/infra`, `/docs`
- [ ] Projeto Next.js criado em `/frontend` com TypeScript + Tailwind CSS + App Router
- [ ] ESLint configurado
- [ ] Estrutura de pastas: `/app`, `/components`, `/contexts`, `/types`, `/mocks`
- [ ] `npm run dev` funcionando em localhost:3000
- [ ] README.md na raiz com instruções de setup
- [ ] .gitignore configurado para monorepo (node_modules, .next, target, etc)

---

## Card 2

**Título:** [FEAT] Layout base — Header, Footer e Roteamento

**Label:** 🟢 Frontend

**Descrição:**
Como usuário do portal, quero navegar entre as páginas do Pet Care com um layout consistente (header e footer) para ter uma experiência fluida.

**Critérios de Aceite:**
- [ ] Header com logo "Pet Care", menu de navegação e botão de login
- [ ] Menu público: Home, Planos, Login
- [ ] Menu autenticado: Meus Pets, Agenda, Financeiro, Carteirinha + botão Logout
- [ ] Footer com informações de contato e links úteis
- [ ] Sidebar/hamburger menu no mobile
- [ ] Roteamento: `/`, `/login`, `/planos`, `/pets`, `/agenda`, `/financeiro`, `/carteirinha`
- [ ] Layout wrapper aplicando Header + Footer em todas as páginas
- [ ] Tema: azul petróleo (#0D7377) como primário, branco como fundo
- [ ] Responsivo (mobile-first)

---

## Card 3

**Título:** [FEAT] Login e Autenticação (Mock)

**Label:** 🟡 Auth

**Descrição:**
Como usuário cadastrado, quero fazer login no portal para acessar minha área restrita e gerenciar meu plano.

**Critérios de Aceite:**
- [ ] AuthContext com: user, login(), logout(), isAuthenticated
- [ ] Mock de autenticação: aceita qualquer email válido + senha "123456"
- [ ] Página /login com formulário (email + senha)
- [ ] Validação com Zod: email válido, senha mínimo 6 caracteres
- [ ] Feedback visual de erros inline nos campos
- [ ] Loading state no botão durante autenticação (1s delay)
- [ ] Redirect para /pets após login bem-sucedido
- [ ] /login redireciona para /pets se já autenticado
- [ ] Rotas protegidas: /pets, /agenda, /financeiro, /carteirinha → redirect /login se não autenticado
- [ ] Link "Esqueci minha senha" (sem funcionalidade, apenas visual)
- [ ] Persistência do token em localStorage

**Dados mock do usuário logado:**
```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "plan": "Plus",
  "planNumber": "PC-2025-001234"
}
```

---

## Card 4

**Título:** [FEAT] Home Page

**Label:** 🟢 Frontend

**Descrição:**
Como visitante do portal, quero ver a página inicial do Pet Care para entender os serviços oferecidos e navegar para as funcionalidades.

**Critérios de Aceite:**
- [ ] Hero banner: título "Cuidado completo para quem você ama", subtítulo com preço, CTA "Conheça nossos planos" → /planos
- [ ] Seção "Por que escolher o Pet Care?" com 4 cards: Consultas ilimitadas, Rede credenciada, Emergência 24h, App de acompanhamento
- [ ] Seção comparativo de planos (Básico, Plus, Premium) com preços e features + botão "Contratar"
- [ ] Seção depoimentos (3 cards com foto placeholder, nome e texto)
- [ ] CTA final: "Seu pet merece o melhor" + botão contratar
- [ ] Layout responsivo (mobile/tablet/desktop)

---

## Card 5

**Título:** [FEAT] Venda de Plano — Fluxo Multi-step

**Label:** 🟢 Frontend

**Descrição:**
Como visitante ou usuário logado, quero contratar um plano de saúde para meu pet através de um fluxo guiado de etapas.

**Critérios de Aceite:**
- [ ] Step 1 — Escolha do Plano: 3 cards (Básico R$49,90, Plus R$89,90, Premium R$149,90) com benefícios, seleção com destaque visual
- [ ] Step 2 — Dados do Tutor: nome completo, CPF (com máscara), email, telefone (com máscara), todos obrigatórios
- [ ] Step 3 — Dados do Pet: nome, espécie (select), raça (dinâmico por espécie), data nascimento, peso
- [ ] Step 4 — Resumo e Confirmação: exibe todos dados, valor, checkbox termos, botão "Contratar"
- [ ] Stepper visual no topo mostrando progresso
- [ ] Validação com Zod por step antes de avançar
- [ ] Botão "Voltar" em cada step (exceto primeiro) sem perder dados
- [ ] Tela de sucesso ao finalizar
- [ ] Gerenciamento de estado com useReducer

**Planos:**
| Plano | Preço | Cobertura |
|---|---|---|
| Básico | R$ 49,90/mês | Consultas + Vacinas |
| Plus | R$ 89,90/mês | Básico + Exames + Emergência |
| Premium | R$ 149,90/mês | Plus + Cirurgias + Internação |

**Raças mock:**
- Cão: Golden Retriever, Labrador, Bulldog, Poodle, SRD
- Gato: Siamês, Persa, Maine Coon, SRD

---

## Card 6

**Título:** [FEAT] Cadastro do Animal

**Label:** 🟢 Frontend

**Descrição:**
Como usuário logado, quero cadastrar meu animal de estimação para ter o registro dele vinculado ao meu plano.

**Critérios de Aceite:**
- [ ] Listagem dos animais cadastrados (cards com foto, nome, espécie, raça)
- [ ] Mock inicial: 2 animais (Thor - Golden Retriever, Luna - Siamês)
- [ ] Máximo 3 animais por plano — esconder botão "Adicionar" se atingiu limite
- [ ] Formulário de cadastro (modal ou seção expansível):
  - Nome, Espécie (select: Cão/Gato/Outro), Raça (dinâmico por espécie)
  - Data de nascimento, Peso (kg), Cor/pelagem
  - Upload de foto com preview (FileReader API, apenas imagens, max 5MB)
- [ ] Validação com Zod em todos os campos obrigatórios
- [ ] Ao cadastrar: adiciona na listagem (estado local)
- [ ] Botão remover animal com confirmação (dialog)

---

## Card 7

**Título:** [FEAT] Agenda — Calendário e Agendamento

**Label:** 🟢 Frontend

**Descrição:**
Como usuário logado, quero agendar consultas e exames para meu pet visualizando um calendário com horários disponíveis.

**Critérios de Aceite:**
- [ ] Calendário mensal com navegação (< mês anterior | mês atual | próximo >)
- [ ] Grid do calendário implementado manualmente (sem lib externa)
- [ ] Dias clicáveis com indicador visual nos dias com agendamento
- [ ] Dias passados desabilitados
- [ ] Ao clicar num dia: painel/modal com slots (09:00, 10:00, 11:00, 14:00, 15:00, 16:00)
- [ ] Alguns slots bloqueados (mock: 2 randômicos por dia)
- [ ] Seleção de tipo: Consulta ou Exame (radio)
- [ ] Seleção do pet (se tiver mais de um)
- [ ] Botão "Confirmar agendamento"
- [ ] Lista de agendamentos futuros abaixo do calendário (cards com data, hora, tipo, pet, status)
- [ ] Botão "Cancelar" com confirmação

---

## Card 8

**Título:** [FEAT] Área Financeira

**Label:** 🟢 Frontend

**Descrição:**
Como usuário logado, quero visualizar minhas faturas e simular pagamento de boletos para manter meu plano em dia.

**Critérios de Aceite:**
- [ ] Resumo no topo: Card "Total Pago", Card "Pendente", Card "Vencido" (vermelho se > 0)
- [ ] Filtros: Todos | Pagos | Pendentes | Vencidos (tabs ou botões com destaque visual)
- [ ] Listagem de faturas: mês referência, valor (R$ formatado), status com badge colorido (verde/amarelo/vermelho)
- [ ] Ações: "Copiar código de barras" (simula com toast), "2ª via" (simula download)
- [ ] Dados mock: 12 meses de faturas com status variados

---

## Card 9

**Título:** [FEAT] Carteirinha do Plano

**Label:** 🟢 Frontend

**Descrição:**
Como usuário logado, quero visualizar a carteirinha do meu plano para apresentar em clínicas veterinárias.

**Critérios de Aceite:**
- [ ] Seletor de pet no topo (se tiver mais de um)
- [ ] Card visual estilo carteirinha (aspect-ratio 1.6:1):
  - Frente: Logo Pet Care, nome do plano (cor correspondente), nome tutor, nome animal, número do plano (PC-2025-XXXXXX), validade
  - Verso (flip on hover/click): foto do animal (ou placeholder), espécie/raça, telefone emergência 0800-PET-CARE, QR Code placeholder
- [ ] Flip animation (CSS/Tailwind)
- [ ] Botão "Baixar Carteirinha" (simula com alert/toast)
- [ ] Visual clean, gradiente sutil no fundo do cartão

---

## Card 10

**Título:** [TEST] Testes unitários dos componentes críticos

**Label:** 🟢 Frontend

**Descrição:**
Como desenvolvedor, quero testes unitários nos componentes mais críticos para garantir que o comportamento está correto.

**Critérios de Aceite:**
- [ ] AuthContext: testar login, logout, persistência do estado
- [ ] Stepper (Venda de Plano): testar navegação entre steps, validação por step
- [ ] Formulário de Login: testar validação, submit, loading/erro
- [ ] Calendário (Agenda): testar navegação de meses, seleção de dia, renderização correta
- [ ] Usar React Testing Library + Jest/Vitest
- [ ] Foco em comportamento do usuário, não implementação interna
- [ ] Todos os testes passando (`npm run test`)

---

## Card 11

**Título:** [CHORE] Pull Request — Frontend completo

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero abrir uma PR com todo o frontend desenvolvido para review e merge.

**Critérios de Aceite:**
- [ ] Branch: `feat/frontend-portal`
- [ ] Commit seguindo conventional commits: `feat(frontend): ...`
- [ ] Build sem erros (`npm run build`)
- [ ] Testes passando (`npm run test`)
- [ ] PR aberta no GitHub com:
  - Resumo do que foi feito
  - Lista de páginas implementadas
  - Checklist de review
  - Instruções para rodar localmente
