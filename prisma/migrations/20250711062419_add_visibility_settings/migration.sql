-- AlterTable
ALTER TABLE "diaries" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "galleries" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "plants" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_profile_public" BOOLEAN NOT NULL DEFAULT true;
