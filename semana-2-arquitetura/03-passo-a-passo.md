# Passo a Passo — Semana 2: Arquitetura AWS + Backend Spring Boot 3.5

> Guia sequencial para o facilitador. Siga os passos na ordem.
> Os prompts referenciados estão no arquivo `02-prompts.md`.

---

## Antes de começar

- [ ] AWS SSO ativo: `aws sso login --profile petcare`
- [ ] Docker rodando: `docker ps`
- [ ] Kiro aberto no workspace do projeto
- [ ] Board "PetCare" no Trello com Épico na lista "Refinamento"

---

## Passo 1 — Diagrama de Arquitetura (~5 min)

> Colar o **Passo 1** do `02-prompts.md` no Kiro

**O que acontece:**
- Kiro gera diagrama draw.io com ícones AWS
- Abre no browser automaticamente
- Salva como `/docs/architecture/petcare-architecture.drawio`

**Validar com o time:**
- Todos os serviços presentes?
- Fluxo browser → banco faz sentido?
- VPC com subnets públicas/privadas?

**Discussão rápida (2 min):**
1. "Container ou Serverless?" → ECS Fargate (Spring Boot tem cold start ruim no Lambda)
2. "SQL ou NoSQL?" → PostgreSQL (relacionamentos fortes)
3. "Frontend hosting?" → S3 + CloudFront

---

## Passo 2 — Precificação AWS (~5 min)

> Colar o **Passo 2** do `02-prompts.md` no Kiro

**O que acontece:**
- MCP consulta preços reais da AWS Pricing API
- Gera comparativo Container vs Serverless
- Salva em `/docs/architecture/custos.md`

**Discussão:**
- "Custo aceitável pra MVP?"
- "O que entra no free tier?"
- "NAT Gateway ($32/mês) vale?"

---

## Passo 3 — Terraform (~10 min)

### 3.1 Gerar código (5 min)

> Colar o **Passo 3.1** do `02-prompts.md` no Kiro

**Validar:**
- Módulos cobrem todos os serviços do diagrama?
- Tags padrão em tudo?
- Variáveis pra mudar entre ambientes?

### 3.2 Aplicar na AWS (3 min)

> Colar o **Passo 3.2** do `02-prompts.md` no Kiro

**Mostrar:**
- `terraform plan` → quantos recursos?
- `terraform apply` → sucesso?
- Outputs (RDS endpoint, S3 bucket, Cognito Pool)

### 3.3 Mostrar no Console AWS (2 min)

> Colar o **Passo 3.3** do `02-prompts.md` ou abrir o console

**Mostrar no browser:**
- S3 → buckets `petcare-photos-dev-*` e `petcare-frontend-dev-*`
- VPC → subnet, security groups com tag `petcare`
- RDS → instância PostgreSQL criada
- Cognito → User Pool

**Momento impactante:** "Toda essa infra criada pela IA em 10 minutos, sem tocar no console."

---

## Passo 4 — Quebrar Épico em Histórias (~5 min)

> Colar o **Passo 4** do `02-prompts.md` no Kiro

**O que acontece:**
- IA lê o Épico no Trello + diagrama gerado
- Usa o gabarito `05-historias.md` como referência
- Cria ~10-14 cards na lista "A fazer" do Trello

**Validar:**
- Conferir quantidade de cards (esperado: ~12-14)
- Ordem faz sentido? (setup → model → service → controller → security → test)
- Falta algum card? (comparar com `05-historias.md`)

---

## Passo 5 — Implementação Automática (~40 min)

> Colar o **Passo 5** do `02-prompts.md` no Kiro

```
@sprint-executor Execute os cards da lista "A fazer" do Trello, board PetCare.
```

**O que acontece:**
- Agent lista cards e propõe ordem
- Pede confirmação
- Para cada card:
  - Cria branch `feat/{nome-curto}`
  - Gera spec em `.kiro/specs/`
  - Implementa código completo
  - Roda build/testes
  - Commit + Push + PR no GitHub
  - Move card para "Concluído" no Trello
- Apresenta relatório final

**Se algo falhar:**
```
@tech-troubleshooter Erro: [colar o erro]
```

---

## Passo 6 — Mostrar Backend Rodando (~5 min)

> Colar o **Passo 6** do `02-prompts.md` no Kiro ou executar manualmente:

```bash
docker-compose up -d
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

**Demonstrar ao vivo:**
1. Abrir Swagger: http://localhost:8080/swagger-ui/index.html
2. `GET /api/plans` → retorna 3 planos (público)
3. `POST /api/auth/login` → gera token JWT
4. `GET /api/pets` com token → retorna pets
5. `GET /api/pets` sem token → 401

**Momento impactante:** "Tudo isso gerado pela IA. Endpoints, validação, segurança, documentação — tudo funcional."

---

## Passo 7 — Destruir Infra (~2 min)

> Colar o **Passo 7** do `02-prompts.md` no Kiro

```bash
cd infra/terraform && terraform destroy -auto-approve
```

**Confirmar:** todos os recursos removidos, zero custo residual.

---

## Encerramento (~3 min)

### Recap:

1. ✅ Diagrama de arquitetura gerado pela IA
2. ✅ Custos estimados com preços reais
3. ✅ Infra provisionada na AWS via Terraform (e destruída)
4. ✅ Épico quebrado em histórias automaticamente
5. ✅ Backend completo implementado por IA
6. ✅ Endpoints funcionais com Swagger
7. ✅ PRs abertas no GitHub (uma por card)
8. ✅ Tudo sem escrever código manualmente

### Gancho para Semana 3:

> "Temos o backend em Spring Boot 3.5. Semana que vem: migração para Spring Boot 4.0, breaking changes, conectar frontend ↔ backend end-to-end."
