output "backend_log_group_name" {
  value = aws_cloudwatch_log_group.backend.name
}

output "application_log_group_name" {
  value = aws_cloudwatch_log_group.application.name
}

output "alarms_topic_arn" {
  value = aws_sns_topic.alarms.arn
}
