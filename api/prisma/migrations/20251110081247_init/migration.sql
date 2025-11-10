/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `exam` ADD COLUMN `code` VARCHAR(191) NULL,
    ADD COLUMN `examType` ENUM('PRACTICE', 'MIDTERM', 'FINAL', 'MOCK', 'MOS_DRILL', 'PLACEMENT') NOT NULL DEFAULT 'PRACTICE',
    ADD COLUMN `feedbackMode` ENUM('NONE', 'AFTER_SUBMIT', 'DETAILED') NOT NULL DEFAULT 'DETAILED',
    ADD COLUMN `passMarkPercent` INTEGER NULL,
    ADD COLUMN `reviewWindowMin` INTEGER NULL,
    ADD COLUMN `scoringMode` ENUM('STANDARD', 'PARTIAL_CREDIT', 'NEGATIVE_MARKING') NOT NULL DEFAULT 'STANDARD',
    ADD COLUMN `showCorrectAnswers` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showExplanation` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showScoreImmediately` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `subjectId` INTEGER NULL,
    ADD COLUMN `totalPoints` DECIMAL(8, 2) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Exam_code_key` ON `Exam`(`code`);

-- CreateIndex
CREATE INDEX `Exam_subjectId_idx` ON `Exam`(`subjectId`);

-- CreateIndex
CREATE INDEX `Exam_status_idx` ON `Exam`(`status`);

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
