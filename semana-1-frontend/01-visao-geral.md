# Semana 1 — Frontend Completo: Portal Pet Care

## Objetivo

Desenvolver o frontend completo do Portal Pet Care em **1 hora**, passando por todo o fluxo:

1. Histórias no Trello
2. Refinamento com Spec no Kiro
3. Desenvolvimento com prompts
4. Testes
5. Branch, commit e PR no GitHub

---

## O que será construído

| Página | Complexidade | Desafio |
|---|---|---|
| Home | Baixa | Layout responsivo, componentização |
| Login | Média | Formulário com validação, estado de autenticação |
| Venda de Plano | Alta | Fluxo multi-step, seleção de plano, resumo |
| Cadastro do Animal | Média | Formulário dinâmico, upload de foto |
| Agenda | Alta | Calendário interativo, slots de horário |
| Área Financeira | Média | Listagem com filtros, status de pagamento |
| Carteirinha | Baixa | Exibição de dados, geração visual do cartão |

---

## Momentos Complexos (onde o Kiro brilha)

1. **Fluxo multi-step da Venda de Plano** — estado compartilhado entre steps, validação parcial
2. **Calendário da Agenda** — integração com slots disponíveis, bloqueio de horários
3. **Componentização agressiva** — o Kiro precisa manter consistência entre 7 páginas
4. **Roteamento e guards** — proteção de rotas autenticadas
5. **Estado global** — contexto de auth propagado em toda a app

---

## Divisão do Tempo (1h)

| Tempo | Atividade |
|---|---|
| 0-5min | Setup do projeto + branch |
| 5-15min | Criar spec no Kiro (refinamento) |
| 15-45min | Desenvolvimento guiado por prompts |
| 45-55min | Testes |
| 55-60min | Commit + PR |

---

## Pré-requisitos

- Node.js 18+
- Git configurado
- Conta GitHub com repo criado
- Kiro CLI/IDE pronto
- Trello com board do Pet Care
