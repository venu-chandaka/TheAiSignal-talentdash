-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L3', 'L4', 'L5', 'L6', 'SDE_I', 'SDE_II', 'SDE_III', 'STAFF', 'PRINCIPAL', 'IC4', 'IC5');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD', 'GBP', 'EUR');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "industry" TEXT,
    "headquarters" TEXT,
    "foundedYear" INTEGER,
    "headcountRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "location" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "baseSalary" BIGINT NOT NULL,
    "bonus" BIGINT NOT NULL DEFAULT 0,
    "stock" BIGINT NOT NULL DEFAULT 0,
    "totalCompensation" BIGINT NOT NULL,
    "source" "Source" NOT NULL,
    "confidenceScore" DECIMAL(3,2) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_normalizedName_idx" ON "Company"("normalizedName");

-- CreateIndex
CREATE INDEX "Salary_companyId_level_location_idx" ON "Salary"("companyId", "level", "location");

-- CreateIndex
CREATE INDEX "Salary_totalCompensation_idx" ON "Salary"("totalCompensation");

-- CreateIndex
CREATE INDEX "Salary_submittedAt_idx" ON "Salary"("submittedAt");

-- CreateIndex
CREATE INDEX "Salary_location_level_idx" ON "Salary"("location", "level");

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
