# Checklist de Entrega — Semana 1: Frontend

> Use este checklist para validar que tudo foi entregue corretamente.

---

## Setup

- [ ] Projeto Next.js rodando localmente
- [ ] TypeScript configurado
- [ ] Tailwind CSS funcionando
- [ ] Estrutura de pastas organizada

## Páginas

- [ ] Home — renderiza corretamente, responsiva
- [ ] Login — formulário funcional com validação
- [ ] Venda de Plano — 4 steps navegáveis com validação
- [ ] Cadastro do Animal — formulário dinâmico + upload de foto
- [ ] Agenda — calendário com agendamento
- [ ] Área Financeira — listagem com filtros
- [ ] Carteirinha — card visual com flip

## Funcionalidades Transversais

- [ ] Auth Context funcionando (login/logout)
- [ ] Rotas protegidas (redirect para /login)
- [ ] Menu atualiza baseado no estado de auth
- [ ] Responsividade em todas as páginas
- [ ] Dados mockados consistentes entre páginas

## Qualidade

- [ ] Zero erros no console
- [ ] Build sem warnings críticos (`npm run build`)
- [ ] Testes passando (`npm run test`)
- [ ] Código sem hardcodes desnecessários

## Git & PR

- [ ] Branch `feat/frontend-portal` criada
- [ ] Commit seguindo conventional commits
- [ ] Push realizado
- [ ] PR aberto no GitHub
- [ ] Descrição da PR completa

---

## Problemas Comuns e Soluções

| Problema | Solução rápida (prompt) |
|---|---|
| Calendário mostra dias errados | "O calendário está renderizando X dias para o mês Y. Corrija a lógica de cálculo de dias do mês e o dia da semana inicial." |
| Rotas protegidas não redirecionam | "O middleware de auth não está funcionando. O usuário consegue acessar /pets sem estar logado. Corrija o guard de rotas." |
| Multi-step perde dados ao voltar | "Ao navegar de volta no stepper da venda de plano, os dados preenchidos somem. O estado precisa persistir entre steps." |
| Upload de foto não mostra preview | "O upload de foto não está mostrando a preview. Use FileReader.readAsDataURL e atualize o estado com o resultado." |
| Filtro da área financeira não funciona | "Os filtros de status na área financeira não estão filtrando. O estado do filtro ativo não está sendo aplicado na listagem." |
| Build falha com erro de tipos | "O build está falhando com o seguinte erro de TypeScript: [colar erro]. Corrija os tipos." |
