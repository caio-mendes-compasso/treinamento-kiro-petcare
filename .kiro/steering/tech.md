# Stack Tecnológica

## Frontend

- **Framework**: Next.js 14+ com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado global**: Context API (auth + dados do usuário)
- **Validação**: Zod
- **Testes**: React Testing Library + Jest (ou Vitest)
- **Node.js**: 18+

## Backend

- **Framework**: Spring Boot 3.5 (com migração para 4.0 na semana 3)
- **Linguagem**: Java 17+
- **Build**: Maven
- **Banco de dados**: PostgreSQL 15 (via RDS em produção)
- **ORM**: Spring Data JPA / Hibernate
- **Autenticação**: Spring Security + AWS Cognito (JWT)
- **Armazenamento**: AWS S3 SDK v2
- **Documentação**: SpringDoc OpenAPI (Swagger UI)
- **Testes**: JUnit 5 + Mockito
- **Container**: Docker + docker-compose

## Cloud (AWS)

- Amplify ou S3 + CloudFront (frontend)
- ECS Fargate ou Lambda (backend)
- RDS PostgreSQL (banco)
- Cognito (autenticação)
- S3 (fotos)
- SQS (mensageria/agendamentos)
- CloudWatch (monitoramento)
- Route 53 (DNS)

## Comandos Comuns

### Frontend

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar testes
npm test
```

### Backend

```bash
# Subir infraestrutura local
docker-compose up -d

# Build do projeto
mvn clean package

# Rodar com profile local
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Rodar testes
mvn test
```

## Convenções

- Commits seguem Conventional Commits: `feat(escopo): mensagem`, `fix(escopo): mensagem`
- Branches por feature/semana
- PRs com título conciso e descrição detalhada (resumo, como rodar, checklist)
