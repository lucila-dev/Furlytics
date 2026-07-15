# Furlytics

Pet Behaviour & Health Intelligence Platform. Log incidents, detect patterns, get structured AI insights, and prepare summaries for vets.

## Stack

- **Next.js** (App Router) + TypeScript
- **PostgreSQL** + Prisma
- **NextAuth** (credentials)
- **OpenAI** (single controlled call for insights)
- **Tailwind CSS**

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string (e.g. Supabase, Railway, or local)
   - `NEXTAUTH_SECRET` – e.g. `openssl rand -base64 32`
   - `NEXTAUTH_URL` – `http://localhost:3000` (dev) or your production URL
   - `OPENAI_API_KEY` – for “Generate Insight” (optional for local; insight API returns 503 if missing)

3. **Database**

   ```bash
   npx prisma migrate deploy
   # or for dev with shadow DB:
   npx prisma migrate dev
   ```

   Seed a demo user and pet (optional):

   ```bash
   npx prisma db seed
   # Login: demo@furlytics.app / demo123
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign up or use the seeded account.

## Deploy (Vercel)

1. Connect the repo to Vercel.
2. Set environment variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (production URL), `OPENAI_API_KEY`.
3. Use a Postgres provider (Vercel Postgres, Supabase, or Railway); run migrations in the build step or via a deploy hook:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

   In Vercel, add a build command that runs `prisma generate` (e.g. `prisma generate && next build`) and ensure `DATABASE_URL` is available at build time if you run migrations in CI.

## Features

- **Auth**: Register / login (email + password).
- **Pets**: List and view pets.
- **Incidents**: Log symptoms/behaviour with optional flags (vomiting, lethargy, etc.); timeline per pet with severity (green/amber/red).
- **AI Insight**: On “Generate Insight”, one OpenAI call returns structured JSON (category, urgency, causes, advice, vet questions); stored in DB and shown in a card layout.
- **Patterns**: Recurring symptom detection (e.g. 3+ same symptom in 7 days), escalation detection, time-of-day summary, symptom heatmap by week.
- **Dashboard**: Pet cards, pattern alerts, recent incidents, 6-week symptom overview.
