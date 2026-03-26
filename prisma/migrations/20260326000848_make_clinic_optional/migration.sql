-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_clinic_id_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `clinic_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_clinic_id_fkey` FOREIGN KEY (`clinic_id`) REFERENCES `Clinic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
