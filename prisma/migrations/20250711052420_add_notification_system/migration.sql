/*
  Warnings:

  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notifications` table. All the data in the column will be lost.
  - The `type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `recipient_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GENERAL', 'ADMIN_MESSAGE', 'PLANT_CARE_WATER', 'PLANT_CARE_NUTRIENT', 'NEW_ARTICLE', 'NEW_COMMENT', 'CONTENT_LIKED', 'UPLOAD_SUCCESS', 'UPLOAD_FAILED', 'REPORT_STATUS_CHANGED');

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "data",
DROP COLUMN "user_id",
ADD COLUMN     "actor_id" TEXT,
ADD COLUMN     "article_id" INTEGER,
ADD COLUMN     "comment_id" TEXT,
ADD COLUMN     "diary_id" TEXT,
ADD COLUMN     "gallery_id" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "plant_id" TEXT,
ADD COLUMN     "recipient_id" TEXT NOT NULL,
ADD COLUMN     "report_id" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'GENERAL';

-- CreateIndex
CREATE INDEX "notifications_recipient_id_is_read_created_at_idx" ON "notifications"("recipient_id", "is_read", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
