# Deployment & Infrastructure Guide

## 1. Local Development (Zero Docker Required)

1. Ensure Node.js &gt;= 18 and Python &gt;= 3.10 are installed.
2. Clone repository and install dependencies:
   ```bash
   npm install
   ```
3. Initialize environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Build shared libraries:
   ```bash
   npm run build:shared
   ```
5. Run backend API:
   ```bash
   npm run dev:api
   ```
6. Run frontend web application:
   ```bash
   npm run dev:web
   ```

## 2. Docker Compose Production Deployment

To start the complete containerized stack (PostgreSQL + TimescaleDB, Redis, Neo4j, Node API, Python AI Service, and Next.js Web App):

```bash
cd infrastructure/docker
docker compose up -d --build
```

### Access Points:
- Web Intelligence Dashboard: `http://localhost:3000`
- REST API Base: `http://localhost:4000`
- AI NLP Microservice: `http://localhost:5001`
- Neo4j Graph Browser: `http://localhost:7474`
- PostgreSQL Port: `5432`
- Redis Port: `6379`

