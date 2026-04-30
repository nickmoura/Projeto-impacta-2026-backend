/*
  Warnings:

  - Made the column `clinic_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_clinic_id_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `clinic_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_clinic_id_fkey` FOREIGN KEY (`clinic_id`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
