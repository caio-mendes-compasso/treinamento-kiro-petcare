resource "aws_sqs_queue" "appointments" {
  name                       = "${var.project_name}-${var.environment}-appointments"
  delay_seconds              = 0
  max_message_size           = 262144
  message_retention_seconds  = 1209600 # 14 days
  receive_wait_time_seconds  = 10      # Long polling
  visibility_timeout_seconds = 60

  tags = {
    Name = "${var.project_name}-${var.environment}-appointments-queue"
  }
}

resource "aws_sqs_queue" "appointments_dlq" {
  name                      = "${var.project_name}-${var.environment}-appointments-dlq"
  message_retention_seconds = 1209600 # 14 days

  tags = {
    Name = "${var.project_name}-${var.environment}-appointments-dlq"
  }
}

resource "aws_sqs_queue_redrive_policy" "appointments" {
  queue_url = aws_sqs_queue.appointments.id
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.appointments_dlq.arn
    maxReceiveCount     = 3
  })
}
