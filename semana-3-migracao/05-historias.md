# Histórias de Usuário — Semana 3: Migração Spring Boot 4.0 + Projeto Funcionando

> Cards prontos para criar no Trello. Cada seção = 1 card.
> Copie título, descrição e checklist diretamente para o Trello.
>
> **Board:** Pet Care Portal
> **Lista:** Sprint 3 - Migração + Integração
> **Labels:** 🟤 Migração | 🟢 Frontend | 🔴 Backend | 🔵 Setup

---

## Card 1

**Título:** [MIGRATION] Análise de impacto — Spring Boot 3.5 → 4.0

**Label:** 🟤 Migração

**Descrição:**
Como time de desenvolvimento, queremos analisar todas as breaking changes do Spring Boot 4.0 que impactam nosso projeto para planejar a migração com segurança.

**Critérios de Aceite:**
- [ ] Lista completa de breaking changes que afetam o Pet Care
- [ ] Classificação por tipo: erro de compilação, erro em runtime, mudança silenciosa
- [ ] Priorização: resolver primeiro o que impede build, depois runtime, depois silencioso
- [ ] Identificação dos arquivos impactados
- [ ] Plano de migração documentado em `/docs/migration-spring4.md`

**Breaking changes esperadas:**
- Jackson 2 → Jackson 3 (pacotes, annotations)
- Spring Security 7 (lambda DSL obrigatório)
- Starters renomeados/modularizados
- @MockBean → @MockitoBean
- @SpringBootTest sem auto-config MockMvc
- APIs deprecated no 3.x removidas
- Properties renomeadas

---

## Card 2

**Título:** [MIGRATION] Atualizar pom.xml para Spring Boot 4.0

**Label:** 🟤 Migração

**Descrição:**
Como desenvolvedor, quero atualizar as dependências do projeto para Spring Boot 4.0 para usufruir das melhorias e manter o projeto no LTS suportado.

**Critérios de Aceite:**
- [ ] spring-boot-starter-parent atualizado para 4.0.x
- [ ] Starters renomeados ajustados (verificar novos nomes)
- [ ] Dependências third-party compatíveis com Boot 4
- [ ] spring-boot-properties-migrator adicionado (temporário, para diagnóstico)
- [ ] Todas as dependências resolvem sem conflito no Maven
- [ ] `mvn compile` passa (pode falhar por código — próximos cards resolvem)

**Atenção:**
- Verificar se AWS SDK v2 é compatível com Boot 4
- Verificar se SpringDoc OpenAPI tem versão compatível
- Starters que não existiam antes podem precisar ser adicionados explicitamente

---

## Card 3

**Título:** [MIGRATION] Migrar Jackson 2 → Jackson 3

**Label:** 🟤 Migração

**Descrição:**
Como desenvolvedor, quero migrar de Jackson 2 para Jackson 3 (default no Spring Boot 4.0) para que a serialização JSON funcione corretamente.

**Critérios de Aceite:**
- [ ] Imports migrados: `com.fasterxml.jackson.*` → `tools.jackson.*`
- [ ] Todas as annotations (@JsonProperty, @JsonIgnore, @JsonFormat, etc) no novo pacote
- [ ] @JsonManagedReference/@JsonBackReference revisados (verificar se existem em Jackson 3 ou usar alternativa)
- [ ] Serialização de LocalDate/LocalDateTime no formato esperado pelo frontend (YYYY-MM-DD)
- [ ] Serialização de enums consistente (name() ou value customizado)
- [ ] Null handling mantido como antes
- [ ] Endpoints testados via Swagger — JSON idêntico ao anterior
- [ ] Nenhum import `com.fasterxml` restante no projeto

**Formato esperado pelo frontend:**
```json
{
  "date": "2025-03-15",
  "time": "10:00",
  "status": "CONFIRMED",
  "amount": 89.90
}
```

---

## Card 4

**Título:** [MIGRATION] Migrar Spring Security 7 — Lambda DSL

**Label:** 🟤 Migração

**Descrição:**
Como desenvolvedor, quero migrar o SecurityConfig para o Spring Security 7 (lambda DSL obrigatório) para que a segurança continue funcionando no Boot 4.

**Critérios de Aceite:**
- [ ] Method chaining removido do SecurityConfig
- [ ] Toda configuração usando lambda DSL:
  - `.csrf(csrf -> csrf.disable())`
  - `.sessionManagement(session -> session.sessionCreationPolicy(STATELESS))`
  - `.authorizeHttpRequests(auth -> auth.requestMatchers(...).permitAll()...)`
- [ ] CORS continua funcionando para localhost:3000
- [ ] JWT filter continua na chain correta
- [ ] Endpoints públicos permanecem públicos (auth, plans, swagger)
- [ ] Endpoints protegidos continuam retornando 401 sem token
- [ ] Nenhum método deprecated do Security 6 em uso

**Teste de validação:**
```bash
# Público → 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/plans

# Protegido sem token → 401
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/pets

# Protegido com token → 200
curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer test-token" http://localhost:8080/api/pets
```

---

## Card 5

**Título:** [MIGRATION] Migrar Testes — @MockitoBean + MockMvc

**Label:** 🟤 Migração

**Descrição:**
Como desenvolvedor, quero migrar os testes para as novas APIs do Spring Boot 4.0 para que todos passem na nova versão.

**Critérios de Aceite:**
- [ ] @MockBean → @MockitoBean em todos os testes
- [ ] @SpyBean → @SpyitoBean (se usado)
- [ ] @AutoConfigureMockMvc adicionado nos testes de integração que usam MockMvc
- [ ] Import correto: `org.springframework.test.context.bean.override.mockito.MockitoBean`
- [ ] Assertions de JSON atualizadas (Jackson 3 pode alterar formato de output)
- [ ] Todos os testes passando: `mvn test`
- [ ] Nenhum import de `org.springframework.boot.test.mock.mockito` (pacote antigo)

**Mudanças:**
```java
// ANTES
import org.springframework.boot.test.mock.mockito.MockBean;
@MockBean private PetRepository petRepository;

// DEPOIS
import org.springframework.test.context.bean.override.mockito.MockitoBean;
@MockitoBean private PetRepository petRepository;
```

```java
// ANTES
@SpringBootTest
class PetControllerTest {

// DEPOIS
@SpringBootTest
@AutoConfigureMockMvc
class PetControllerTest {
```

---

## Card 6

**Título:** [MIGRATION] Ajustar Properties + Remover Migrator

**Label:** 🟤 Migração

**Descrição:**
Como desenvolvedor, quero ajustar as properties renomeadas no Spring Boot 4.0 e remover o módulo de diagnóstico temporário.

**Critérios de Aceite:**
- [ ] Rodar aplicação com properties-migrator e verificar logs de warning
- [ ] Atualizar properties renomeadas no application.yml (todos os profiles)
- [ ] Nenhum warning de property deprecated no startup
- [ ] Remover spring-boot-properties-migrator do pom.xml
- [ ] Aplicação inicia sem erros em profile local
- [ ] Swagger carrega corretamente

---

## Card 7

**Título:** [FEAT] Habilitar Virtual Threads

**Label:** 🔴 Backend

**Descrição:**
Como time de desenvolvimento, queremos habilitar virtual threads (disponível no Boot 4.0) para melhorar o throughput da API em operações de I/O.

**Critérios de Aceite:**
- [ ] Adicionar `spring.threads.virtual.enabled: true` no application.yml
- [ ] Aplicação sobe sem erros
- [ ] Verificar se há synchronized blocks que causam pinning
- [ ] Testar endpoints que fazem I/O (banco, S3) — devem funcionar normalmente
- [ ] Adicionar flag de diagnóstico em local: `-Djdk.tracePinnedThreads=short`
- [ ] Nenhum pinning warning nos logs durante testes
- [ ] Documentar decisão no PR

**Opcional (se Java 21+):**
- [ ] Atualizar Java de 17 para 21 no Dockerfile para melhor suporte a virtual threads

---

## Card 8

**Título:** [FEAT] Service Layer no Frontend — Consumir API Real

**Label:** 🟢 Frontend

**Descrição:**
Como desenvolvedor frontend, quero criar a camada de serviço para consumir a API real do backend ao invés dos mocks.

**Critérios de Aceite:**
- [ ] Criar `/frontend/src/services/api.ts` com configuração base:
  - baseURL via NEXT_PUBLIC_API_URL (default: http://localhost:8080/api)
  - Interceptor: adicionar JWT no header Authorization
  - Interceptor: tratar erros (401 → redirect login, 422 → extrair message)
- [ ] Criar services por domínio:
  - `authService.ts`: login, register, refresh
  - `petService.ts`: list, create, update, delete, uploadPhoto
  - `appointmentService.ts`: list, create, cancel, getSlots
  - `invoiceService.ts`: list, pay
  - `planService.ts`: list
  - `userService.ts`: getMe, updateMe
- [ ] Cada service exporta funções tipadas (TypeScript)
- [ ] Tratamento de loading state em cada chamada
- [ ] Variável de ambiente NEXT_PUBLIC_API_URL configurada no .env.local

---

## Card 9

**Título:** [FEAT] Integrar AuthContext com Backend Real

**Label:** 🟢 Frontend

**Descrição:**
Como usuário, quero que o login funcione de verdade consumindo a API do backend para autenticar.

**Critérios de Aceite:**
- [ ] AuthContext.login() chama POST /api/auth/login
- [ ] Armazena access_token e refresh_token no localStorage
- [ ] AuthContext.logout() limpa tokens e redireciona para /login
- [ ] Token enviado em todas as chamadas autenticadas (header Authorization: Bearer)
- [ ] Se 401 retornado: tenta refresh, se falhar → logout
- [ ] Dados do user vêm de GET /api/users/me (não mais mock)
- [ ] Loading state durante autenticação
- [ ] Erro de credencial mostra mensagem amigável

---

## Card 10

**Título:** [FEAT] Integrar Páginas com API Real

**Label:** 🟢 Frontend

**Descrição:**
Como usuário, quero que todas as páginas do portal mostrem dados reais vindos do backend.

**Critérios de Aceite:**
- [ ] **Meus Pets:** GET /api/pets → listagem real; POST /api/pets → cadastro real; POST /api/pets/{id}/photo → upload real
- [ ] **Agenda:** GET /api/appointments/slots?date=X → slots reais; POST /api/appointments → agendamento real; DELETE → cancelamento real
- [ ] **Financeiro:** GET /api/invoices → faturas reais; POST /api/invoices/{id}/pay → pagamento real
- [ ] **Carteirinha:** dados de GET /api/users/me + GET /api/pets
- [ ] **Planos:** GET /api/plans → planos reais (público)
- [ ] Loading states em todas as páginas durante fetch
- [ ] Mensagens de erro da API exibidas no frontend (toasts ou alerts)
- [ ] Empty states quando não há dados (ex: nenhum pet cadastrado)

---

## Card 11

**Título:** [FEAT] Docker Compose Full Stack

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero subir o projeto inteiro (frontend + backend + banco) com um único comando para facilitar demo e desenvolvimento.

**Critérios de Aceite:**
- [ ] docker-compose.yml na raiz do monorepo com:
  - PostgreSQL 15 (porta 5432)
  - LocalStack (S3 mock, porta 4566)
  - Backend Java (porta 8080, profile local)
  - Frontend Next.js (porta 3000, NEXT_PUBLIC_API_URL=http://backend:8080/api)
- [ ] Script `init-localstack.sh` cria bucket
- [ ] `docker-compose up` sobe tudo sem erro
- [ ] Frontend acessível em http://localhost:3000
- [ ] Backend acessível em http://localhost:8080
- [ ] Swagger em http://localhost:8080/swagger-ui/index.html
- [ ] Dados iniciais carregados no banco

---

## Card 12

**Título:** [DEMO] Validação End-to-End do Projeto

**Label:** 🔵 Setup

**Descrição:**
Como time, queremos validar que o projeto funciona end-to-end: frontend consumindo backend real com dados no banco.

**Critérios de Aceite:**
- [ ] Fluxo visitante: Home → ver planos → navegar
- [ ] Fluxo login: /login → credenciais → redirect para área logada
- [ ] Fluxo pet: cadastrar animal → upload foto → ver na listagem → ver na carteirinha
- [ ] Fluxo agenda: selecionar dia → escolher slot → confirmar → ver na lista de agendamentos
- [ ] Fluxo financeiro: ver faturas → filtrar por status → simular pagamento → status atualiza
- [ ] Fluxo carteirinha: ver dados do plano + pet + QR code + flip
- [ ] Nenhum erro no console (browser)
- [ ] Nenhum erro 500 não tratado no backend
- [ ] Swagger documenta todos os endpoints corretamente
- [ ] Responsivo: testar em mobile (DevTools)

---

## Card 13

**Título:** [CHORE] Pull Request Final — Migração + Integração

**Label:** 🔵 Setup

**Descrição:**
Como desenvolvedor, quero abrir a PR final com a migração Spring Boot 4.0 e integração end-to-end completa.

**Critérios de Aceite:**
- [ ] Branch: `feat/spring-boot-4-migration`
- [ ] Commit seguindo conventional commits: `feat(migration): ...`
- [ ] Backend build sem erros (`mvn verify`)
- [ ] Frontend build sem erros (`npm run build`)
- [ ] Todos os testes passando (backend + frontend)
- [ ] PR aberta no GitHub com:
  - Lista de breaking changes do Spring Boot 4.0 resolvidos
  - O que é novo no 4.0 que aproveitamos (virtual threads, etc)
  - Instruções para rodar o projeto completo (docker-compose up)
  - Fluxo de demonstração passo a passo
  - Screenshots ou GIFs (opcional)
  - Notas sobre diferenças de comportamento 4.0 vs 3.5
