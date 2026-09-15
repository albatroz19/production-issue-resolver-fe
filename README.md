# Production Issue Resolver Frontend

React frontend for the [Production Issue Resolver POC](../production-issue-resolver-poc). Submit incident details and view structured diagnoses from the Java orchestrator at `POST /api/v1/incidents/analyze`.

## Prerequisites

- Node.js 18+
- Java backend running on port **8099** — see [production-issue-resolver-poc README](../production-issue-resolver-poc/README.md)

## Repository layout

The frontend is a **sibling** of the Java backend, not inside it:

```
Segmentation/
├── production-issue-resolver-poc/   # Java backend (Gradle, port 8099)
└── production-issue-resolver-fe/    # React frontend (npm, port 5173)
```

## Setup

```bash
cd /Users/amitasharda/Desktop/Segmentation/production-issue-resolver-fe
npm install
cp .env.example .env
```

If you are already inside `production-issue-resolver-poc`, go up one level first:

```bash
cd ../production-issue-resolver-fe
npm install
```

## Run locally

Use **two terminals**:

**Terminal 1 — backend (Java, not npm):**

```bash
cd /Users/amitasharda/Desktop/Segmentation/production-issue-resolver-poc
./gradlew bootRun
```

**Terminal 2 — frontend:**

```bash
cd /Users/amitasharda/Desktop/Segmentation/production-issue-resolver-fe
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

In development, Vite proxies `/api` to `http://localhost:8099`, so you do not need to set `VITE_API_BASE_URL`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | _(empty)_ | API base URL. Leave empty in dev to use the Vite proxy. Set to `http://localhost:8099` for direct calls (preview/production builds). |

## API key

If the backend has `POC_API_KEY` set, enter the same value in the header **API key** field. It is stored in `sessionStorage` only and sent as `X-POC-API-KEY`.

## Demo case

Click **Load demo case** to populate the golden RestTemplateUtility NPE scenario from the backend README, then **Analyze incident**.

## Build

```bash
npm run build
npm run preview
```

For preview builds, set `VITE_API_BASE_URL=http://localhost:8099` in `.env` or ensure the backend CORS config includes your origin.

## Project structure

```
src/
  api/incidents.ts       # API client
  components/            # Form, diagnosis UI, shadcn components
  hooks/                 # useAnalyzeIncident
  lib/demoIncident.ts    # Golden test case
  types/incident.ts      # TypeScript types matching backend DTOs
```
# production-issue-resolver-fe
