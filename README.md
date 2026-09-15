# Production Issue Resolver Frontend

React frontend for two projects:

- **Production Issue Resolver** — submit incidents and view diagnoses from the Java orchestrator
- **Daily Task Tracker** — view AI-summarized daily work from team git commits

Sign in with your user ID and password, then switch between projects anytime from the header.

## Prerequisites

- Node.js 18+
- Java backend on port **8099** (Production Issue Resolver) — see [production-issue-resolver-poc](../production-issue-resolver-poc/README.md)
- Daily Task Tracker API on port **8100** — see [daily-timesheet-generator/backend](../daily-timesheet-generator/backend)
- Python agent on port **8098** (AI summarization) — see [production-issue-resolver-agent](../production-issue-resolver-agent/README.md)

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

In development, Vite proxies `/api` → `8099` and `/tracker-api` → `8100`, so you do not need to set base URL env vars.

## Login

Default credentials (configured in timesheet backend `.env`):

- User ID: `mohit.bisht`
- Password: `@@Test123`

After login, choose **Production Issue Resolver** or **Daily Task Tracker** from the project switcher.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | _(empty)_ | Issue resolver API base. Leave empty in dev to use the Vite proxy. |
| `VITE_TRACKER_API_BASE_URL` | _(empty)_ | Daily Task Tracker API base. Leave empty in dev to use the Vite proxy. |

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
