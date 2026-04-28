-- DropForeignKey
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
