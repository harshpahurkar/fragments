# Setup steps for working with LocalStack and DynamoDB local instead of AWS.
# Assumes aws cli is installed and LocalStack and DynamoDB local are running.

# Setup AWS environment variables
Write-Host "Setting AWS environment variables for LocalStack"

$env:AWS_ACCESS_KEY_ID = "test"
Write-Host "AWS_ACCESS_KEY_ID=test"

$env:AWS_SECRET_ACCESS_KEY = "test"
Write-Host "AWS_SECRET_ACCESS_KEY=test"

$env:AWS_SESSION_TOKEN = "test"
Write-Host "AWS_SESSION_TOKEN=test"

$env:AWS_DEFAULT_REGION = "us-east-1"
Write-Host "AWS_DEFAULT_REGION=us-east-1"

# Wait for LocalStack to be ready, by inspecting the response from healthcheck
Write-Host "Waiting for LocalStack S3..."
do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4566/_localstack/health" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.Content -match '"s3":\s*"(running|available)"') {
            break
        }
    } catch {
        # Ignore errors and keep trying
    }
    Start-Sleep -Seconds 5
} while ($true)
Write-Host "LocalStack S3 Ready"

# Create our S3 bucket with LocalStack
Write-Host "Creating LocalStack S3 bucket: fragments"
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket fragments

# Setup DynamoDB Table with dynamodb-local
Write-Host "Creating DynamoDB-Local DynamoDB table: fragments"
aws --endpoint-url=http://localhost:8000 `
    dynamodb create-table `
    --table-name fragments `
    --attribute-definitions `
        AttributeName=ownerId,AttributeType=S `
        AttributeName=id,AttributeType=S `
    --key-schema `
        AttributeName=ownerId,KeyType=HASH `
        AttributeName=id,KeyType=RANGE `
    --provisioned-throughput `
        ReadCapacityUnits=10,WriteCapacityUnits=5

# Wait until the Fragments table exists in dynamodb-local
Write-Host "Waiting for DynamoDB table to be ready..."
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name fragments
Write-Host "Setup complete!"
