output "queue_url" {
  value = aws_sqs_queue.appointments.url
}

output "queue_arn" {
  value = aws_sqs_queue.appointments.arn
}

output "dlq_url" {
  value = aws_sqs_queue.appointments_dlq.url
}

output "dlq_arn" {
  value = aws_sqs_queue.appointments_dlq.arn
}
