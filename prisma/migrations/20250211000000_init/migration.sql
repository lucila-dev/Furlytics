-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('symptom', 'behaviour');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('monitor', 'vet_soon', 'urgent');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "weight" DOUBLE PRECISION,
    "known_conditions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "category" "IncidentCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "appetite_loss" BOOLEAN NOT NULL DEFAULT false,
    "vomiting" BOOLEAN NOT NULL DEFAULT false,
    "lethargy" BOOLEAN NOT NULL DEFAULT false,
    "aggression" BOOLEAN NOT NULL DEFAULT false,
    "anxiety" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "behaviour_category" TEXT NOT NULL,
    "urgency_level" "UrgencyLevel" NOT NULL,
    "potential_causes" JSONB NOT NULL,
    "monitoring_advice" TEXT NOT NULL,
    "vet_questions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternAlert" (
    "id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "pattern_type" TEXT NOT NULL,
    "severity_score" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "triggered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatternAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Incident_pet_id_timestamp_idx" ON "Incident"("pet_id", "timestamp");

-- CreateIndex
CREATE INDEX "Incident_pet_id_category_idx" ON "Incident"("pet_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "AIInsight_incident_id_key" ON "AIInsight"("incident_id");

-- CreateIndex
CREATE INDEX "PatternAlert_pet_id_idx" ON "PatternAlert"("pet_id");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInsight" ADD CONSTRAINT "AIInsight_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternAlert" ADD CONSTRAINT "PatternAlert_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
