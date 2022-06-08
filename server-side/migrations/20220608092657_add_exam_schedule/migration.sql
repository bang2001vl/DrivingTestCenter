/*
  Warnings:

  - You are about to drop the `classschedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `examtest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `classschedule` DROP FOREIGN KEY `classschedule_classId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_examtest` DROP FOREIGN KEY `conn_employee_examtest_examTestId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `conn_student_examtest_examTestId_fkey`;

-- DropForeignKey
ALTER TABLE `examtest` DROP FOREIGN KEY `examtest_examId_fkey`;

-- DropTable
DROP TABLE `classschedule`;

-- DropTable
DROP TABLE `examtest`;

-- CreateTable
CREATE TABLE `exam _test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `dateTimeStart` DATETIME(3) NOT NULL,
    `dateTimeEnd` DATETIME(3) NOT NULL,
    `maxMember` INTEGER NOT NULL,
    `countStudent` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `location` VARCHAR(255) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `notes` VARCHAR(3000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `location` VARCHAR(255) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `notes` VARCHAR(3000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exam _test` ADD CONSTRAINT `exam _test_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_schedule` ADD CONSTRAINT `class_schedule_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_schedule` ADD CONSTRAINT `exam_schedule_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_examTestId_fkey` FOREIGN KEY (`examTestId`) REFERENCES `exam _test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_examtest` ADD CONSTRAINT `conn_employee_examtest_examTestId_fkey` FOREIGN KEY (`examTestId`) REFERENCES `exam _test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
