---
inclusion: fileMatch
fileMatchPattern: "backend/**"
---

# Stack e Estrutura do Backend - Pet Care

## Stack Principal

- **Framework**: Spring Boot 3.5.x
- **Linguagem**: Java 17+
- **Build**: Maven
- **Banco**: PostgreSQL 15 (RDS em produção, Docker local)
- **ORM**: Spring Data JPA / Hibernate
- **Auth**: Spring Security + JWT (Cognito em produção, token local em dev)
- **Storage**: AWS S3 SDK v2 (LocalStack em dev)
- **Docs**: SpringDoc OpenAPI 2.x (Swagger UI)
- **Testes**: JUnit 5 + Mockito
- **Container**: Docker + docker-compose
- **Validação**: Jakarta Bean Validation (Hibernate Validator)

## Scripts Disponíveis

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local   # Dev local
mvn test                                                # Rodar testes
mvn verify                                              # Build completo + testes
mvn clean package -DskipTests                           # Build sem testes
docker-compose up -d                                    # Subir PostgreSQL + LocalStack
docker-compose down                                     # Parar containers
```

## Estrutura de Pacotes

```
backend/
├── src/main/java/com/petcare/api/
│   ├── PetCareApplication.java        → Main class
│   ├── config/                        → Configurações (S3, Swagger, CORS)
│   ├── controller/                    → REST Controllers
│   ├── service/                       → Regras de negócio
│   ├── repository/                    → Spring Data JPA repositories
│   ├── model/
│   │   ├── entity/                    → Entidades JPA
│   │   ├── dto/                       → Request/Response DTOs (records)
│   │   └── enums/                     → Enums do domínio
│   ├── exception/                     → Exceções customizadas + GlobalHandler
│   ├── security/                      → SecurityConfig, JwtFilter, @CurrentUser
│   └── util/                          → Utilitários
├── src/main/resources/
│   ├── application.yml                → Config base
│   ├── application-local.yml          → Config dev local
│   ├── application-dev.yml            → Config ambiente dev AWS
│   ├── application-prod.yml           → Config produção
│   └── data.sql                       → Dados iniciais (profile local)
├── src/test/java/com/petcare/api/
│   └── service/                       → Testes unitários dos services
├── docker-compose.yml                 → PostgreSQL + LocalStack
├── Dockerfile                         → Multi-stage build
├── .env.example                       → Variáveis de ambiente
└── pom.xml                            → Dependências Maven
```

## Convenções

### Nomenclatura
- Pacotes: `com.petcare.api.{camada}`
- Entidades: PascalCase singular (`Pet`, `Appointment`)
- Tabelas: snake_case plural (`pets`, `appointments`)
- DTOs: `{Entity}Request`, `{Entity}Response`
- Services: `{Entity}Service`
- Controllers: `{Entity}Controller`
- Repositories: `{Entity}Repository`
- Enums: PascalCase (`AppointmentStatus`, `InvoiceStatus`)

### Entidades JPA
- IDs UUID para entidades de domínio, Long para tabelas de referência (Plan)
- `@Table(name = "snake_case")` explícito
- Lombok: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Auditing: `createdAt`, `updatedAt` com `@CreationTimestamp`, `@UpdateTimestamp`
- Relacionamentos explícitos com `@ManyToOne`, `@OneToMany(mappedBy = ...)`

### DTOs
- Implementados como Java `record`
- Validações Jakarta nos request DTOs: `@NotNull`, `@NotBlank`, `@Email`, `@Size`
- Response DTOs não expõem dados sensíveis (CPF mascarado, sem password)
- Usar `@JsonFormat` para datas

### Services
- `@Service` + `@Transactional` onde necessário
- userId vem do SecurityContext (via `@CurrentUser`), nunca do request body
- Verificação de ownership antes de qualquer operação em recurso do user
- Exceções de negócio tipadas: `BusinessException` (422), `ResourceNotFoundException` (404), `ForbiddenException` (403)

### Controllers
- `@RestController` + `@RequestMapping("/api/{recurso}")`
- `@Valid` em todos os `@RequestBody`
- `ResponseEntity<>` com status codes explícitos
- `@CurrentUser UUID userId` para identificar o usuário autenticado
- Swagger: `@Operation(summary = "...")` e `@ApiResponse` em cada método

### Security
- Endpoints públicos: `/api/auth/**`, `/api/plans`, `/swagger-ui/**`, `/v3/api-docs/**`
- Demais: requerem Bearer token válido
- CORS: `localhost:3000` (dev), domínio produção
- Session: STATELESS
- CSRF: desabilitado

### Testes
- JUnit 5 + Mockito
- Padrão: `@ExtendWith(MockitoExtension.class)`
- Repositories mockados com `@Mock`
- Services testados com `@InjectMocks`
- Nomenclatura: `deve_[resultado]_quando_[condição]` ou `should_[result]_when_[condition]`
- Testar: cenários de sucesso + cada regra de negócio que pode falhar

### Error Handling
- `@RestControllerAdvice` global
- Formato padrão: `{ timestamp, status, error, message, path }`
- Validação: adiciona `fieldErrors: [{ field, message }]`
- Nunca expor stacktrace ao cliente
- Log completo no server, mensagem genérica pro client em 500

### Profiles
- `local`: PostgreSQL local, JWT com secret fixo, S3 no LocalStack, ddl-auto: create, data.sql carregado
- `dev`: RDS, Cognito real, S3 real, ddl-auto: validate
- `prod`: Igual dev com configs de produção, ddl-auto: none (migrations)

## Regras de Negócio Principais

| Regra | Comportamento |
|-------|--------------|
| Máximo 3 pets por user | 422 se tentar criar o 4º |
| Agendamento em data passada | 422 |
| Agendamento em slot ocupado | 422 |
| Slots válidos | 09:00, 10:00, 11:00, 14:00, 15:00, 16:00 |
| Upload > 5MB | 400 |
| Upload tipo inválido (não jpeg/png) | 400 |
| Pagar fatura já paga | 422 |
| Acessar recurso de outro user | 403 |
| Subscription ativa duplicada | 422 |
