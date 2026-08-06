# Passo a Passo — Semana 3: Migração Spring Boot 4.0 + Projeto Funcionando

> Guia sequencial para o facilitador seguir durante o treinamento.

---

## Preparação (antes do treinamento)

- [ ] Backend da Semana 2 funcionando (Spring Boot 3.5, testes passando)
- [ ] Frontend da Semana 1 rodando
- [ ] Docker rodando
- [ ] Java 17+ (idealmente 21 para demo de virtual threads)
- [ ] Kiro IDE/CLI pronto

---

## Etapa 1: Contexto — O que muda no Spring Boot 4.0 (5 min)

### 1.1 Recap

> "Semana 1: frontend. Semana 2: arquitetura + backend Spring Boot 3.5. Hoje: migramos para 4.0 e fazemos tudo funcionar junto."

### 1.2 Explicar as breaking changes

Apresentar rapidamente (pode usar os slides do `01-visao-geral.md`):

1. **Jackson 3** — novo pacote, annotations mudam
2. **Spring Security 7** — só lambda DSL
3. **Starters renomeados** — módulos menores
4. **@MockBean removido** — agora é @MockitoBean
5. **@SpringBootTest** — não traz MockMvc automaticamente

> "São ~115 breaking changes no total, mas para o nosso projeto vamos enfrentar cerca de 5-6 categorias principais. Vamos ver como o Kiro nos ajuda a resolver."

### 1.3 Criar branch

```bash
git checkout main && git pull
git checkout -b feat/spring-boot-4-migration
```

---

## Etapa 2: Migração — pom.xml + Módulos (5 min)

### 2.1 Analisar impacto com Kiro

> Usar prompt **"Analisar o que precisa mudar"** (seção 1) do arquivo `02-prompts.md`

**Momento de discussão:**
> "Vejam como o Kiro consegue analisar o projeto e prever os problemas antes de mudarmos qualquer coisa. Isso evita surpresas."

### 2.2 Atualizar pom.xml

> Usar prompt **"Atualizar dependências"** (seção 2) do arquivo `02-prompts.md`

### 2.3 Tentar compilar

```bash
mvn compile
```

> **Esperado:** Vários erros de compilação. É normal! Vamos resolver um por um.

**Momento complexo:**
> "O primeiro build quebra. Isso é esperado numa major version. Mas olhem: o Kiro já nos disse quais seriam os problemas. Agora vamos resolver."

---

## Etapa 3: Jackson 3 (10 min)

### 3.1 Migrar Jackson

> Usar prompt **"Ajustar serialização JSON"** (seção 3) do arquivo `02-prompts.md`

### 3.2 Verificar imports

**O que muda:**
```java
// ANTES (Jackson 2)
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;

// DEPOIS (Jackson 3)
import tools.jackson.annotation.JsonProperty;
import tools.jackson.annotation.JsonIgnore;
import tools.jackson.databind.ObjectMapper;
```

### 3.3 Verificar serialização

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
curl http://localhost:8080/api/plans
```

> Comparar output JSON com o esperado. Datas, enums, nulls podem vir diferentes.

**Momento complexo:**
> "Jackson 3 muda o default de serialização de datas. Se o frontend espera '2025-03-15' e agora vem '2025-03-15T00:00:00', temos um problema. Como resolver?"

---

## Etapa 4: Spring Security 7 (5 min)

### 4.1 Reescrever SecurityConfig

> Usar prompt **"Reescrever SecurityConfig"** (seção 4) do arquivo `02-prompts.md`

### 4.2 Exemplo da mudança

```java
// ANTES (3.5) - method chaining
http
    .csrf().disable()
    .sessionManagement().sessionCreationPolicy(STATELESS)
    .and()
    .authorizeHttpRequests()
        .requestMatchers("/api/auth/**").permitAll()
        .anyRequest().authenticated();

// DEPOIS (4.0) - lambda DSL obrigatório
http
    .csrf(csrf -> csrf.disable())
    .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
    .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .anyRequest().authenticated()
    );
```

### 4.3 Validar security

```bash
# Sem token → 401
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/pets

# Com token → 200
curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer test-token" http://localhost:8080/api/pets
```

---

## Etapa 5: Testes (5 min)

### 5.1 Migrar testes

> Usar prompt **"Ajustar testes para Boot 4"** (seção 5) do arquivo `02-prompts.md`

### 5.2 Mudanças principais

```java
// ANTES
@MockBean
private PetRepository petRepository;

// DEPOIS
@MockitoBean
private PetRepository petRepository;
```

```java
// ANTES - MockMvc vinha automaticamente
@SpringBootTest
class PetControllerTest {
    @Autowired MockMvc mockMvc;

// DEPOIS - precisa declarar explicitamente
@SpringBootTest
@AutoConfigureMockMvc
class PetControllerTest {
    @Autowired MockMvc mockMvc;
```

### 5.3 Rodar testes

```bash
mvn test
```

> Se alguns falharem, copiar erros e usar Kiro para corrigir.

**Momento complexo:**
> "Testes que passavam no 3.5 e falham no 4.0 sem mudança de código — é a mudança mais perigosa porque é silenciosa. Jackson 3 muda o JSON output, e assertions de string matching quebram."

---

## Etapa 6: Properties + Virtual Threads (5 min)

### 6.1 Verificar properties

> Usar prompt **"Ajustar application.yml"** (seção 6) do arquivo `02-prompts.md`

### 6.2 Habilitar virtual threads (oportunidade)

> Usar prompt **"Habilitar virtual threads"** (seção 7) do arquivo `02-prompts.md`

```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true
```

> "Virtual threads são uma das grandes vantagens de estar no Spring Boot 4.0. Para uma API como a nossa que faz I/O (banco, S3), isso melhora throughput sem custo de complexidade."

### 6.3 Build completo

```bash
mvn verify
```

✅ Se tudo passa: migração concluída!

---

## Etapa 7: Integração Frontend ↔ Backend (15 min)

### 7.1 Conectar frontend

> Usar prompt **"Conectar frontend ao backend real"** (seção 8) do arquivo `02-prompts.md`

### 7.2 Subir ambiente completo

```bash
# Terminal 1: infra
docker-compose up -d

# Terminal 2: backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 3: frontend
cd frontend
npm run dev
```

### 7.3 Testar fluxo completo

1. Abrir http://localhost:3000
2. Home → ver planos
3. Login com credenciais de teste
4. Cadastrar pet → aparece na listagem
5. Agendar consulta → aparece no calendário
6. Ver faturas → simular pagamento
7. Ver carteirinha → dados vindos da API

### 7.4 Resolver problemas (ao vivo)

> Se algo não funcionar: copiar erro e usar prompts da seção 11 do `02-prompts.md`

**Momento complexo:**
> "A integração é onde tudo se encontra. CORS, formato de dados, token... Se algo der errado aqui, é problema de contrato entre frontend e backend. Mostrem como o Kiro ajuda a debugar."

---

## Etapa 8: Demo Final (5 min)

### 8.1 Apresentar o projeto

Fazer o fluxo completo como usuário:

1. **Visitante:** Home → ver planos → contratar plano
2. **Login:** autenticar → entrar na área logada
3. **Tutor:** cadastrar pet → upload foto → ver carteirinha
4. **Agendamento:** escolher dia → selecionar slot → confirmar
5. **Financeiro:** ver faturas → pagar boleto

### 8.2 Mostrar Swagger

Abrir http://localhost:8080/swagger-ui/index.html e mostrar a documentação auto-gerada.

---

## Etapa 9: Commit + PR Final (5 min)

### 9.1 Commit

```bash
git add .
```

> Usar prompt **"Commit da migração"** (seção 10) do arquivo `02-prompts.md`

### 9.2 Push + PR

```bash
git push -u origin feat/spring-boot-4-migration
```

> Usar prompt **"PR final"** (seção 10) do arquivo `02-prompts.md`

---

## Encerramento do Treinamento

### Recapitular as 3 semanas:

| Semana | Entrega | Stack |
|---|---|---|
| 1 | Frontend completo (7 páginas, auth, testes, PR) | Next.js + TypeScript |
| 2 | Arquitetura AWS + Backend completo (PR) | Spring Boot 3.5 + PostgreSQL |
| 3 | Migração + Integração + Demo end-to-end (PR) | Spring Boot 4.0 + Frontend conectado |

### O que o time aprendeu:

1. ✅ Fluxo completo com Kiro: história → spec → dev → testes → PR
2. ✅ Desenvolvimento frontend guiado por prompts
3. ✅ Desenho e precificação de arquitetura AWS
4. ✅ Backend Java com Spring Boot (criação e migração)
5. ✅ Lidar com breaking changes de major version usando IA
6. ✅ Integração end-to-end de um projeto real

### Mensagem final:

> "Em 3 horas de prática construímos um projeto fullstack completo, migramos de major version e integramos tudo — usando Kiro como copiloto. O Kiro não substitui o dev sênior; ele acelera quem já sabe o que está fazendo."
