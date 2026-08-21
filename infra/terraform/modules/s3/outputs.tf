output "photos_bucket_name" {
  value = aws_s3_bucket.photos.bucket
}

output "photos_bucket_arn" {
  value = aws_s3_bucket.photos.arn
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "frontend_bucket_arn" {
  value = aws_s3_bucket.frontend.arn
}

output "frontend_website_endpoint" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}
