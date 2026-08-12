# Treinamento Contínuo: Kiro IDE & CLI

## Projeto: Portal Pet Care

Treinamento prático de 3 semanas demonstrando o fluxo completo de desenvolvimento usando **Kiro IDE e CLI** — desde a criação de histórias até a entrega em produção.

---

## Sobre o Projeto

O **Portal Pet Care** é uma aplicação web para gerenciamento de planos de saúde animal, contendo:

| Funcionalidade | Descrição |
|---|---|
| Home | Página inicial do portal |
| Venda de Plano | Contratação de planos de saúde pet |
| Login | Autenticação de usuários |
| Cadastro do Animal | Registro dos dados do pet |
| Agenda | Marcação de consultas e exames |
| Área Financeira | Visualização e pagamento de boletos |
| Carteirinha | Dados do plano e do animal |

---

## Cronograma

### Semana 1 — Frontend (História → PR)
**Foco:** Fluxo completo de desenvolvimento frontend com Kiro

- Criação de histórias de usuário
- Refinamento com specs
- Desenvolvimento com React/Next.js
- Testes
- Branch, commit e Pull Request

### Semana 2 — Arquitetura AWS + Backend Spring Boot 3.5
**Foco:** Desenho da arquitetura cloud e criação do backend

- Análise da arquitetura via diagrama
- Precificação dos custos na AWS
- Criação do backend Java com Spring Boot 3.5
- Endpoints, banco de dados, segurança
- Integração com serviços AWS (Cognito, S3, SQS)
- Branch, commit e Pull Request

### Semana 3 — Migração Spring 4.0 + Projeto Funcionando
**Foco:** Migração de versão e entrega do projeto completo

- Migração do Spring Boot 3.5 → 4.0
- Ajustes de breaking changes e novas features
- Integração frontend ↔ backend
- Deploy e demonstração do projeto funcionando end-to-end
- Branch, commit e Pull Request final

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React / Next.js |
| Backend | Java (Spring Boot 3.5 → 4.0) |
| Cloud | AWS |
| Ferramenta | Kiro IDE & CLI |

---

## Estrutura do Repositório

```
treinamento-kiro-petcare/
├── README.md                    # Este arquivo
├── semana-1-frontend/           # Material da semana 1
│   ├── 01-visao-geral.md      # Objetivo, páginas, momentos complexos, divisão do tempo
│   ├── 02-historias.md         # 7 histórias de usuário completas com critérios de aceite
│   ├── 03-prompts.md           # Todos os prompts copiáveis (setup, spec, features, testes, PR)
│   ├── 04-passo-a-passo.md    # Guia cronometrado para o facilitador
│   └── 05-checklist.md        # Checklist de entrega + problemas comuns
├── semana-2-arquitetura/        # Material da semana 2
│   ├── 01-visao-geral.md      # Objetivo, arquitetura AWS + backend Spring Boot 3.5
│   ├── 02-prompts.md           # Prompts para diagrama, custos, backend completo
│   ├── 03-passo-a-passo.md    # Guia cronometrado para o facilitador
│   └── 04-checklist.md        # Checklist de entrega + problemas comuns
└── semana-3-migracao/           # Material da semana 3
    ├── 01-visao-geral.md      # Objetivo, mudanças Spring 4.0, integração, demo
    ├── 02-prompts.md           # Prompts para migração, ajustes, integração e deploy
    ├── 03-passo-a-passo.md    # Guia cronometrado para o facilitador
    └── 04-checklist.md        # Checklist de entrega + problemas comuns
```

---

## Como Usar Este Material

> **Importante:** Este repositório contém apenas o material teórico e os guias.
> Todo o código será criado **ao vivo** durante o treinamento usando o Kiro.

1. Leia a teoria antes de cada sessão
2. Durante a prática, use os prompts prontos (copie e cole no Kiro)
3. Siga o passo a passo para garantir que nenhuma etapa seja pulada
4. Use o checklist para validar a entrega

---

## Pré-requisitos

- [ ] Kiro IDE instalado
- [ ] Kiro CLI configurado
- [ ] Node.js 18+ instalado
- [ ] Java 17+ instalado
- [ ] Docker + docker-compose
- [ ] Conta AWS com acesso ao console
- [ ] AWS CLI configurada
- [ ] Git configurado
- [ ] Conta GitHub para PRs
