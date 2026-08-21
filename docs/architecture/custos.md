# Estimativa de Custos AWS - Pet Care Portal

> **Região:** us-east-1 (N. Virginia)
> **Data da estimativa:** Agosto 2026
> **Fonte:** AWS Price List API (On-Demand)
> **Disclaimer:** Estimativas para fins de planejamento. Custos reais podem variar.

## Premissas

| Parâmetro | Valor |
|-----------|-------|
| MAU (Monthly Active Users) | 1.000 |
| Requests/dia | 5.000 |
| Requests/mês | ~150.000 |
| Armazenamento S3 (fotos) | 500 MB |
| Banco de dados (RDS) | 10 GB |
| Backend disponibilidade | 24/7 |
| Fargate config | 0.5 vCPU, 1 GB RAM |
| Lambda config (cenário 2) | 512 MB, ~200ms/request |

---

## Cenário 1: Container (ECS Fargate)

| Serviço | Configuração | Preço Unitário | Cálculo | Custo Mensal |
|---------|-------------|----------------|---------|--------------|
| **ECS Fargate (vCPU)** | 0.5 vCPU × 730h | $0.04048/vCPU-hour | 0.5 × 730 × $0.04048 | **$14.78** |
| **ECS Fargate (RAM)** | 1 GB × 730h | $0.004445/GB-hour | 1 × 730 × $0.004445 | **$3.24** |
| **RDS PostgreSQL** | db.t3.micro Single-AZ | $0.018/hour | 730 × $0.018 | **$13.14** |
| **RDS Storage** | 10 GB gp3 | $0.115/GB-mês | 10 × $0.115 | **$1.15** |
| **S3 (Fotos)** | 500 MB Standard | $0.023/GB-mês | 0.5 × $0.023 | **$0.01** |
| **S3 (Frontend)** | ~50 MB static | $0.023/GB-mês | 0.05 × $0.023 | **~$0.00** |
| **CloudFront** | 10 GB transfer/mês | $0.085/GB (primeiros 10TB) | 10 × $0.085 | **$0.85** |
| **Route 53** | 1 hosted zone + queries | $0.50/zone + $0.40/1M queries | $0.50 + $0.06 | **$0.56** |
| **Cognito** | 1.000 MAU | Grátis (primeiros 50k MAU) | — | **$0.00** |
| **SQS** | ~150k msgs/mês | $0.40/1M requests | 0.15 × $0.40 | **$0.06** |
| **CloudWatch** | Logs + métricas básicas | ~5 métricas custom + 5GB logs | Estimado | **$3.00** |
| **NAT Gateway** | Tráfego mínimo | $0.045/hour + $0.045/GB | 730 × $0.045 + 5 × $0.045 | **$33.08** |
| **ALB** | 1 ALB + LCU mínimo | $0.0225/hour + $0.008/LCU-hour | 730 × $0.0225 + 730 × $0.008 | **$22.27** |
| | | | **TOTAL MENSAL** | **$92.14** |

---

## Cenário 2: Serverless (Lambda + API Gateway)

| Serviço | Configuração | Preço Unitário | Cálculo | Custo Mensal |
|---------|-------------|----------------|---------|--------------|
| **Lambda (Requests)** | 150k requests/mês | $0.20/1M requests | 0.15 × $0.20 | **$0.03** |
| **Lambda (Compute)** | 512MB × 200ms × 150k | $0.0000166667/GB-s | 150k × 0.5GB × 0.2s × $0.0000166667 | **$0.25** |
| **API Gateway** | 150k requests/mês | $3.50/1M requests | 0.15 × $3.50 | **$0.53** |
| **RDS PostgreSQL** | db.t3.micro Single-AZ | $0.018/hour | 730 × $0.018 | **$13.14** |
| **RDS Storage** | 10 GB gp3 | $0.115/GB-mês | 10 × $0.115 | **$1.15** |
| **S3 (Fotos)** | 500 MB Standard | $0.023/GB-mês | 0.5 × $0.023 | **$0.01** |
| **S3 (Frontend)** | ~50 MB static | $0.023/GB-mês | 0.05 × $0.023 | **~$0.00** |
| **CloudFront** | 10 GB transfer/mês | $0.085/GB | 10 × $0.085 | **$0.85** |
| **Route 53** | 1 hosted zone + queries | $0.50/zone + $0.40/1M queries | $0.50 + $0.06 | **$0.56** |
| **Cognito** | 1.000 MAU | Grátis (primeiros 50k MAU) | — | **$0.00** |
| **SQS** | ~150k msgs/mês | $0.40/1M requests | 0.15 × $0.40 | **$0.06** |
| **CloudWatch** | Logs + métricas básicas | Estimado | Estimado | **$2.00** |
| **NAT Gateway** | Não necessário (Lambda VPC endpoints) | — | — | **$0.00** |
| | | | **TOTAL MENSAL** | **$18.58** |

---

## Comparativo

| Aspecto | Cenário 1 (Fargate) | Cenário 2 (Serverless) |
|---------|---------------------|------------------------|
| **Custo Mensal** | ~$92/mês | ~$19/mês |
| **Economia** | — | **~79% mais barato** |
| **Scale-to-zero** | ❌ Roda 24/7 | ✅ Paga só pelo uso |
| **Cold start** | ❌ Sem cold start | ⚠️ Cold start (~1-3s) |
| **Complexidade** | Média (ECS + ALB + NAT) | Baixa (Lambda + APIGW) |
| **Limite de execução** | Ilimitado | 15 min/request |
| **Elasticidade** | Manual/Auto Scaling | Automática |
| **Spring Boot** | ✅ Compatível nativamente | ⚠️ Requer SnapStart/GraalVM |
| **Maior custo** | NAT Gateway ($33) + ALB ($22) | RDS ($14) |

---

## Análise

### Por que o cenário Serverless é mais barato?

1. **Sem NAT Gateway** (~$33/mês de economia): Lambda pode usar VPC endpoints para acessar serviços AWS sem NAT
2. **Sem ALB** (~$22/mês de economia): API Gateway substitui o load balancer
3. **Pay-per-use**: Com 5k requests/dia, o compute é mínimo vs Fargate rodando 24/7

### Quando escolher Fargate (Cenário 1)?

- Backend Spring Boot tradicional sem adaptações para serverless
- Necessidade de conexões persistentes (WebSockets)
- Processamento longo (>15 min)
- Equipe sem experiência com Lambda
- Tráfego constante e previsível (>100k requests/dia)

### Quando escolher Serverless (Cenário 2)?

- Tráfego variável/baixo (<50k requests/dia)
- Budget limitado (startup/MVP)
- Tolerância a cold starts
- Equipe familiarizada com serverless
- Prioridade em custo operacional mínimo

---

## Recomendação para Pet Care (1.000 MAU)

> **Recomendado: Cenário 2 (Serverless)** para esta escala de uso.

Com 1.000 MAU e 5.000 requests/dia, o tráfego é baixo demais para justificar um container 24/7. A economia de ~$73/mês (79%) é significativa. Se cold starts forem um problema, considerar:

- **AWS Lambda SnapStart** para Java/Spring Boot (reduz cold start para ~200ms)
- **Provisioned Concurrency** (custo adicional, mas elimina cold starts)

### Otimizações futuras (ambos cenários)

| Otimização | Economia Estimada |
|------------|-------------------|
| Savings Plans (Fargate/Lambda) | 20-30% no compute |
| RDS Reserved Instance (1 ano) | ~35% no banco |
| S3 Intelligent-Tiering | Marginal (volume baixo) |
| CloudFront Origin Shield | Reduz requests ao origin |

---

## Notas

- Preços consultados via AWS Price List API em agosto/2026 (região us-east-1)
- Custos de transferência de dados entre serviços AWS na mesma região não incluídos (geralmente < $1/mês nesta escala)
- Free Tier não considerado (pode reduzir custos nos primeiros 12 meses)
- Cognito é gratuito para os primeiros 50.000 MAU
- Lambda Free Tier: 1M requests + 400.000 GB-s/mês grátis (cobriria 100% do uso deste cenário)
