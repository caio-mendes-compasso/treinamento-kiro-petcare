# Semana 3 — Migração Spring Boot 3.5 → 4.0 + Projeto Funcionando

## Objetivo

Migrar o backend de Spring Boot 3.5 para 4.0, lidar com breaking changes reais.

---

## O que será feito

| Etapa | Entrega | Tempo |
|---|---|---|
| Migração Spring Boot 4.0 | Backend atualizado e compilando | 25 min |
| Ajustes de breaking changes | Tudo funcionando na nova versão | 10 min |

---

## O que muda no Spring Boot 4.0 (Breaking Changes Relevantes)

| Mudança | Impacto no Pet Care | Dificuldade |
|---|---|---|
| Jackson 3 como default | Annotations renomeadas, pacotes tools.jackson | Alta |
| Spring Security 7 (lambda DSL obrigatório) | SecurityConfig precisa reescrever | Média |
| Módulos reorganizados (starters renomeados) | pom.xml precisa de ajustes | Média |
| @MockBean/@SpyBean removidos | Testes precisam migrar para @MockitoBean | Média |
| APIs deprecated no 3.x removidas | Código que usava deprecated quebra | Baixa |
| Servlet 6.1 baseline (Tomcat 11) | Geralmente transparente | Baixa |
| Virtual threads opt-in | Oportunidade de habilitar | Baixa |
| HTTP Service Clients (novo) | Pode simplificar clients | Oportunidade |
| @SpringBootTest não auto-configura MockMvc | Precisa de @AutoConfigureMockMvc explícito | Média |

---

## Momentos Complexos

1. **Jackson 3 migration** — pacotes mudam de `com.fasterxml.jackson` para `tools.jackson`, annotations renomeadas, serialização com comportamento diferente
2. **Spring Security 7** — method chaining removido, só lambda DSL, defaults de CSRF e session mudam
3. **Starters renomeados** — módulos separados, dependências que antes eram transitivas agora precisam ser explícitas

---

## Pré-requisitos

- Java 17+ (recomendado 21 para virtual threads)
- Resultado da Semana 2 (backend Spring Boot 3.5 funcionando)
- Frontend da Semana 1 rodando
- Docker + docker-compose
- Kiro IDE/CLI pronto
