-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `profile` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `settings` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Organization_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Membership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `role` ENUM('OWNER', 'ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Membership_userId_idx`(`userId`),
    UNIQUE INDEX `Membership_orgId_userId_key`(`orgId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vocabulary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `meta` JSON NULL,

    INDEX `Vocabulary_orgId_name_idx`(`orgId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Term` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vocabularyId` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `parentId` INTEGER NULL,

    INDEX `Term_vocabularyId_idx`(`vocabularyId`),
    INDEX `Term_parentId_idx`(`parentId`),
    UNIQUE INDEX `Term_vocabularyId_slug_key`(`vocabularyId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `authorId` INTEGER NULL,
    `type` ENUM('MCQ_SINGLE', 'MCQ_MULTI', 'TRUE_FALSE', 'SHORT_TEXT', 'LONG_TEXT', 'FILE_UPLOAD', 'CODE') NOT NULL,
    `content` JSON NOT NULL,
    `answer` JSON NULL,
    `difficulty` INTEGER NULL,
    `tags` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    INDEX `Item_orgId_idx`(`orgId`),
    INDEX `Item_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemTerm` (
    `itemId` INTEGER NOT NULL,
    `termId` INTEGER NOT NULL,

    INDEX `ItemTerm_termId_idx`(`termId`),
    PRIMARY KEY (`itemId`, `termId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Form` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `authorId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `config` JSON NULL,
    `durationSec` INTEGER NULL,
    `opensAt` DATETIME(3) NULL,
    `closesAt` DATETIME(3) NULL,
    `accessMeta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Form_orgId_idx`(`orgId`),
    INDEX `Form_authorId_idx`(`authorId`),
    INDEX `Form_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormItem` (
    `formId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `points` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    `order` INTEGER NOT NULL DEFAULT 0,
    `meta` JSON NULL,

    INDEX `FormItem_itemId_idx`(`itemId`),
    PRIMARY KEY (`formId`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormTerm` (
    `formId` INTEGER NOT NULL,
    `termId` INTEGER NOT NULL,

    INDEX `FormTerm_termId_idx`(`termId`),
    PRIMARY KEY (`formId`, `termId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Classroom_orgId_name_idx`(`orgId`, `name`),
    UNIQUE INDEX `Classroom_orgId_code_key`(`orgId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `classroomId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `role` ENUM('OWNER', 'ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Enrollment_orgId_idx`(`orgId`),
    INDEX `Enrollment_userId_idx`(`userId`),
    UNIQUE INDEX `Enrollment_classroomId_userId_key`(`classroomId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `classroomId` INTEGER NOT NULL,
    `formId` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `instructions` VARCHAR(191) NULL,
    `openAt` DATETIME(3) NULL,
    `closeAt` DATETIME(3) NULL,
    `durationSec` INTEGER NULL,
    `attemptsLimit` INTEGER NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Assignment_orgId_idx`(`orgId`),
    INDEX `Assignment_classroomId_idx`(`classroomId`),
    INDEX `Assignment_formId_idx`(`formId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attempt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `formId` INTEGER NOT NULL,
    `assignmentId` INTEGER NULL,
    `status` ENUM('IN_PROGRESS', 'SUBMITTED', 'GRADED', 'CANCELLED') NOT NULL DEFAULT 'IN_PROGRESS',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `submittedAt` DATETIME(3) NULL,
    `gradedAt` DATETIME(3) NULL,
    `responses` JSON NULL,
    `proctorLog` JSON NULL,
    `grading` JSON NULL,
    `score` DECIMAL(10, 2) NULL,

    INDEX `Attempt_orgId_idx`(`orgId`),
    INDEX `Attempt_userId_idx`(`userId`),
    INDEX `Attempt_formId_idx`(`formId`),
    INDEX `Attempt_assignmentId_idx`(`assignmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `buyerId` INTEGER NOT NULL,
    `formId` INTEGER NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Purchase_orgId_idx`(`orgId`),
    INDEX `Purchase_buyerId_idx`(`buyerId`),
    INDEX `Purchase_formId_idx`(`formId`),
    UNIQUE INDEX `Purchase_buyerId_formId_key`(`buyerId`, `formId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomFieldDef` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `scope` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `options` JSON NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CustomFieldDef_orgId_idx`(`orgId`),
    UNIQUE INDEX `CustomFieldDef_orgId_scope_key_key`(`orgId`, `scope`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomFieldVal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orgId` INTEGER NOT NULL,
    `defId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `classroomId` INTEGER NULL,
    `formId` INTEGER NULL,
    `value` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CustomFieldVal_orgId_idx`(`orgId`),
    INDEX `CustomFieldVal_defId_idx`(`defId`),
    INDEX `CustomFieldVal_userId_idx`(`userId`),
    INDEX `CustomFieldVal_classroomId_idx`(`classroomId`),
    INDEX `CustomFieldVal_formId_idx`(`formId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vocabulary` ADD CONSTRAINT `Vocabulary_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Term` ADD CONSTRAINT `Term_vocabularyId_fkey` FOREIGN KEY (`vocabularyId`) REFERENCES `Vocabulary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Term` ADD CONSTRAINT `Term_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Term`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTerm` ADD CONSTRAINT `ItemTerm_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTerm` ADD CONSTRAINT `ItemTerm_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Form` ADD CONSTRAINT `Form_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Form` ADD CONSTRAINT `Form_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormItem` ADD CONSTRAINT `FormItem_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormItem` ADD CONSTRAINT `FormItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormTerm` ADD CONSTRAINT `FormTerm_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormTerm` ADD CONSTRAINT `FormTerm_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classroom` ADD CONSTRAINT `Classroom_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldDef` ADD CONSTRAINT `CustomFieldDef_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldVal` ADD CONSTRAINT `CustomFieldVal_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldVal` ADD CONSTRAINT `CustomFieldVal_defId_fkey` FOREIGN KEY (`defId`) REFERENCES `CustomFieldDef`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldVal` ADD CONSTRAINT `CustomFieldVal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldVal` ADD CONSTRAINT `CustomFieldVal_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `Classroom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldVal` ADD CONSTRAINT `CustomFieldVal_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
