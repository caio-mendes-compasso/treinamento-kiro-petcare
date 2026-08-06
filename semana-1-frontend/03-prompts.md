# Prompts — Semana 1: Frontend

> Prompts prontos para copiar e colar no Kiro durante o treinamento.
> Cada seção corresponde a uma etapa do fluxo.

---

## 1. Setup do Projeto

### Criar projeto Next.js

```
Crie um projeto Next.js com TypeScript, Tailwind CSS e App Router.
Nome do projeto: petcare-portal
Inclua:
- ESLint configurado
- Estrutura de pastas: /app, /components, /contexts, /types, /mocks
- Layout base com Header e Footer como Server Components
- Configuração de fontes (Inter do Google Fonts)
```

---

## 2. Spec — Refinamento das Histórias

### Criar Spec para o projeto completo

```
Crie uma spec para o Portal Pet Care - um sistema web para gerenciamento de planos de saúde animal.

O portal tem as seguintes páginas:
1. Home - landing page com banner, benefícios e CTA
2. Login - autenticação com email/senha (mock)
3. Venda de Plano - fluxo multi-step (escolha do plano → dados tutor → dados pet → confirmação)
4. Cadastro do Animal - formulário dinâmico com upload de foto
5. Agenda - calendário mensal com slots para consultas e exames
6. Área Financeira - listagem de faturas com filtro por status
7. Carteirinha - visualização estilo cartão do plano

Requisitos técnicos:
- Next.js 14+ com App Router e TypeScript
- Tailwind CSS para estilização
- Context API para estado global (auth + dados do usuário)
- Dados mockados (sem backend)
- Rotas protegidas (precisa estar logado para acessar tudo exceto Home e Login)
- Validação de formulários com Zod
- Responsivo (mobile-first)

Planos disponíveis:
- Básico: R$ 49,90/mês (Consultas + Vacinas)
- Plus: R$ 89,90/mês (Básico + Exames + Emergência)
- Premium: R$ 149,90/mês (Plus + Cirurgias + Internação)
```

---

## 3. Desenvolvimento — Prompts por Feature

### 3.1 Layout Base + Roteamento

```
Implemente o layout base do portal:
1. Header com logo "Pet Care", menu de navegação (Home, Planos, Login) e quando logado mostrar (Meus Pets, Agenda, Financeiro, Carteirinha) + botão logout
2. Footer com informações de contato e links úteis
3. Sidebar de navegação no mobile (hamburger menu)
4. Roteamento com as páginas: /, /login, /planos, /pets, /agenda, /financeiro, /carteirinha
5. Layout wrapper que aplica Header + Footer em todas as páginas

Use Tailwind CSS. O tema é: azul petróleo (#0D7377) como primário e branco como fundo.
```

### 3.2 Auth Context + Login

```
Implemente o sistema de autenticação mock:

1. AuthContext com:
   - user (dados do usuário logado ou null)
   - login(email, password) - simula autenticação (aceita qualquer email válido + senha "123456")
   - logout()
   - isAuthenticated (boolean)

2. Página de Login com:
   - Formulário com email e senha
   - Validação com Zod (email válido, senha min 6 chars)
   - Feedback de erro inline nos campos
   - Loading state no botão durante "autenticação" (setTimeout 1s)
   - Redirect para /pets após login
   - Link "Esqueci minha senha" (sem funcionalidade, só visual)

3. Middleware/Guard de rotas:
   - Rotas /pets, /agenda, /financeiro, /carteirinha redirecionam para /login se não autenticado
   - /login redireciona para /pets se já autenticado

Dados mock do usuário após login:
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "plan": "Plus",
  "planNumber": "PC-2025-001234"
}
```

### 3.3 Home Page

```
Implemente a Home Page do Pet Care:

1. Hero banner com:
   - Título: "Cuidado completo para quem você ama"
   - Subtítulo: "Planos de saúde veterinário a partir de R$ 49,90/mês"
   - CTA: botão "Conheça nossos planos" → /planos
   - Imagem placeholder de um pet feliz

2. Seção "Por que escolher o Pet Care?" com 4 cards:
   - Consultas ilimitadas
   - Rede credenciada nacional
   - Emergência 24h
   - App de acompanhamento

3. Seção comparativo de planos (tabela ou cards lado a lado):
   - Básico, Plus, Premium com preços e features
   - Botão "Contratar" em cada um → /planos

4. Seção depoimentos (3 cards com foto placeholder, nome e texto)

5. CTA final: "Seu pet merece o melhor" + botão contratar

Responsivo, mobile-first, usando o tema azul petróleo.
```

### 3.4 Venda de Plano (Multi-step)

```
Implemente o fluxo de Venda de Plano com 4 steps:

Step 1 - Escolha do Plano:
- 3 cards (Básico R$49,90, Plus R$89,90, Premium R$149,90)
- Cada card com lista de benefícios
- Card selecionado com destaque visual
- Botão "Continuar" habilitado apenas com seleção

Step 2 - Dados do Tutor:
- Campos: nome completo, CPF (com máscara), email, telefone (com máscara)
- Validação com Zod
- Todos obrigatórios

Step 3 - Dados do Pet:
- Campos: nome, espécie (select: Cão/Gato/Outro), raça (select dinâmico por espécie), data nascimento, peso
- Raças mockadas: Cão (Golden, Labrador, Bulldog, Poodle, SRD), Gato (Siamês, Persa, Maine Coon, SRD)

Step 4 - Resumo e Confirmação:
- Exibe todos os dados preenchidos
- Valor do plano selecionado
- Checkbox "Li e aceito os termos"
- Botão "Contratar" → tela de sucesso

Componente Stepper visual no topo mostrando o progresso.
Use useReducer para gerenciar o estado dos steps.
Botão "Voltar" em cada step (exceto o primeiro).
```

### 3.5 Cadastro do Animal

```
Implemente a página de Cadastro do Animal:

1. Listagem dos animais já cadastrados (cards com foto, nome, espécie, raça)
   - Mock inicial com 2 animais (Thor - Golden Retriever, Luna - Siamês)
   - Máximo 3 animais, esconder botão "Adicionar" se atingiu limite

2. Formulário de cadastro (modal ou seção expansível):
   - Nome do animal
   - Espécie (select: Cão, Gato, Outro)
   - Raça (select dinâmico baseado na espécie)
   - Data de nascimento (date picker)
   - Peso em kg (number input)
   - Cor/pelagem (text)
   - Upload de foto com preview (FileReader API, aceitar apenas imagens, max 5MB)

3. Validação com Zod em todos os campos obrigatórios
4. Ao cadastrar, adiciona na listagem (estado local, sem persistência)
5. Botão de remover animal na listagem (com confirmação)
```

### 3.6 Agenda

```
Implemente a página de Agenda:

1. Calendário mensal:
   - Visualização do mês atual com navegação (< mês anterior | mês atual | próximo mês >)
   - Dias clicáveis
   - Indicador visual nos dias que têm agendamento
   - Desabilitar dias passados

2. Ao clicar em um dia, mostrar painel lateral ou modal com:
   - Slots disponíveis: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
   - Alguns slots já ocupados (mock: randomizar 2 slots bloqueados por dia)
   - Tipo: Consulta ou Exame (radio)
   - Selecionar qual pet (se tiver mais de um)
   - Botão "Confirmar agendamento"

3. Lista de agendamentos futuros abaixo do calendário:
   - Cards com: data, hora, tipo, nome do pet, status
   - Botão "Cancelar" com confirmação

NÃO use biblioteca de calendário. Implemente o grid do calendário manualmente para mostrar domínio de lógica de datas.
```

### 3.7 Área Financeira

```
Implemente a Área Financeira:

1. Resumo no topo:
   - Card "Total Pago" (soma dos status=paid)
   - Card "Pendente" (soma dos status=pending)
   - Card "Vencido" (soma dos status=overdue) em vermelho se > 0

2. Filtros:
   - Tabs ou botões: Todos | Pagos | Pendentes | Vencidos
   - Filtro ativo com destaque visual

3. Listagem de faturas (tabela ou cards):
   - Mês referência (ex: "Janeiro 2025")
   - Valor (R$ formatado)
   - Status com badge colorido (verde=pago, amarelo=pendente, vermelho=vencido)
   - Ações: "Copiar código de barras" (simula com toast), "2ª via" (simula download)

Dados mock: gerar 12 meses de faturas com status variados.
```

### 3.8 Carteirinha

```
Implemente a página da Carteirinha:

1. Se tiver mais de um pet, seletor no topo para alternar entre eles

2. Card visual estilo carteirinha (aspect-ratio 1.6:1, tipo cartão de crédito):
   - Frente:
     - Logo "Pet Care" no canto superior
     - Nome do plano (Básico/Plus/Premium) com cor correspondente
     - Nome do tutor
     - Nome do animal
     - Número do plano (formato: PC-2025-XXXXXX)
     - Validade (mês/ano)
   - Verso (flip on hover ou botão para virar):
     - Foto do animal (ou placeholder)
     - Espécie e raça
     - Telefone de emergência: 0800-PET-CARE
     - QR Code placeholder

3. Botão "Baixar Carteirinha" (simula com alert ou toast)

Estilo visual clean, com gradiente sutil no fundo do cartão.
Use Tailwind para o flip animation.
```

---

## 4. Testes

### Rodar testes existentes

```
Crie testes unitários para os componentes mais críticos do projeto:

1. AuthContext - testar login, logout, persistência do estado
2. Componente Stepper (Venda de Plano) - testar navegação entre steps, validação
3. Formulário de Login - testar validação, submit, estados de loading/erro
4. Calendário (Agenda) - testar navegação de meses, seleção de dia, slots

Use React Testing Library + Jest (ou Vitest se o projeto usar Vite).
Foco em comportamento do usuário, não implementação interna.
```

---

## 5. Git + PR

### Criar branch e commit

```
Crie um commit seguindo conventional commits para todo o frontend do Pet Care que desenvolvemos.
Use o tipo "feat" com escopo "frontend".
A mensagem deve ser clara e o body deve listar as features implementadas.
```

### Criar PR

```
Crie uma Pull Request no GitHub para a branch atual.
Título: "feat(frontend): Portal Pet Care - Frontend completo"
Descrição deve incluir:
- Resumo do que foi feito
- Lista de páginas implementadas
- Screenshots placeholder (mencionar que serão adicionados)
- Checklist de review
- Notas para o reviewer
```

---

## 6. Prompts de Suporte (se precisar durante o desenvolvimento)

### Corrigir erro de build

```
O projeto está com erro de build. Analise o erro abaixo e corrija:
[colar erro aqui]
```

### Melhorar responsividade

```
A página [nome] não está ficando boa no mobile. Ajuste o layout para telas menores que 768px, mantendo a usabilidade.
```

### Refatorar componente

```
O componente [nome] está muito grande. Refatore-o em subcomponentes menores mantendo a mesma funcionalidade e interface visual.
```

### Adicionar animação

```
Adicione transições suaves nas seguintes interações:
- Troca de steps na Venda de Plano (slide horizontal)
- Abertura do modal de agendamento (fade + scale)
- Flip da carteirinha (rotate 3D)
Use CSS transitions ou Tailwind animations.
```
