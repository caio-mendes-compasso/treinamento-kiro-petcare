output "db_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "db_instance_id" {
  value = aws_db_instance.main.identifier
}

output "db_instance_arn" {
  value = aws_db_instance.main.arn
}

output "db_security_group_id" {
  value = aws_security_group.rds.id
}
