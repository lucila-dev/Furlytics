# Furlytics

Pet Behaviour & Health Intelligence Platform. Log incidents, detect patterns, get structured AI insights, and prepare summaries for vets.

## Stack

- **Next.js** (App Router) + TypeScript
- **PostgreSQL** (Neon) + Prisma
- **Neon Auth** (email + password, email verification required)
- **OpenAI** (single controlled call for insights)
- **Tailwind CSS**

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Neon**

   - Create a Neon project and copy `DATABASE_URL`
   - In Neon Console → **Auth** → **Enable Auth**
   - Enable **Sign-up with Email** and **Verify at Sign-up** (verification **codes**)
   - Copy **Auth URL** as `NEON_AUTH_BASE_URL`
   - Add your site domain under Auth trusted domains (e.g. `localhost:3000`, your Vercel URL)

3. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – Neon Postgres connection string
   - `NEON_AUTH_BASE_URL` – from Neon Auth configuration
   - `NEON_AUTH_COOKIE_SECRET` – e.g. `openssl rand -base64 32`
   - `OPENAI_API_KEY` – for “Generate Insight” (optional for local; insight API returns 503 if missing)

4. **Database**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Register, verify the email code, then use the app.

## Deploy (Vercel)

1. Connect the repo to Vercel.
2. Set environment variables: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `OPENAI_API_KEY`.
3. Add your production domain in Neon Auth trusted domains.
4. Build command: `npx prisma generate && next build`

## Features

- **Auth**: Register / login via Neon Auth; email must be verified (OTP) before access.
- **Pets**: List and view pets.
- **Incidents**: Log symptoms/behaviour with optional flags (vomiting, lethargy, etc.); timeline per pet with severity (green/amber/red).
- **AI Insight**: On “Generate Insight”, one OpenAI call returns structured JSON (category, urgency, causes, advice, vet questions); stored in DB and shown in a card layout.
- **Patterns**: Recurring symptom detection (e.g. 3+ same symptom in 7 days), escalation detection, time-of-day summary, symptom heatmap by week.
- **Dashboard**: Pet cards, pattern alerts, recent incidents, 6-week symptom overview.
