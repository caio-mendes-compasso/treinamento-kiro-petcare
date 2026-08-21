#!/bin/bash
echo "Initializing LocalStack resources..."

# Create S3 bucket for pet photos
awslocal s3 mb s3://petcare-photos

# Create SQS queue for appointments
awslocal sqs create-queue --queue-name petcare-appointments

echo "LocalStack initialization complete!"
