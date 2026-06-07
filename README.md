# Portfolio Frontend

Next.js frontend for the portfolio CI/CD demo. It renders dynamic projects, blog posts, certifications, and a demo admin area that talks to the FastAPI backend.

## Local Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/` portfolio overview
- `/projects` project gallery
- `/projects/[slug]` project detail
- `/blog` blog list
- `/blog/[slug]` blog detail
- `/certifications` certifications
- `/admin` demo content management and uploads
- `/api/health` health endpoint for deployment checks

## Scripts

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## CI/CD Demo

The workflow runs linting, type checks, unit tests, self-hosted SonarQube scan, npm audit, Docker build, Trivy image scan, Docker Hub push, SSH deployment, health checks, and a generic webhook notification.

Required secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_PORT`
- `VPS_SSH_KEY`
- `SONAR_HOST_URL`
- `SONAR_TOKEN`
- `DEPLOY_WEBHOOK_URL`
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
