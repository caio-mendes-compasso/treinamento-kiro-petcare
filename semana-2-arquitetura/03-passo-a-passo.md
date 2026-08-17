# Passo a Passo — Semana 2: Arquitetura AWS + Backend Spring Boot 3.5

> Guia sequencial para o facilitador seguir durante o treinamento.

---

## Preparação (antes do treinamento)

- [ ] Java 17+ instalado e no PATH (`java -version`)
- [ ] Maven instalado (`mvn -version`)
- [ ] Docker rodando (`docker ps`)
- [ ] AWS CLI configurada (`aws sts get-caller-identity`)
- [ ] Repo com frontend da Semana 1 clonado
- [ ] Kiro IDE/CLI pronto

---

## Etapa 1: Contexto + Arquitetura (15 min)

### 1.1 Recap (2 min)

> "Semana passada entregamos o frontend. Hoje vamos definir a arquitetura AWS e já criar o backend Spring Boot 3.5."

### 1.2 Discussão rápida com o time (3 min)

Perguntar:
1. **"Container ou Serverless pro backend?"** (ECS Fargate vs Lambda)
2. **"SQL ou NoSQL?"** (RDS PostgreSQL vs DynamoDB)
3. **"Frontend hosting?"** (Amplify vs S3 + CloudFront)

> Anotar decisões.

### 1.3 Gerar diagrama com Kiro (5 min)

> Usar prompt **"Gerar diagrama inicial"** do arquivo `02-prompts.md`
> (adaptar conforme decisões do time)

**Pontos a validar:**
- Todos os componentes presentes?
- Fluxo de dados faz sentido?
- Segurança adequada?

### 1.4 Precificação rápida (5 min)

> Usar prompt **2.2 "Precificação AWS"** do arquivo `02-prompts.md`

**Discussão:**
- "Custo aceitável?"
- "O que entra no free tier?"
- "NAT Gateway ($32/mês) vale a pena?"

> Salvar diagrama e custos: serão incluídos na PR.

---

## Etapa 1.5: Infraestrutura como Código — Terraform (10 min)

### 1.5.1 Gerar código Terraform (5 min)

> Usar prompt **2.3 "Infraestrutura como Código"** do arquivo `02-prompts.md`

**Pontos a validar:**
- Módulos cobrem todos os serviços do diagrama?
- Variáveis permitem mudar entre dev/prod?
- Security Groups restritivos?

### 1.5.2 Aplicar na AWS (5 min)

```bash
cd infra/terraform
terraform init
terraform plan -out=tfplan
```

> Mostrar o plan pro time. Discutir: "Quantos recursos? Tudo correto?"

```bash
terraform apply tfplan
```

> Mostrar os outputs (RDS endpoint, S3 bucket, Cognito pool ID, etc.)

### 1.5.3 Mostrar no Console AWS (2 min)

> Abrir o console AWS no browser e mostrar os recursos criados:
> - **VPC** → mostrar subnets, security groups
> - **RDS** → mostrar instância PostgreSQL criada
> - **ECS** → mostrar cluster (vazio por enquanto, task será deployada depois)
> - **S3** → mostrar buckets criados (fotos + frontend)
> - **Cognito** → mostrar User Pool criado
>
> Prompt:
```
Liste os recursos criados pelo Terraform na conta AWS. Use AWS CLI para confirmar:
- aws ec2 describe-vpcs --profile petcare --query "Vpcs[?Tags[?Key=='Project' && Value=='petcare']].[VpcId,CidrBlock]" --output table
- aws rds describe-db-instances --profile petcare --query "DBInstances[*].[DBInstanceIdentifier,Endpoint.Address,DBInstanceStatus]" --output table
- aws s3 ls --profile petcare | grep petcare
- aws cognito-idp list-user-pools --profile petcare --max-results 10 --query "UserPools[*].[Name,Id]" --output table
```

**⚠️ Importante:** Lembrar de destruir no final do treinamento:
```bash
terraform destroy -auto-approve
```

---

## Etapa 2: Setup Backend Spring Boot 3.5 (5 min)

### 2.1 Criar branch

```bash
git checkout main && git pull
git checkout -b feat/backend-spring35
```

### 2.2 Criar projeto com Kiro

> Usar prompt **"Criar projeto"** (seção 3) do arquivo `02-prompts.md`

### 2.3 Subir dependências

```bash
cd backend
docker-compose up -d   # PostgreSQL + LocalStack
```

### 2.4 Validar

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Verificar: `http://localhost:8080/swagger-ui/index.html`

---

## Etapa 3: Spec + Modelagem (5 min)

### 3.1 Criar Spec no Kiro

> Usar prompt **"Spec completa"** (seção 4) do arquivo `02-prompts.md`

### 3.2 Revisar com o time

- Entidades e relacionamentos ok?
- Regras de negócio completas?
- Falta endpoint que o frontend precisa?

### 3.3 Aprovar spec

---

## Etapa 4: Desenvolvimento (25 min)

### 4.1 Entidades + Banco (5 min)

> Usar prompt **5.1** do arquivo `02-prompts.md`

**Validação:**
```bash
docker exec -it petcare-db psql -U petcare -c "\dt"
```

Tabelas devem aparecer.

---

### 4.2 Repositories + DTOs (3 min)

> Usar prompt **5.2** do arquivo `02-prompts.md`

---

### 4.3 Services (7 min)

> Usar prompt **5.3** do arquivo `02-prompts.md`

**Momento complexo:**
> "A lógica de slots da agenda: o Kiro verificou conflito de horário? E race condition com requests simultâneos?"

---

### 4.4 Controllers (5 min)

> Usar prompt **5.4** do arquivo `02-prompts.md`

**Validação:** Abrir Swagger, testar GET /api/plans.

---

### 4.5 Security + S3 (5 min)

> Usar prompts **5.5** e **5.6** do arquivo `02-prompts.md`

**Validação:**
```bash
# Sem token → 401
curl http://localhost:8080/api/pets

# Com token local → 200
curl -H "Authorization: Bearer test-token" http://localhost:8080/api/pets
```

**Momento complexo:**
> "Security é onde mais acontecem erros. CORS, token expirado, claims errados... Mostrem como debugar com Kiro."

---

### 4.6 Exception Handling + Docker (2 min)

> Usar prompts **5.7** e **5.8** do arquivo `02-prompts.md`

---

## Etapa 5: Testes (5 min)

### 5.0 Mostrar o backend rodando (2 min)

> Antes dos testes unitários, mostrar o backend funcionando ao vivo:

```bash
# Subir dependências
docker-compose up -d

# Rodar o backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

> Abrir no browser: http://localhost:8080/swagger-ui/index.html
> Mostrar:
> - Lista de endpoints no Swagger
> - GET /api/plans → retorna os 3 planos
> - POST /api/auth/login → gera token
> - GET /api/pets com token → retorna pets do user de teste
> - POST /api/pets sem token → 401
>
> **Momento impactante:** "Tudo isso foi gerado pela IA em minutos. Cada endpoint funcional, com validação, segurança e documentação."

### 5.1 Gerar testes

> Usar prompt de **"Testes"** (seção 6) do arquivo `02-prompts.md`

### 5.2 Rodar

```bash
mvn test
```

**Se falhar:** copiar erro, colar no Kiro para corrigir.

---

## Etapa 6: Commit + PR (5 min)

### 6.1 Build final

```bash
mvn verify
```

### 6.2 Commit

```bash
git add .
```

> Usar prompt de **"Commit"** (seção 7) do arquivo `02-prompts.md`

### 6.3 Push + PR

```bash
git push -u origin feat/backend-spring35
```

> Usar prompt de **"PR"** (seção 7) do arquivo `02-prompts.md`

---

## Encerramento

### Destruir infraestrutura AWS (evitar custos):

```bash
cd infra/terraform
terraform destroy -auto-approve
```

> Confirmar que todos os recursos foram removidos.

### Recapitular:

1. ✅ Arquitetura AWS definida (diagrama + custos)
2. ✅ Infraestrutura provisionada via Terraform
3. ✅ Backend Spring Boot 3.5 completo
4. ✅ Endpoints REST funcionais
5. ✅ Security com Cognito JWT
6. ✅ Upload S3
7. ✅ Docker para dev local
8. ✅ Testes unitários
9. ✅ PRs abertas (uma por card)
10. ✅ Infra destruída (sem custos residuais)

### Gancho para Semana 3:

> "Temos o backend rodando em Spring Boot 3.5. Semana que vem: vamos migrar para Spring Boot 4.0, lidar com breaking changes, conectar frontend ↔ backend e ver tudo funcionando end-to-end."
