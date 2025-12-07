# Create DynamoDB table for fragments
# Run this after starting your AWS Learner Lab and configuring credentials

Write-Host "Creating DynamoDB table 'fragments'..." -ForegroundColor Yellow

$region = "us-east-1"
$tableName = "fragments"

# Check if table already exists
try {
    $existingTable = aws dynamodb describe-table --table-name $tableName --region $region 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Table 'fragments' already exists!" -ForegroundColor Green
        exit 0
    }
} catch {
    # Table doesn't exist, continue to create it
}

# Create the table
aws dynamodb create-table `
    --table-name $tableName `
    --attribute-definitions `
        AttributeName=ownerId,AttributeType=S `
        AttributeName=id,AttributeType=S `
    --key-schema `
        AttributeName=ownerId,KeyType=HASH `
        AttributeName=id,KeyType=RANGE `
    --billing-mode PAY_PER_REQUEST `
    --region $region

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ DynamoDB table 'fragments' created successfully!" -ForegroundColor Green
    Write-Host "Waiting for table to become active..." -ForegroundColor Yellow
    
    # Wait for table to be active
    aws dynamodb wait table-exists --table-name $tableName --region $region
    
    Write-Host "✅ Table is now active and ready to use!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create DynamoDB table" -ForegroundColor Red
    exit 1
}
