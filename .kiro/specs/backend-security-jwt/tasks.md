# Implementation Plan: Spring Security + JWT Cognito

## Overview

Implementação completa de segurança: JwtService para gerar/validar tokens, filter para interceptar requests, SecurityConfig com rotas públicas/privadas e CORS, AuthService/Controller para auth endpoints.

## Tasks

- [x] 1. Adicionar dependência jjwt
  - [x] 1.1 Adicionar jjwt-api, jjwt-impl (runtime), jjwt-jackson (runtime) versão 0.12.6 no pom.xml
  - _Requirements: 1.5_

- [x] 2. Criar JwtService
  - [x] 2.1 Método generateToken com subject=userId, claim email, expiration configurável
  - [x] 2.2 Método generateRefreshToken com expiração 7x maior
  - [x] 2.3 Método isTokenValid com try/catch retornando boolean
  - [x] 2.4 Método extractUserId extraindo UUID do subject
  - [x] 2.5 Método extractClaims para parsing genérico
  - _Requirements: 1.1-1.5_

- [x] 3. Criar JwtAuthenticationFilter
  - [x] 3.1 Estender OncePerRequestFilter
  - [x] 3.2 Extrair header Authorization, verificar "Bearer " prefix
  - [x] 3.3 Validar token e setar UsernamePasswordAuthenticationToken no SecurityContext
  - [x] 3.4 Sempre chamar filterChain.doFilter (não bloquear)
  - _Requirements: 2.1-2.4_

- [x] 4. Reescrever SecurityConfig
  - [x] 4.1 Definir requestMatchers permitAll para endpoints públicos
  - [x] 4.2 anyRequest().authenticated() para demais
  - [x] 4.3 Configurar CORS com allowed origins localhost:3000/3001
  - [x] 4.4 Session STATELESS, CSRF disabled
  - [x] 4.5 addFilterBefore JwtAuthenticationFilter
  - _Requirements: 3.1-3.5_

- [x] 5. Criar AuthService e AuthController
  - [x] 5.1 AuthService.register: verificar email duplicado, criar user, gerar tokens
  - [x] 5.2 AuthService.login: buscar por email, validar senha "123456", gerar tokens
  - [x] 5.3 AuthService.refresh: validar refreshToken, gerar novos tokens
  - [x] 5.4 AuthController com POST /register (201), /login (200), /refresh (200)
  - [x] 5.5 Criar DTOs: AuthRequest, AuthResponse, RegisterRequest, RefreshRequest
  - _Requirements: 4.1-4.5_

- [x] 6. Configurar jwt.secret e jwt.expiration no application-local.yml

- [x] 7. Validar compilação com `mvn compile`
