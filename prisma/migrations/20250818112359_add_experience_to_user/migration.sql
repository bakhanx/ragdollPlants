-- AlterTable
ALTER TABLE "users" ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_activity_date" TIMESTAMP(3);
