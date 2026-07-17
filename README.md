# Furlytics

Furlytics is a pet behaviour and health tracking web app. Pet owners log incidents (symptoms, behaviour, and accidents), spot patterns over time, and generate clear, vet-ready summaries — so they can walk into an appointment with the full picture.

## What it does

- **Pets** – Keep a profile for each pet with name, animal type, breed, age, weight, microchip, vaccination info, and known conditions.
- **Incidents** – Log symptoms, behaviour changes, or accidents with optional signs (vomiting, lethargy, anxiety, and more) and notes, timestamped per pet.
- **AI insights** – Turn an incident into a structured report: summary, potential causes, possible conditions, monitoring advice, urgency, and when to see a vet.
- **Patterns** – See recurring symptoms and a symptom overview over recent weeks.
- **Dashboard** – A single place for your pets, recent incidents, recent reports, and spotted patterns.
- **Quick chat** – A friendly assistant for quick questions about your pet.
- **Accounts** – Sign in with email and password (email verification required); your pets and incidents are tied to your account and sync across devices.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **React** + **Tailwind CSS**
- **PostgreSQL** (Neon) + **Prisma**
- **Neon Auth** (email/password with email verification)
- **OpenAI** (AI reports and chat)
- Deployed on **Vercel**
