-- AlterTable
ALTER TABLE `room` ADD COLUMN `isProtected` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `password` VARCHAR(191) NULL;
