# Infraestrutura AWS — Outputs do Terraform

> **Ambiente:** dev
> **Região:** us-east-1
> **Provisionado em:** Agosto 2026
> **Terraform version:** 1.9.8
> **State serial:** 53

---

## VPC & Networking

| Output | Valor |
|--------|-------|
| VPC ID | `vpc-0e53f4f3f32cba07d` |
| Public Subnets | `subnet-0534ddf01728f2e10`, `subnet-002baac937eeb75ee` |
| Private Subnets | `subnet-0c88742a03d8f603b`, `subnet-08bcb309ec7106f79` |

---

## ECS Fargate (Backend)

| Output | Valor |
|--------|-------|
| ECS Cluster ARN | `arn:aws:ecs:us-east-1:239510186777:cluster/petcare-dev-cluster` |
| ECS Service Name | `petcare-dev-backend` |
| ALB DNS Name | `petcare-dev-alb-1474326495.us-east-1.elb.amazonaws.com` |
| ALB URL | `http://petcare-dev-alb-1474326495.us-east-1.elb.amazonaws.com` |

---

## RDS PostgreSQL

| Output | Valor |
|--------|-------|
| RDS Endpoint | `petcare-dev-db.c8r0ekk0iwbl.us-east-1.rds.amazonaws.com:5432` |
| RDS Instance ARN | `arn:aws:rds:us-east-1:239510186777:db:petcare-dev-db` |

---

## S3 Buckets

| Output | Valor |
|--------|-------|
| Photos Bucket Name | `petcare-dev-photos` |
| Photos Bucket ARN | `arn:aws:s3:::petcare-dev-photos` |
| Frontend Bucket Name | `petcare-dev-frontend` |
| Frontend Website Endpoint | `petcare-dev-frontend.s3-website-us-east-1.amazonaws.com` |

---

## Cognito (Auth)

| Output | Valor |
|--------|-------|
| User Pool ID | `us-east-1_FCy1dDeJL` |
| App Client ID | `6e6ae8emf6ii6duhrnb5e9ldok` |
| Cognito Domain | `petcare-dev` |

---

## SQS (Mensageria)

| Output | Valor |
|--------|-------|
| Queue URL | `https://sqs.us-east-1.amazonaws.com/239510186777/petcare-dev-appointments` |
| Queue ARN | `arn:aws:sqs:us-east-1:239510186777:petcare-dev-appointments` |

---

## CloudWatch (Monitoramento)

| Output | Valor |
|--------|-------|
| Backend Log Group | `/petcare/dev/backend` |

---

## Como usar estes valores

### No application.yml do backend (Spring Boot)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://petcare-dev-db.c8r0ekk0iwbl.us-east-1.rds.amazonaws.com:5432/petcare

aws:
  region: us-east-1
  s3:
    photos-bucket: petcare-dev-photos
  sqs:
    appointments-queue: https://sqs.us-east-1.amazonaws.com/239510186777/petcare-dev-appointments
  cognito:
    user-pool-id: us-east-1_FCy1dDeJL
    client-id: 6e6ae8emf6ii6duhrnb5e9ldok
```

### Para destruir os recursos

```bash
cd infra/terraform
terraform destroy -var-file="terraform.tfvars"
```

> ⚠️ **Importante:** Destruir ao final do treinamento para evitar custos recorrentes (~$92/mês no cenário Fargate).
