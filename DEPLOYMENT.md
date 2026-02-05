# Deployment Guide for Azure (Free Tier)

This guide outlines how to deploy the Kids Bible Platform to Azure, leveraging their free tier offerings where possible.

## 1. Prerequisites

- **Azure Account**: Sign up for a free account.
- **Azure CLI**: Installed on your local machine.
- **Docker**: Installed locally.

## 2. Infrastructure Overview

We will use:
- **Azure App Service (Free Tier F1)**: For hosting the Backend API and Frontend (Dockerized).
  - *Note: F1 tier is shared infrastructure. For production with custom domains and SSL, you might eventually upgrade to Basic (B1).*
- **Azure Database for PostgreSQL (Flexible Server)**:
  - Azure offers a "Free Trial" for 12 months for Flexible Server with burstable compute (B1ms), 32GB storage.
  - *Alternative*: If the managed service is too expensive after the trial, you can run a PostgreSQL container alongside your app in a Container Group or VM (B1s), but managed is recommended for data safety.

## 3. Deployment Steps

### Step A: Container Registry (ACR)

1.  **Create an Azure Container Registry (Basic Tier)**.
    ```bash
    az acr create --resource-group myResourceGroup --name kidsbibleacr --sku Basic
    ```
2.  **Login to ACR**:
    ```bash
    az acr login --name kidsbibleacr
    ```

### Step B: Build and Push Images

1.  **Backend**:
    ```bash
    docker build -t kidsbibleacr.azurecr.io/backend:latest ./backend
    docker push kidsbibleacr.azurecr.io/backend:latest
    ```
2.  **Frontend**:
    ```bash
    docker build -t kidsbibleacr.azurecr.io/frontend:latest ./frontend
    docker push kidsbibleacr.azurecr.io/frontend:latest
    ```

### Step C: Database Setup

1.  Create an **Azure Database for PostgreSQL - Flexible Server**.
    - **Compute**: Burstable, B1ms (Free tier eligible for 12 months).
    - **Storage**: 32 GB.
    - **Networking**: Allow public access from Azure services (checkbox).
2.  Note down the `Connection String` parameters: `host`, `user`, `password`, `database`.

### Step D: Backend Deployment (App Service)

1.  Create a **Web App for Containers** (Linux).
2.  **Plan**: Select Free (F1) or Basic (B1).
3.  **Container Settings**:
    - Image Source: Azure Container Registry.
    - Image: `backend:latest`.
4.  **Environment Variables** (Configuration -> Application Settings):
    - `DATABASE_URL`: `postgresql://user:password@host:5432/dbname?sslmode=require`
    - `SECRET_KEY`: *<your-secure-random-string>*
    - `ENVIRONMENT`: `production`
    - `CORS_ORIGINS`: *<url-of-your-frontend-app-service>*
5.  **Startup Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Step E: Frontend Deployment (App Service)

1.  Create another **Web App for Containers** (or use Static Web Apps).
    - *Static Web Apps* is actually better/cheaper for the frontend (free tier available).
    - If using App Service:
        - Image: `frontend:latest`.
        - **Port**: 80.
2.  **Configuration**:
    - If you hardcoded the API URL in the frontend build, you might need to rebuild the image with `VITE_API_URL` set to your backend's URL.
    - *Better approach*: Use Nginx in the frontend container to proxy `/api` requests to the backend, or set the API URL in the client side code to point to the backend App Service URL.

## 4. Cost Optimization Tips

- **Database**: The managed PostgreSQL is the most expensive part after the free trial.
  - *Cheapest option*: Use an **Azure VM (B1s - ~$8/month)** and run both Docker containers (App + DB) via `docker-compose` on that single VM.
  - *Setup*:
    1.  Create Ubuntu VM (B1s).
    2.  SSH into VM.
    3.  Install Docker & Docker Compose.
    4.  Copy `docker-compose.yml` to VM.
    5.  Run `docker-compose up -d`.
    6.  Open port 80 (Frontend) and 8000 (Backend) in Azure Network Security Group.

## 5. Local Testing

To test everything locally before deploying:
```bash
docker-compose up --build
```
This will start:
- Frontend at `http://localhost:5173`
- Backend at `http://localhost:8000`
- Database on port 5432
