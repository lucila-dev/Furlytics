-- AlterTable
ALTER TABLE "Pet" ADD COLUMN IF NOT EXISTS "animal_type" TEXT;
ALTER TABLE "Pet" ADD COLUMN IF NOT EXISTS "microchip_number" TEXT;
ALTER TABLE "Pet" ADD COLUMN IF NOT EXISTS "vaccinated" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Pet" ADD COLUMN IF NOT EXISTS "last_vaccination_date" TEXT;

-- AlterEnum: add accident to IncidentCategory
DO $$ BEGIN
  ALTER TYPE "IncidentCategory" ADD VALUE IF NOT EXISTS 'accident';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN IF NOT EXISTS "symptoms" JSONB;
ALTER TABLE "Incident" ADD COLUMN IF NOT EXISTS "other_symptoms" JSONB;
ALTER TABLE "Incident" ADD COLUMN IF NOT EXISTS "report" JSONB;
