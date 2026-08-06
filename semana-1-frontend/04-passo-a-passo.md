# Passo a Passo — Semana 1: Frontend

> Guia sequencial para o facilitador seguir durante o treinamento.
> Cada etapa tem o que fazer, o prompt a usar e o resultado esperado.

---

## Preparação (antes do treinamento)

- [ ] Repo criado no GitHub (vazio, só com README)
- [ ] Board no Trello com as 7 histórias criadas (copiar de `02-historias.md`)
- [ ] Kiro IDE aberto e configurado
- [ ] Terminal pronto

---

## Etapa 1: Setup do Projeto (5 min)

### 1.1 Clonar repo e criar branch

```bash
git clone https://github.com/[org]/petcare-portal.git
cd petcare-portal
git checkout -b feat/frontend-portal
```

### 1.2 Criar projeto com Kiro

> Usar o prompt de **"Setup do Projeto"** do arquivo `03-prompts.md`

**Resultado esperado:**
- Projeto Next.js criado com TypeScript + Tailwind
- Estrutura de pastas organizada
- `npm run dev` funcionando em localhost:3000

### 1.3 Validar setup

```bash
npm run dev
```

Abrir no browser e confirmar página default do Next.js.

---

## Etapa 2: Spec — Refinamento (10 min)

### 2.1 Abrir modo Spec no Kiro

Iniciar uma nova Spec session no Kiro.

### 2.2 Colar o prompt de Spec

> Usar o prompt de **"Criar Spec para o projeto completo"** do arquivo `03-prompts.md`

### 2.3 Revisar a spec gerada

**Pontos a destacar para o time:**
- O Kiro gera requirements, design e tasks
- Revisar se os critérios de aceite fazem sentido
- Ajustar o que precisar (mostrar que spec é iterativa)

### 2.4 Aprovar a spec

Aprovar cada fase (requirements → design → tasks) revisando com o time.

**Momento de discussão:**
> "Olhem como a spec gera tasks na ordem certa de dependência. O layout base vem antes das páginas que usam ele."

---

## Etapa 3: Desenvolvimento (30 min)

### 3.1 Layout Base + Roteamento (5 min)

> Usar prompt **3.1** do arquivo `03-prompts.md`

**Resultado esperado:**
- Header com navegação
- Footer
- Roteamento funcionando
- Menu responsivo

**Validação:** Navegar entre rotas no browser, testar mobile (DevTools).

---

### 3.2 Auth Context + Login (5 min)

> Usar prompt **3.2** do arquivo `03-prompts.md`

**Resultado esperado:**
- Página /login com formulário funcional
- Login com email qualquer + senha "123456"
- Redirect após login
- Rotas protegidas redirecionam para /login

**Validação:**
1. Acessar /pets sem login → deve ir para /login
2. Fazer login → deve ir para /pets
3. Menu atualiza mostrando opções autenticadas

**Momento complexo:**
> "Notem como o Kiro gerencia o Context + middleware de rota. Se ele errar a proteção de rotas, mostrem como corrigir com um prompt de follow-up."

---

### 3.3 Home Page (3 min)

> Usar prompt **3.3** do arquivo `03-prompts.md`

**Resultado esperado:**
- Landing page completa e bonita
- Responsiva
- CTAs linkando para /planos

**Validação:** Visual no browser, testar responsividade.

---

### 3.4 Venda de Plano — Multi-step (7 min)

> Usar prompt **3.4** do arquivo `03-prompts.md`

**Resultado esperado:**
- 4 steps funcionando
- Stepper visual no topo
- Validação por step
- Navegação frente/trás sem perder dados
- Tela de sucesso

**Validação:**
1. Tentar avançar sem selecionar plano → bloqueado
2. Preencher step 2, ir para step 3, voltar → dados mantidos
3. Completar fluxo inteiro → tela de sucesso

**Momento complexo:**
> "O multi-step é onde mais vemos o Kiro tomar decisões de arquitetura. Ele escolheu useReducer ou Context? A validação é por step ou global? Discutam se concordam."

---

### 3.5 Cadastro do Animal (4 min)

> Usar prompt **3.5** do arquivo `03-prompts.md`

**Resultado esperado:**
- Lista de pets mockados
- Formulário com campos dinâmicos
- Upload de foto com preview
- Limite de 3 animais

**Validação:**
1. Trocar espécie → raças atualizam
2. Upload de imagem → preview aparece
3. Cadastrar 3º animal → botão "Adicionar" some

---

### 3.6 Agenda (5 min)

> Usar prompt **3.6** do arquivo `03-prompts.md`

**Resultado esperado:**
- Calendário renderizado corretamente
- Navegação entre meses
- Slots clicáveis
- Agendamento funcional

**Validação:**
1. Mês anterior e próximo funcionam
2. Dias passados desabilitados
3. Clicar dia → mostra slots
4. Agendar → aparece na lista abaixo

**Momento complexo:**
> "Calendário sem lib é um desafio clássico. O Kiro sabe calcular quantos dias tem o mês, qual dia da semana começa? Se errar, como vocês corrigem com prompt?"

---

### 3.7 Área Financeira (3 min)

> Usar prompt **3.7** do arquivo `03-prompts.md`

**Resultado esperado:**
- Cards de resumo com valores
- Filtros funcionando
- Lista de faturas com badges coloridos
- Ações simuladas (toast/alert)

**Validação:**
1. Filtrar por "Vencidos" → mostra apenas vencidos
2. Clicar "Copiar código" → feedback visual

---

### 3.8 Carteirinha (3 min)

> Usar prompt **3.8** do arquivo `03-prompts.md`

**Resultado esperado:**
- Card visual estilo carteirinha
- Flip funcional (frente/verso)
- Troca de pet funciona
- Visual limpo

**Validação:** Hover ou click faz flip, trocar pet atualiza dados.

---

## Etapa 4: Testes (10 min)

### 4.1 Gerar testes

> Usar prompt de **"Testes"** do arquivo `03-prompts.md`

### 4.2 Rodar testes

```bash
npm run test
```

**Resultado esperado:**
- Testes passando para AuthContext, Stepper, Login e Calendário
- Coverage razoável nos componentes críticos

**Se algum teste falhar:**
> "Vejam o erro, copiem e colem no Kiro pedindo pra corrigir. Isso é o dia a dia."

---

## Etapa 5: Branch, Commit e PR (5 min)

### 5.1 Verificar status

```bash
git status
```

### 5.2 Adicionar arquivos

```bash
git add .
```

### 5.3 Commit com Kiro

> Usar prompt de **"Criar branch e commit"** do arquivo `03-prompts.md`

Ou usar o comando do Kiro CLI para gerar commit message.

**Resultado esperado:**
```
feat(frontend): implement Pet Care portal with all pages

- Home page with hero, benefits and plan comparison
- Login with mock auth and route protection
- Multi-step plan purchase flow
- Pet registration with dynamic form and photo upload
- Appointment calendar with slot booking
- Financial area with invoice listing and filters
- Plan card (carteirinha) with flip animation
- Unit tests for critical components
```

### 5.4 Push

```bash
git push -u origin feat/frontend-portal
```

### 5.5 Criar PR com Kiro

> Usar prompt de **"Criar PR"** do arquivo `03-prompts.md`

Ou via CLI:

```bash
gh pr create --title "feat(frontend): Portal Pet Care - Frontend completo" --body-file pr-description.md
```

---

## Encerramento

### Recapitular o que foi feito em 1h:

1. ✅ Projeto criado do zero
2. ✅ Spec refinada com Kiro
3. ✅ 7 páginas implementadas
4. ✅ Autenticação mock + rotas protegidas
5. ✅ Testes nos componentes críticos
6. ✅ Commit convencional
7. ✅ PR aberto no GitHub

### Gancho para Semana 2:

> "Semana que vem: vamos definir a arquitetura AWS e já criar o backend Spring Boot 3.5 completo — endpoints, banco, segurança, tudo. E na semana 3 migramos para Spring Boot 4.0 e conectamos tudo funcionando end-to-end."
