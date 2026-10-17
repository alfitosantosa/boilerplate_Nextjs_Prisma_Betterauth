-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- Rename tenant columns
ALTER TABLE "user" RENAME COLUMN "foundationId" TO "clientId";
ALTER TABLE "user_data" RENAME COLUMN "foundationId" TO "clientId";
ALTER TABLE "roles" RENAME COLUMN "foundationId" TO "clientId";
ALTER TABLE "announcements" RENAME COLUMN "foundationId" TO "clientId";
ALTER TABLE "branchs" RENAME TO "branches";
ALTER TABLE "branches" RENAME COLUMN "foundationId" TO "clientId";

-- Existing tenants have no matching client row: force onboarding.
UPDATE "user" SET "clientId" = NULL;
UPDATE "user_data" SET "clientId" = NULL;
UPDATE "roles" SET "clientId" = NULL;

-- Replace indexes/constraints with clientId names
DROP INDEX IF EXISTS "user_foundationId_idx";
DROP INDEX IF EXISTS "user_data_foundationId_idx";
DROP INDEX IF EXISTS "roles_foundationId_idx";
DROP INDEX IF EXISTS "announcements_foundationId_idx";
DROP INDEX IF EXISTS "branchs_foundationId_idx";

CREATE INDEX "user_clientId_idx" ON "user"("clientId");
CREATE INDEX "user_data_clientId_idx" ON "user_data"("clientId");
CREATE INDEX "roles_clientId_idx" ON "roles"("clientId");
CREATE INDEX "announcements_clientId_idx" ON "announcements"("clientId");
CREATE INDEX "branches_clientId_idx" ON "branches"("clientId");

ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "roles_foundationId_name_key";
ALTER TABLE "roles" ADD CONSTRAINT "roles_clientId_name_key" UNIQUE ("clientId", "name");

ALTER TABLE "branches" DROP CONSTRAINT IF EXISTS "branchs_foundationId_code_key";
ALTER TABLE "branches" ADD CONSTRAINT "branches_clientId_code_key" UNIQUE ("clientId", "code");

ALTER INDEX IF EXISTS "branchs_pkey" RENAME TO "branches_pkey";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "roles" ADD CONSTRAINT "roles_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "branches" ADD CONSTRAINT "branches_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
