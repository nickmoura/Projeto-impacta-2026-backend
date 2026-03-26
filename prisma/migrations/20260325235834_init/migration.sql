/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Patient_email_key` ON `Patient`(`email`);

-- RenameIndex
ALTER TABLE `Appointment` RENAME INDEX `Appointment_patient_id_fkey` TO `Appointment_patient_id_idx`;
