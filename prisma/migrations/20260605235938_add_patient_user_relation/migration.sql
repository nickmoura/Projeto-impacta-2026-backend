/*
  Warnings:

  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Patient_email_key` ON `Patient`;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `email`,
    DROP COLUMN `nome`,
    DROP COLUMN `telefone`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_user_id_key` ON `Patient`(`user_id`);

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
