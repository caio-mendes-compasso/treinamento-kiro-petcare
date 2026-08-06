# Checklist de Entrega — Semana 3: Migração Spring Boot 4.0 + Projeto Funcionando

> Use este checklist para validar que tudo foi entregue corretamente.

---

## Migração Spring Boot 4.0

- [ ] pom.xml atualizado para Spring Boot 4.0.x
- [ ] Starters renomeados/novos adicionados
- [ ] Build compila sem erros (`mvn compile`)
- [ ] Nenhum uso de API deprecated/removida

## Jackson 3

- [ ] Imports migrados: `com.fasterxml.jackson` → `tools.jackson`
- [ ] Annotations funcionando no novo pacote
- [ ] Serialização de datas no formato correto
- [ ] Serialização de enums consistente
- [ ] Endpoints retornam JSON no formato esperado pelo frontend

## Spring Security 7

- [ ] SecurityConfig usa apenas lambda DSL
- [ ] Nenhum method chaining antigo
- [ ] Endpoints públicos continuam públicos
- [ ] Endpoints protegidos continuam protegidos
- [ ] CORS funciona para o frontend
- [ ] JWT validation funcional

## Testes

- [ ] @MockBean → @MockitoBean migrado
- [ ] @AutoConfigureMockMvc adicionado onde necessário
- [ ] Todos os testes passando (`mvn test`)
- [ ] Assertions de JSON atualizadas para Jackson 3

## Virtual Threads (se habilitado)

- [ ] `spring.threads.virtual.enabled: true` configurado
- [ ] Aplicação sobe sem erros
- [ ] Sem problemas de pinning nos logs

## Integração Frontend ↔ Backend

- [ ] Frontend chama API real (não mais mocks)
- [ ] Token JWT enviado nos requests autenticados
- [ ] Erros da API tratados no frontend (401, 422, 500)
- [ ] Loading states funcionando
- [ ] Login funciona end-to-end
- [ ] CRUD de pets funciona end-to-end
- [ ] Agendamento funciona end-to-end
- [ ] Faturas listam e pagamento simula
- [ ] Carteirinha mostra dados reais

## Demo End-to-End

- [ ] docker-compose sobe sem erros
- [ ] Backend roda em localhost:8080
- [ ] Frontend roda em localhost:3000
- [ ] Swagger acessível
- [ ] Fluxo completo funciona: Home → Login → Pets → Agenda → Financeiro → Carteirinha

## Git & PR

- [ ] Branch `feat/spring-boot-4-migration` criada
- [ ] Commit seguindo conventional commits
- [ ] PR aberto com:
  - Lista de breaking changes resolvidos
  - Instruções para rodar o projeto completo
  - Fluxo de demonstração

---

## Problemas Comuns e Soluções

| Problema | Solução rápida (prompt) |
|---|---|
| Build falha após mudar parent | "Provavelmente starter renomeado ou dependência incompatível. Analise o erro: [colar]" |
| Jackson 3 imports não resolvem | "Verificar se a dependência tools.jackson está no classpath. Pode precisar de dependência explícita no pom.xml." |
| SecurityConfig não compila | "Method chaining foi removido no Security 7. Reescreva usando lambda DSL: `.csrf(csrf -> csrf.disable())`" |
| @MockBean não encontrado | "No Spring Boot 4.0, @MockBean foi substituído por @MockitoBean. Importe de `org.springframework.test.context.bean.override.mockito`." |
| Testes falham por JSON diferente | "Jackson 3 serializa diferente. Use JSONAssert com modo lenient ou ajuste expected values." |
| CORS bloqueando após migração | "Verificar se a config de CORS ainda está ativa no novo formato SecurityConfig lambda DSL." |
| Frontend recebe 401 | "Token pode estar expirado ou formato diferente. Verificar se JwtFilter ainda parseia corretamente." |
| Virtual threads pinning | "Se há `synchronized` blocks ou operações blocking, virtual threads ficam pinned. Verificar logs com `-Djdk.tracePinnedThreads=short`." |
| Aplicação inicia mas endpoints 404 | "Controller pode não estar sendo escaneado. Verificar @ComponentScan e package structure após reorganização de módulos." |
| Frontend formata dados errado | "Formato de data mudou com Jackson 3. Frontend espera 'YYYY-MM-DD' mas API retorna formato diferente. Ajustar @JsonFormat ou configuração global." |
