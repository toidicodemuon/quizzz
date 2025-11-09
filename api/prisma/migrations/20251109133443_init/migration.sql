/*
  Warnings:

  - You are about to drop the column `subject` on the `exam` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `question` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Exam_subject_idx` ON `exam`;

-- DropIndex
DROP INDEX `Question_subject_type_idx` ON `question`;

-- AlterTable
ALTER TABLE `exam` DROP COLUMN `subject`;

-- AlterTable
ALTER TABLE `question` DROP COLUMN `subject`,
    ADD COLUMN `subjectId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,

    UNIQUE INDEX `Subject_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Question_subjectId_type_idx` ON `Question`(`subjectId`, `type`);

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
