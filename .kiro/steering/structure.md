# Estrutura do Projeto

## Repositório (material de treinamento)

```
treinamento-kiro-petcare/
├── README.md                     # Visão geral do treinamento
├── .kiro/steering/               # Regras de steering para o Kiro
├── semana-1-frontend/            # Material semana 1 (frontend React/Next.js)
│   ├── 01-visao-geral.md        # Objetivo e divisão de tempo
│   ├── 02-historias.md          # Histórias de usuário com critérios de aceite
│   ├── 03-prompts.md            # Prompts copiáveis para o Kiro
│   ├── 04-passo-a-passo.md     # Guia cronometrado
│   └── 05-checklist.md         # Checklist de entrega
├── semana-2-arquitetura/         # Material semana 2 (AWS + Spring Boot 3.5)
│   ├── 01-visao-geral.md
│   ├── 02-prompts.md
│   ├── 03-passo-a-passo.md
│   ├── 04-checklist.md
│   └── 05-historias.md
└── semana-3-migracao/            # Material semana 3 (Spring Boot 4.0 + integração)
    ├── 01-visao-geral.md
    ├── 02-prompts.md
    ├── 03-passo-a-passo.md
    ├── 04-checklist.md
    └── 05-historias.md
```

## Estrutura esperada do código (gerado durante treinamento)

### Frontend (petcare-portal/)

```
petcare-portal/
├── app/                  # App Router (páginas e layouts)
├── components/           # Componentes reutilizáveis
├── contexts/             # Context providers (AuthContext)
├── types/                # Types e interfaces TypeScript
├── mocks/                # Dados mockados
└── public/               # Assets estáticos
```

### Backend (com.petcare.api)

```
com.petcare.api/
├── config/               # Configurações Spring (Security, AWS, CORS)
├── controller/           # Controllers REST
├── service/              # Lógica de negócio
├── repository/           # Repositórios Spring Data JPA
├── model/
│   ├── entity/           # Entidades JPA
│   ├── dto/              # DTOs de request/response (Java records)
│   └── enums/            # Enumerações
├── exception/            # Exceções customizadas + GlobalExceptionHandler
├── security/             # Filtros JWT, configuração Cognito
└── util/                 # Utilitários
```

## Convenções de organização

- Cada semana tem seu próprio diretório com material numerado (01, 02, ...)
- Arquivos de visão geral sempre em `01-visao-geral.md`
- Prompts copiáveis em arquivos dedicados (`02-prompts.md` ou `03-prompts.md`)
- Backend segue pacotes por camada (controller/service/repository)
- DTOs usam Java records com validação Jakarta
- Entidades JPA usam Lombok (@Data, @Builder)
