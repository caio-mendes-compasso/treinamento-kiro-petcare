# Prompts — Semana 3: Migração Spring Boot 4.0 + Projeto Funcionando

> Prompts prontos para copiar e colar no Kiro durante o treinamento.

---

## 1. Análise de Impacto

### Analisar o que precisa mudar

```
Analise o projeto backend Pet Care (Spring Boot 3.5) e liste todas as mudanças necessárias para migrar para Spring Boot 4.0.

Considere:
1. Mudanças no pom.xml (parent version, starters renomeados, novos módulos necessários)
2. Jackson 3 (nova default) - annotations que mudam, pacotes que mudam
3. Spring Security 7 - mudanças na configuração (lambda DSL obrigatório, method chaining removido)
4. APIs deprecated no 3.x que foram removidas no 4.0
5. Testes - @MockBean/@SpyBean removidos, @SpringBootTest mudanças
6. Properties renomeadas no application.yml

Para cada mudança, diga:
- O que estava antes (3.5)
- O que precisa ficar agora (4.0)
- Risco se não ajustar (erro de compilação, runtime, ou silencioso)

Organize por prioridade: primeiro o que impede compilação, depois runtime, depois silencioso.
```

---

## 2. Migração do pom.xml

### Atualizar dependências

```
Migre o pom.xml do Pet Care de Spring Boot 3.5 para 4.0:

1. Alterar spring-boot-starter-parent para 4.0.x
2. Verificar e atualizar starters renomeados:
   - Se usamos dependências que agora precisam de starter explícito (ex: Flyway, Liquibase)
   - Novos módulos necessários
3. Jackson: verificar se precisamos da dependência de compatibilidade spring-boot-jackson2 (stop-gap) ou migrar direto para Jackson 3
4. Garantir compatibilidade de todas as dependências third-party com Boot 4
5. Adicionar spring-boot-properties-migrator como dependência runtime (temporária, para diagnóstico)

Mantenha Java 17 como target.
Se alguma dependência não tem versão compatível com Boot 4, sugira alternativa.
```

---

## 3. Migração Jackson 2 → Jackson 3

### Ajustar serialização JSON

```
Migre o projeto do Jackson 2 para Jackson 3 (default no Spring Boot 4.0):

Mudanças necessárias:
1. Pacotes: com.fasterxml.jackson.* → tools.jackson.* (imports)
2. Annotations que mudam de nome ou pacote:
   - @JsonProperty, @JsonIgnore, @JsonFormat etc. agora em tools.jackson.annotations
   - @JsonManagedReference/@JsonBackReference → verificar se ainda existem ou têm substituto
3. Comportamento de serialização diferente:
   - Datas (LocalDate, LocalDateTime) - formato default pode mudar
   - Enum serialization
   - Null handling
4. ObjectMapper customizações no projeto (se houver)
5. DTOs que usam annotations Jackson

Para cada arquivo que precisa mudar:
- Mostre o import antigo e o novo
- Se o comportamento de serialização mudou, ajuste a configuração

Se preferir a abordagem gradual: usar spring-boot-jackson2 como bridge temporária e explique como remover depois.
```

---

## 4. Migração Spring Security 7

### Reescrever SecurityConfig

```
Migre o SecurityConfig do Pet Care para Spring Security 7 (Spring Boot 4.0):

Mudanças obrigatórias:
1. Method chaining removido - APENAS lambda DSL funciona agora
2. Defaults que mudaram:
   - CSRF pode ter comportamento diferente
   - Session management defaults diferentes
3. Deprecated APIs removidas - verificar se usamos alguma

O SecurityConfig atual faz:
- Endpoints públicos: /api/auth/**, /api/plans, /swagger-ui/**, /v3/api-docs/**
- Todos outros requerem JWT
- CORS habilitado
- CSRF desabilitado
- Session STATELESS
- JwtAuthenticationFilter customizado

Reescreva usando APENAS lambda DSL do Spring Security 7.
Garanta que o comportamento permanece idêntico ao 3.5.
Se algum método foi removido, use o equivalente do Security 7.
```

---

## 5. Migração dos Testes

### Ajustar testes para Boot 4

```
Migre os testes do Pet Care para Spring Boot 4.0:

Mudanças necessárias:
1. @MockBean → @MockitoBean (spring-boot-test agora usa nova annotation)
2. @SpyBean → @SpyitoBean (se usarmos)
3. @SpringBootTest não auto-configura mais MockMvc:
   - Adicionar @AutoConfigureMockMvc explicitamente
   - Ou usar @WebMvcTest para testes de controller isolados
4. Se usamos TestRestTemplate, verificar se precisa de configuração adicional
5. Jackson 3 nos testes - assertions que verificam JSON serializado podem quebrar:
   - Formato de datas diferente
   - Ordem de campos diferente
   - Null handling diferente

Para cada teste que quebra:
- Mostre o que estava antes
- Mostre o que precisa ficar
- Explique por que quebrou
```

---

## 6. Properties Migration

### Ajustar application.yml

```
Verifique e atualize o application.yml do Pet Care para Spring Boot 4.0:

1. Adicione temporariamente spring-boot-properties-migrator e rode a aplicação
2. Verifique no log quais properties foram renomeadas ou removidas
3. Atualize as properties conforme o novo nome
4. Verifique se algum comportamento default mudou que precisamos explicitar

Properties que tipicamente mudam:
- spring.datasource.* → verificar
- spring.jpa.* → verificar
- server.* → verificar
- spring.security.* → verificar
- management.* (actuator) → verificar

Após ajustar tudo, remova o properties-migrator.
```

---

## 7. Oportunidades do Spring Boot 4.0

### Habilitar virtual threads

```
Agora que estamos no Spring Boot 4.0, habilite virtual threads:

1. Adicionar no application.yml:
   spring.threads.virtual.enabled: true

2. Verificar se há algum código que usa ThreadLocal que pode ter problemas com pinning
3. Verificar se Hibernate/JPA funciona bem com virtual threads
4. Fazer teste de carga simples para comparar performance

Explique:
- O que são virtual threads
- Por que ajudam em APIs com I/O (banco, S3, HTTP calls)
- Cuidados (pinning, synchronized blocks)
```

### Usar HTTP Service Clients (novo recurso)

```
O Spring Boot 4.0 trouxe HTTP Service Clients (interfaces anotadas com @HttpExchange).
Se o backend do Pet Care precisar chamar algum serviço externo no futuro, mostre como seria:

Crie um exemplo de client para um serviço fictício de notificação:

@HttpExchange(url = "${notification.service.url}")
public interface NotificationClient {

    @PostExchange("/api/notifications/email")
    void sendEmail(@RequestBody EmailNotification notification);

    @PostExchange("/api/notifications/sms")
    void sendSms(@RequestBody SmsNotification notification);
}

Configure o auto-wiring via application.yml e mostre como isso simplifica vs RestTemplate/WebClient.
```

---

## 8. Integração Frontend ↔ Backend

### Conectar frontend ao backend real

```
Atualize o frontend do Pet Care para consumir a API real (não mais mocks):

1. Crie um service layer com fetch/axios:
   - Configurar baseURL via variável NEXT_PUBLIC_API_URL (http://localhost:8080/api)
   - Interceptor para adicionar JWT no header Authorization
   - Interceptor para tratar erros da API (401 → redirect login, 422 → mostrar mensagem)

2. Atualize o AuthContext:
   - login() chama POST /api/auth/login real
   - Armazena tokens retornados
   - Refresh token quando access expira

3. Atualize cada página para usar dados reais:
   - Pets: GET/POST/PUT/DELETE /api/pets
   - Agenda: GET /api/appointments/slots, POST /api/appointments
   - Financeiro: GET /api/invoices
   - Carteirinha: dados vêm do GET /api/users/me + GET /api/pets

4. Tratar loading states e erros em cada página

Base URL: http://localhost:8080/api (local)
CORS já configurado no backend para localhost:3000.
```

### Resolver problemas de integração

```
A integração frontend ↔ backend está com o seguinte problema:
[colar erro - CORS, 401, formato de dados, etc]

Analise e corrija. Verifique:
1. CORS headers no backend
2. Token sendo enviado corretamente
3. Formato dos dados (request body) match com o DTO esperado
4. Rotas/paths corretos
```

---

## 9. Demo — Projeto Funcionando

### Preparar demo end-to-end

```
Prepare o projeto Pet Care para demonstração end-to-end:

1. Garanta que docker-compose sobe tudo (PostgreSQL, LocalStack)
2. Backend roda em localhost:8080 com dados iniciais
3. Frontend roda em localhost:3000 apontando para o backend
4. Crie um script demo.sh com a sequência:
   - docker-compose up -d
   - cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=local &
   - cd frontend && npm run dev &
   - echo "Pet Care rodando em http://localhost:3000"

5. Verifique o fluxo completo:
   - Acessar home → ver planos
   - Fazer login → acessar área logada
   - Cadastrar pet → ver na listagem
   - Agendar consulta → ver na agenda
   - Ver faturas → simular pagamento
   - Ver carteirinha → dados corretos
```

---

## 10. Git + PR Final

### Commit da migração

```
Crie um commit para a migração do Spring Boot 3.5 → 4.0 e integração frontend.
Tipo: feat, escopo: migration
Mensagem deve mencionar:
- Migração Spring Boot 3.5 → 4.0
- Jackson 3
- Spring Security 7
- Testes migrados
- Integração frontend ↔ backend
- Virtual threads habilitados (se aplicável)
```

### PR final

```
Crie a PR final do projeto Pet Care.
Título: "feat(migration): Spring Boot 4.0 + Integração End-to-End"
Descrição:
- O que foi migrado (lista de breaking changes resolvidos)
- O que é novo no 4.0 que aproveitamos
- Como rodar o projeto completo (frontend + backend)
- Fluxo de demonstração (passo a passo da demo)
- Testes passando
- Notas sobre comportamento diferente do 4.0 vs 3.5
```

---

## 11. Prompts de Suporte

### Se o build quebrar após mudar parent version

```
Após mudar para Spring Boot 4.0, o build falha com:
[colar erro]
Provavelmente é um starter renomeado ou dependência incompatível. Analise o erro e corrija o pom.xml.
```

### Se Jackson 3 serializar diferente

```
Após migrar para Jackson 3, o endpoint [X] retorna JSON diferente do esperado:
Antes (Jackson 2): [colar]
Agora (Jackson 3): [colar]
Ajuste a configuração ou annotations para manter o formato anterior, ou atualize o frontend para aceitar o novo formato.
```

### Se Security parar de funcionar

```
Após migrar SecurityConfig para lambda DSL do Spring Security 7, a autenticação não funciona mais:
[colar erro ou comportamento]
Revise a configuração. Lembre que defaults de CSRF e session podem ter mudado.
```

### Se testes falharem em massa

```
Após migrar para Boot 4, X testes estão falhando. Os erros principais são:
[colar erros]
Corrija considerando: @MockBean → @MockitoBean, @AutoConfigureMockMvc necessário, Jackson 3 mudanças.
```

### Se a integração frontend não conectar

```
O frontend não consegue se comunicar com o backend:
- Frontend: localhost:3000
- Backend: localhost:8080
Erro: [colar]
Verificar CORS, URL base, headers, formato de request.
```
