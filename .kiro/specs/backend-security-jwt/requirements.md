# Requirements Document

## Introduction

O backend precisa de segurança JWT com endpoints públicos e protegidos, CORS para o frontend, e um AuthController para register/login/refresh. No profile local, usa HMAC com secret fixo; em produção, validaria tokens do AWS Cognito.

## Glossary

- **JwtService**: Service para gerar e validar tokens JWT com HMAC
- **JwtAuthenticationFilter**: Filter que intercepta requests, extrai Bearer token e seta SecurityContext
- **SecurityConfig**: Configuração central de Spring Security (regras de acesso, CORS, session policy)
- **AuthController**: Controller público para registro, login e refresh de tokens
- **Bearer Token**: Formato de autenticação via header Authorization: Bearer {token}

## Requirements

### Requirement 1: JwtService

**User Story:** Como desenvolvedor, eu quero gerar e validar tokens JWT, para autenticar usuários de forma stateless.

#### Acceptance Criteria

1. JwtService.generateToken SHALL criar token com subject=userId, claim email, issuedAt, expiration (configurável via property jwt.expiration)
2. JwtService.generateRefreshToken SHALL criar token com subject=userId e expiração 7x maior que access token
3. JwtService.isTokenValid SHALL retornar false se token expirado ou inválido (sem lançar exceção)
4. JwtService.extractUserId SHALL extrair UUID do subject do token
5. Secret SHALL ser configurável via property jwt.secret com valor default para desenvolvimento

### Requirement 2: JwtAuthenticationFilter

**User Story:** Como sistema, eu quero interceptar requests e validar tokens automaticamente.

#### Acceptance Criteria

1. O filter SHALL extrair token do header Authorization quando presente e começar com "Bearer "
2. Se token válido, SHALL criar UsernamePasswordAuthenticationToken com principal=userId.toString() e setar no SecurityContextHolder
3. Se token inválido ou ausente, SHALL deixar request passar sem autenticação (SecurityConfig decide o que bloquear)
4. SHALL ser registrado antes do UsernamePasswordAuthenticationFilter na chain

### Requirement 3: SecurityConfig

**User Story:** Como desenvolvedor, eu quero regras claras de acesso e CORS configurado.

#### Acceptance Criteria

1. Endpoints públicos SHALL ser: /api/auth/**, /api/plans, /api/health, /swagger-ui/**, /v3/api-docs/**, /swagger-ui.html
2. Demais endpoints SHALL exigir autenticação (anyRequest().authenticated())
3. CORS SHALL permitir origins localhost:3000 e localhost:3001, todos os métodos, credentials true
4. Session SHALL ser STATELESS, CSRF desabilitado
5. JwtAuthenticationFilter SHALL ser adicionado antes do UsernamePasswordAuthenticationFilter

### Requirement 4: AuthController

**User Story:** Como usuário, eu quero me registrar, fazer login e renovar meu token.

#### Acceptance Criteria

1. POST /api/auth/register SHALL criar user e retornar AuthResponse (accessToken, refreshToken, user) com status 201
2. POST /api/auth/register SHALL lançar BusinessException se email já existe
3. POST /api/auth/login SHALL autenticar user por email + senha "123456" (mock) e retornar AuthResponse (200)
4. POST /api/auth/login SHALL lançar BusinessException se credenciais inválidas
5. POST /api/auth/refresh SHALL validar refreshToken e retornar novos tokens (200) ou BusinessException se inválido
