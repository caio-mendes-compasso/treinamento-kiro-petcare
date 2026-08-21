# --- VPC ---

output "vpc_id" {
  description = "ID da VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs das subnets públicas"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs das subnets privadas"
  value       = module.vpc.private_subnet_ids
}

# --- RDS ---

output "rds_endpoint" {
  description = "Endpoint do RDS PostgreSQL"
  value       = module.rds.db_endpoint
}

output "rds_instance_arn" {
  description = "ARN da instância RDS"
  value       = module.rds.db_instance_arn
}

# --- ECS ---

output "ecs_cluster_arn" {
  description = "ARN do cluster ECS"
  value       = module.ecs.cluster_arn
}

output "ecs_service_name" {
  description = "Nome do serviço ECS"
  value       = module.ecs.service_name
}

output "alb_dns_name" {
  description = "DNS do Application Load Balancer"
  value       = module.ecs.alb_dns_name
}

output "alb_url" {
  description = "URL do backend via ALB"
  value       = "http://${module.ecs.alb_dns_name}"
}

# --- S3 ---

output "s3_photos_bucket_name" {
  description = "Nome do bucket S3 para fotos"
  value       = module.s3.photos_bucket_name
}

output "s3_photos_bucket_arn" {
  description = "ARN do bucket S3 para fotos"
  value       = module.s3.photos_bucket_arn
}

output "s3_frontend_bucket_name" {
  description = "Nome do bucket S3 para frontend"
  value       = module.s3.frontend_bucket_name
}

output "s3_frontend_website_endpoint" {
  description = "Endpoint do website S3 para frontend"
  value       = module.s3.frontend_website_endpoint
}

# --- Cognito ---

output "cognito_user_pool_id" {
  description = "ID do User Pool Cognito"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "ID do App Client Cognito"
  value       = module.cognito.client_id
}

output "cognito_domain" {
  description = "Domínio do Cognito"
  value       = module.cognito.domain
}

# --- SQS ---

output "sqs_queue_url" {
  description = "URL da fila SQS de agendamentos"
  value       = module.sqs.queue_url
}

output "sqs_queue_arn" {
  description = "ARN da fila SQS de agendamentos"
  value       = module.sqs.queue_arn
}

# --- CloudWatch ---

output "cloudwatch_log_group_backend" {
  description = "Log group do backend"
  value       = module.cloudwatch.backend_log_group_name
}
