# --- General ---

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "petcare"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile (SSO)"
  type        = string
  default     = "petcare"
}

# --- VPC ---

variable "vpc_cidr" {
  description = "CIDR block da VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "CIDRs das subnets públicas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "CIDRs das subnets privadas"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "Availability Zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# --- RDS ---

variable "db_instance_class" {
  description = "Classe da instância RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Armazenamento do RDS em GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "petcare"
}

variable "db_username" {
  description = "Usuário master do banco"
  type        = string
  default     = "petcare_admin"
  sensitive   = true
}

variable "db_password" {
  description = "Senha master do banco"
  type        = string
  sensitive   = true
}

variable "db_multi_az" {
  description = "Habilitar Multi-AZ para RDS"
  type        = bool
  default     = false
}

# --- ECS / Fargate ---

variable "container_image" {
  description = "Imagem Docker do backend (ECR URI ou Docker Hub)"
  type        = string
  default     = "petcare/backend:latest"
}

variable "container_port" {
  description = "Porta exposta pelo container"
  type        = number
  default     = 8080
}

variable "fargate_cpu" {
  description = "CPU para a task Fargate (em unidades: 256=0.25vCPU, 512=0.5vCPU)"
  type        = number
  default     = 512
}

variable "fargate_memory" {
  description = "Memória para a task Fargate (em MB)"
  type        = number
  default     = 1024
}

variable "fargate_desired_count" {
  description = "Número desejado de tasks rodando"
  type        = number
  default     = 1
}

# --- Cognito ---

variable "cognito_callback_urls" {
  description = "URLs de callback para o Cognito"
  type        = list(string)
  default     = ["http://localhost:3000/api/auth/callback"]
}

variable "cognito_logout_urls" {
  description = "URLs de logout para o Cognito"
  type        = list(string)
  default     = ["http://localhost:3000"]
}

# --- CloudWatch ---

variable "alarm_email" {
  description = "Email para notificações de alarmes"
  type        = string
  default     = ""
}
