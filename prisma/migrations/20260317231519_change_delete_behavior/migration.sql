-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_clinic_id_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_doctor_id_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_patient_id_fkey`;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_clinic_id_fkey` FOREIGN KEY (`clinic_id`) REFERENCES `Clinic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
