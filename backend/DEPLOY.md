# Backend Deployment — AWS ECS (Fargate)

## Prerequisites

```bash
aws configure   # enter Access Key, Secret, region (us-east-1)
aws sts get-caller-identity   # verify
```

---

## Step 1 — Create an ECR repository

```bash
aws ecr create-repository --repository-name lost-and-found-api --region us-east-1
```

Note the `repositoryUri` in the response:
```
123456789.dkr.ecr.us-east-1.amazonaws.com/lost-and-found-api
```

---

## Step 2 — Build and push the image

Run from inside `backend/`:

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    123456789.dkr.ecr.us-east-1.amazonaws.com

# Build (--platform flag required on Apple Silicon)
docker build --platform linux/amd64 -t lost-and-found-api .

# Tag
docker tag lost-and-found-api:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/lost-and-found-api:latest

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/lost-and-found-api:latest
```

---

## Step 3 — Create the ECS cluster

```bash
aws ecs create-cluster --cluster-name lost-and-found --region us-east-1
```

---

## Step 4 — Store secrets in SSM Parameter Store

Never put sensitive values in plain environment variables. Store them in SSM:

```bash
aws ssm put-parameter \
  --name "/laf/DATABASE_URL" \
  --value "postgresql://user:pass@host/db?sslmode=require" \
  --type SecureString

aws ssm put-parameter \
  --name "/laf/SESSION_SECRET" \
  --value "your-64-char-secret" \
  --type SecureString

# Create the CloudWatch log group
aws logs create-log-group --log-group-name /ecs/lost-and-found-api
```

---

## Step 5 — IAM roles

If the roles don't exist yet, create them in the IAM console with `ecs-tasks.amazonaws.com` as the trusted service, then attach these policies:

```bash
# ecsTaskExecutionRole — lets ECS pull images and read SSM secrets
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess

# ecsTaskRole — lets the running container call SES (no hardcoded keys needed)
aws iam attach-role-policy \
  --role-name ecsTaskRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
```

---

## Step 6 — Register the task definition

Create `task-definition.json` (replace `ACCOUNT_ID` and the values marked below):

```json
{
  "family": "lost-and-found-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lost-and-found-api:latest",
      "portMappings": [{ "containerPort": 4000, "protocol": "tcp" }],
      "essential": true,
      "environment": [
        { "name": "NODE_ENV",        "value": "production" },
        { "name": "PORT",            "value": "4000" },
        { "name": "AWS_REGION",      "value": "us-east-1" },
        { "name": "SES_FROM_EMAIL",  "value": "noreply@yourdomain.com" },
        { "name": "ALLOWED_ORIGINS", "value": "https://your-app.vercel.app" }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:ssm:us-east-1:ACCOUNT_ID:parameter/laf/DATABASE_URL"
        },
        {
          "name": "SESSION_SECRET",
          "valueFrom": "arn:aws:ssm:us-east-1:ACCOUNT_ID:parameter/laf/SESSION_SECRET"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lost-and-found-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register it:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

---

## Step 7 — Create the service

```bash
aws ecs create-service \
  --cluster lost-and-found \
  --service-name api \
  --task-definition lost-and-found-api \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-XXXXX],securityGroups=[sg-XXXXX],assignPublicIp=ENABLED}"
```

Use your default VPC's subnet and security group IDs (find them in the EC2 console or via `aws ec2 describe-subnets`). The security group needs **inbound TCP 4000** open.

---

## Step 8 — Get the public IP

```bash
# Get the task ARN
aws ecs list-tasks --cluster lost-and-found --service-name api

# Get the ENI and public IP
aws ecs describe-tasks \
  --cluster lost-and-found \
  --tasks <task-arn> \
  --query "tasks[0].attachments[0].details"
```

Then set the following in your Vercel project's environment variables:

```
API_URL=http://<public-ip>:4000
SESSION_SECRET=<same value as backend>
```

> For production, put an Application Load Balancer in front for a stable DNS name and HTTPS. For coursework, the public IP is sufficient.

---

## Redeploying after code changes

```bash
# Rebuild and push
docker build --platform linux/amd64 -t lost-and-found-api . && \
docker tag lost-and-found-api:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lost-and-found-api:latest && \
docker push \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lost-and-found-api:latest

# Tell ECS to pull the new image
aws ecs update-service --cluster lost-and-found --service api --force-new-deployment
```

---

## Architecture summary

```
Vercel (Next.js)
  └── server actions → HTTP → ECS Fargate (Express API :4000)
                                  ├── Neon Postgres (via DATABASE_URL)
                                  └── AWS SES (email notifications)
```
