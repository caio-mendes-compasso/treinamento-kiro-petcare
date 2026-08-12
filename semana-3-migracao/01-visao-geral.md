# Semana 3 — Migração Spring Boot 3.5 → 4.0 + Projeto Funcionando

## Objetivo

Migrar o backend de Spring Boot 3.5 para 4.0, lidar com breaking changes reais, integrar frontend ↔ backend e demonstrar o projeto Pet Care funcionando end-to-end.

---

## O que será feito

| Etapa | Entrega | Tempo |
|---|---|---|
| Migração Spring Boot 4.0 | Backend atualizado e compilando | 25 min |
| Ajustes de breaking changes | Tudo funcionando na nova versão | 10 min |
| Integração frontend ↔ backend | App comunicando end-to-end | 15 min |
| Demo + PR final | Projeto rodando, PR aberto | 10 min |

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
3. **Testes quebram silenciosamente** — @MockBean vira @MockitoBean, @SpringBootTest não traz MockMvc, assertions podem falhar por Jackson 3
4. **Starters renomeados** — módulos separados, dependências que antes eram transitivas agora precisam ser explícitas
5. **Integração end-to-end** — conectar frontend real com backend real, resolver CORS, auth, URLs

---

## Divisão do Tempo (1h)

| Tempo | Atividade |
|---|---|
| 0-5min | Recap + explicar mudanças Spring Boot 4.0 |
| 5-30min | Migração: pom.xml, Jackson 3, Security 7, módulos |
| 30-40min | Corrigir testes quebrados |
| 40-55min | Integração frontend ↔ backend + demo |
| 55-60min | Commit + PR final |

---

## Pré-requisitos

- Java 17+ (recomendado 21 para virtual threads)
- Resultado da Semana 2 (backend Spring Boot 3.5 funcionando)
- Frontend da Semana 1 rodando
- Docker + docker-compose
- Kiro IDE/CLI pronto
