/*
  Warnings:

  - You are about to drop the `user_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_userId_fkey";

-- DropTable
DROP TABLE "user_tokens";
