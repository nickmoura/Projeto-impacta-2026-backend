/*
  Warnings:

  - You are about to drop the column `clinic_id` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_clinic_id_fkey`;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `clinic_id`,
    DROP COLUMN `endereco`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_user_id_key` ON `Patient`(`user_id`);

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
