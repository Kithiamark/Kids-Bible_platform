# AWS Free Tier Deployment

This project is easiest to run on AWS free tier as:

- Frontend: S3 static website, optionally CloudFront for HTTPS/custom domain.
- Backend: Elastic Beanstalk single-instance Docker environment.
- Database: Amazon RDS PostgreSQL free tier.

## 1. Build Checks

Run these before deploying:

```bash
cd frontend
npm ci
npm run build
npm audit

cd ../backend
python -m pip install -r requirements.txt
python -m pytest
```

## 2. Database

Create an RDS PostgreSQL instance:

- Engine: PostgreSQL
- Template: Free tier
- Instance: `db.t3.micro` or the current AWS free-tier micro option
- Storage: 20 GB gp2/gp3
- Public access: only if you cannot use VPC access from Elastic Beanstalk

Save the connection string in this format:

```text
postgresql+psycopg2://USERNAME:PASSWORD@HOSTNAME:5432/DB_NAME?sslmode=require
```

## 3. Backend on Elastic Beanstalk

From the `backend` folder:

```bash
pip install awsebcli
eb init kids-bible-backend --platform docker --region us-east-1
eb create kids-bible-prod --single --instance_type t3.micro
```

Set environment variables:

```bash
eb setenv \
  ENVIRONMENT=production \
  API_VERSION=v1 \
  SECRET_KEY=replace-with-32-plus-random-characters \
  DATABASE_URL='postgresql+psycopg2://USERNAME:PASSWORD@HOSTNAME:5432/DB_NAME?sslmode=require' \
  CORS_ORIGINS='https://YOUR_FRONTEND_DOMAIN' \
  ALLOWED_HOSTS='YOUR_BACKEND_DOMAIN,*.elasticbeanstalk.com'
```

Run migrations after the environment is live:

```bash
eb ssh
cd /var/app/current
alembic upgrade head
```

Health check endpoint:

```text
https://YOUR_BACKEND_DOMAIN/health
```

## 4. Frontend on S3

Build with the backend API URL:

```bash
cd frontend
npm ci
npm run build -- --mode production
```

If the backend is at `https://api.example.com/api/v1`, create `frontend/.env.production` before building:

```text
VITE_API_BASE_URL=https://api.example.com/api/v1
```

Create and sync an S3 bucket:

```bash
aws s3 mb s3://YOUR_FRONTEND_BUCKET
aws s3 sync dist/ s3://YOUR_FRONTEND_BUCKET --delete
aws s3 website s3://YOUR_FRONTEND_BUCKET --index-document index.html --error-document index.html
```

For production HTTPS, put CloudFront in front of the bucket and point `CORS_ORIGINS` to the CloudFront/custom-domain URL.

## 5. Low-Cost Notes

- Stop non-production Elastic Beanstalk and RDS resources when idle.
- Keep one backend instance and one small RDS instance for free-tier eligibility.
- Use S3/CloudFront for the frontend instead of a second server.
- Keep media uploads in S3 later; do not store user uploads on the backend container filesystem.
