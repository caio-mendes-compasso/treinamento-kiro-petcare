# Pet Care API

Backend service para a plataforma Pet Care, construído com Spring Boot 3.5.

## Requisitos

- Java 21 (LTS)
- Maven 3.9+
- Docker e Docker Compose (para PostgreSQL e LocalStack)

## Setup Local

### 1. Subir infraestrutura

Na raiz do monorepo:

```bash
docker compose up -d
```

### 2. Compilar o projeto

```bash
# Windows (se JAVA_HOME aponta para JDK 17, usar):
set JAVA_HOME=C:\Program Files\Java\jdk-21
.\mvnw.cmd compile

# Linux/Mac:
export JAVA_HOME=/path/to/jdk-21
./mvnw compile
```

### 3. Rodar a aplicação

```bash
set JAVA_HOME=C:\Program Files\Java\jdk-21
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

A aplicação estará disponível em `http://localhost:8080`.

### 4. Acessar Swagger

Abrir no navegador: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Profiles

| Profile | Uso |
|---------|-----|
| `local` | Desenvolvimento local com Docker |
| `dev`   | Ambiente de desenvolvimento |
| `prod`  | Produção |

## Estrutura de Pacotes

```
com.petcare.api
├── config/          → Configurações (OpenAPI, AWS, etc.)
├── controller/      → REST Controllers
├── service/         → Lógica de negócio
├── repository/      → Acesso a dados (JPA)
├── model/
│   ├── entity/      → Entidades JPA
│   ├── dto/         → Data Transfer Objects
│   └── enums/       → Enumerações
├── exception/       → Tratamento global de exceções
├── security/        → Configurações de segurança
└── util/            → Utilitários
```

## Docker Build

```bash
docker build -t petcare-api .
docker run -p 8080:8080 --env-file ../.env petcare-api
```
