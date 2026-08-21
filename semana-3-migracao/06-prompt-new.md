# Live Code Training: Atualização do Spring Boot

## Contexto

O projeto **kiro-flashcards-2-be** utiliza Spring Boot **3.3.5** com Java 21.
A versão mais recente estável é Spring Boot **4.1.x** (baseada em Spring Framework 7).
O treinamento simula a jornada real de um desenvolvedor planejando e executando essa migração com auxílio de IA.

---

## Fase 1 — Exploração e Planejamento

### Prompt 1: Descobrir a versão alvo

```
Qual é a versão mais recente estável do Spring Boot disponível hoje?
Qual a versão do Spring Framework que ela utiliza?
E qual o baseline mínimo de Java?
```

**Motivo**: Estabelecer o ponto de partida da pesquisa. O desenvolvedor precisa saber para onde está indo antes de avaliar impactos.

**Resultado esperado**: A IA responde que a versão mais recente é Spring Boot 4.1.x, baseada no Spring Framework 7, com baseline de Java 17+ (recomendado 21). Deve mencionar que a versão 3.3.5 atual já está em EOL.

---

### Prompt 2: Entender o caminho de atualização recomendado

```
Estou no Spring Boot 3.3.5. Qual é o caminho recomendado de migração até a versão mais recente?
Devo fazer saltos intermediários (ex: 3.3 → 3.5 → 4.0 → 4.1) ou posso ir direto?
```

**Motivo**: Migrações de major version costumam ter um caminho recomendado. Pular etapas pode esconder deprecations que viraram remoções.

**Resultado esperado**: A IA recomenda primeiro atualizar para a última 3.x (3.5.x), resolver todos os deprecation warnings, e depois migrar para 4.0/4.1. Esse é o caminho mais seguro documentado pela própria equipe do Spring.

---

### Prompt 3: Identificar breaking changes

```
Quais são as principais breaking changes entre Spring Boot 3.x e 4.0?
Considerando que meu projeto usa: Spring Web, Spring Data JPA, Jakarta Validation, H2, PostgreSQL e springdoc-openapi, quais desses são impactados?
```

**Motivo**: Antes de mexer no código, é essencial entender o escopo do impacto. Isso ajuda a dimensionar esforço e riscos.

**Resultado esperado**: A IA lista os principais impactos:
- Jackson 3 como default (mudanças no package `com.fasterxml.jackson` → `tools.jackson`)
- Starter renames e reorganização de módulos
- Jakarta EE 11 / Servlet 6.1 como baseline
- Remoção de APIs que foram deprecadas no 3.x
- Possíveis impactos no springdoc-openapi (compatibilidade com Boot 4)
- Mudanças no Spring Security 7 defaults (se aplicável)

---

### Prompt 4: Impactos na base de código do projeto

```
Analise o build.gradle.kts e a estrutura do meu projeto. 
Quais arquivos e dependências serão impactados pela migração para Spring Boot 4.x?
Existe alguma dependência que pode não ter suporte à nova versão?
```

**Motivo**: Trazer a análise de breaking changes para o contexto concreto do projeto. Aqui o Kiro lê o código e dá respostas específicas.

**Resultado esperado**: A IA analisa o `build.gradle.kts` e identifica:
- `springdoc-openapi-starter-webmvc-ui:2.6.0` pode precisar de upgrade para versão compatível com Boot 4
- `net.jqwik:jqwik:1.8.5` e `jqwik-spring:0.12.0` precisam ser verificados
- O plugin `io.spring.dependency-management` pode ter nova versão requerida
- Mudanças no Jackson afetam serialização/deserialização dos DTOs
- Configurações em `application.properties`/`application.yml` podem ter properties renomeadas

---

### Prompt 5: Impacto nos testes

```
Meu projeto tem testes com JUnit 5, jqwik para property-based testing, e usa TestRestTemplate com RANDOM_PORT.
A migração para Spring Boot 4.x quebra algo na infraestrutura de testes?
Existem mudanças em anotações, configurações ou engines de teste?
```

**Motivo**: Testes são a rede de segurança da migração. Se a infra de testes quebrar, perde-se a capacidade de validar a migração.

**Resultado esperado**: A IA informa sobre:
- Possíveis mudanças no `spring-boot-starter-test` (JUnit 5 continua suportado)
- Verificar compatibilidade do jqwik-spring com Spring Framework 7
- MockMvc e TestRestTemplate continuam disponíveis mas podem ter ajustes
- Nova engine de testes ou alterações nas annotations

---

### Prompt 6: Impacto no Dockerfile e docker-compose

```
Meu projeto tem um Dockerfile e docker-compose.yml para rodar com PostgreSQL.
A atualização do Spring Boot exige alguma mudança na imagem base, variáveis de ambiente ou configuração do container?
```

**Motivo**: Infraestrutura de deploy é frequentemente esquecida em migrações. Se a imagem base não suporta a versão do Java ou há mudanças em profiles, o deploy quebra.

**Resultado esperado**: A IA verifica o Dockerfile e indica:
- Se a imagem base do Java precisa ser atualizada
- Se há mudanças em properties de conexão com banco
- Se o health check ou actuator endpoints mudaram

---

### Prompt 7: Checklist de riscos e rollback

```
Com base em tudo que discutimos, quais são os maiores riscos dessa migração?
Qual a estratégia de rollback se algo der errado?
Existe algum ponto de "no return" que eu deva ter cuidado?
```

**Motivo**: Antes de partir para execução, consolidar riscos e ter um plano B claro. Em treinamentos live, isso mostra maturidade na tomada de decisão.

**Resultado esperado**: A IA consolida:
- Riscos: incompatibilidade de libs terceiras, mudanças silenciosas no Jackson 3, configs deprecadas sem warnings
- Rollback: manter branch separada, tag no estado atual, rodar full test suite antes do merge
- Não há "no return" real se estiver em branch isolada com boa cobertura de testes

---

### Prompt 4b: Análise de Impacto Consolidada

```
Faça uma análise de impacto completa da migração deste projeto para Spring Boot 4.1.x. 
Estruture a resposta nas seguintes seções:

1. **Dependências no build.gradle.kts** — Tabela com cada dependência atual, seu status no Boot 4.1 (✅ mantido, ⚠️ risco, 🔄 renomeado, ❌ incompatível), e a ação necessária.

2. **Arquivos Impactados** — Agrupe em:
   - Impacto ALTO (quebra certa): arquivos que vão parar de compilar ou funcionar
   - Impacto MÉDIO (pode precisar ajuste): arquivos que podem funcionar mas têm risco
   - Impacto BAIXO (sem mudança necessária): camadas que migram limpas

   Para cada arquivo, explique o motivo do impacto.

3. **Dependências com Risco de Incompatibilidade** — Para cada lib de risco:
   - Qual a última versão testada e com quais versões do Spring
   - O que pode quebrar concretamente
   - Mitigação sugerida

4. **Resumo Visual** — Diagrama ASCII mostrando o impacto relativo por camada do projeto (de ALTO a NULO).

5. **Ponto de atenção principal** — Resumo executivo dos 3-5 maiores riscos, priorizados por probabilidade de quebra.

Analise o build.gradle.kts, os arquivos de configuração, os testes e o código-fonte do projeto para dar respostas concretas e específicas (não genéricas).
```

**Motivo**: Gera um documento de análise de impacto completo e acionável que pode ser usado como referência durante toda a execução da migração. Formato tabular e visual facilita revisão rápida e tomada de decisão.

**Resultado esperado**: A IA produz um documento estruturado com:
- Tabela de dependências com status e ações claras
- Lista priorizada de arquivos que precisam de atenção
- Análise profunda de libs com risco (jqwik-spring, springdoc, Jackson 3)
- Diagrama visual de impacto por camada
- Resumo executivo dos principais riscos para comunicação com o time

---

## Fase 2 — Prompt Consolidado para Spec

### Prompt 8: Iniciar a Spec de migração

```
Quero criar uma spec para migrar este projeto de Spring Boot 3.3.5 para a versão estável mais recente (4.1.x).

Requisitos da migração:
1. Seguir o caminho recomendado: primeiro atualizar para 3.5.x, resolver deprecations, depois ir para 4.x
2. Atualizar todas as dependências do build.gradle.kts para versões compatíveis
3. Migrar código impactado por breaking changes (Jackson 3, starter renames, property renames)
4. Garantir compatibilidade do springdoc-openapi com a nova versão
5. Verificar e atualizar compatibilidade do jqwik/jqwik-spring
6. Atualizar Dockerfile se necessário
7. Manter todos os testes passando (76+ testes)
8. A aplicação deve continuar funcionando identicamente do ponto de vista da API (mesmos endpoints, mesmos contratos)

Restrições:
- Não alterar a arquitetura do projeto
- Não adicionar novas features
- Manter compatibilidade com H2 (dev) e PostgreSQL (production)
- Java 21 continua como versão alvo

Crie a spec com requirements, design e tasks.
```

**Motivo**: Este é o prompt que consolida toda a exploração anterior em uma spec estruturada e acionável. No contexto do live code, é o momento de transição de "planejamento" para "execução".

**Resultado esperado**: O Kiro inicia o fluxo de spec com:
- **Requirements**: Lista de requisitos funcionais e não-funcionais da migração
- **Design**: Decisões técnicas (ordem dos passos, estratégia de migração em etapas, o que testar em cada etapa)
- **Tasks**: Tarefas incrementais e ordenadas que podem ser executadas uma a uma com validação entre elas

---

## Dicas para o Live Code

1. **Execute cada prompt da Fase 1 em sequência** — deixe a plateia ver a IA construindo contexto
2. **Mostre que as respostas influenciam o próximo prompt** — é uma conversa, não um script
3. **No Prompt 4, deixe o Kiro ler o código real** — isso demonstra o diferencial de análise contextual
4. **No Prompt 8, use o modo Spec do Kiro** — demonstra o fluxo completo de requirements → design → tasks
5. **Após a spec ser gerada, execute 2-3 tasks ao vivo** — mostra a execução prática com validação
6. **Rode `./gradlew test` entre as tasks** — reforça a importância da rede de segurança dos testes





--- 
## Command to run on windows
java "-Dmaven.multiModuleProjectDirectory=." -classpath ".\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run "-Dspring-boot.run.profiles=local"

## Swagger
http://localhost:8080/swagger-ui/index.html