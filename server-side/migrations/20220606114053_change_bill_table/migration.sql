/*
  Warnings:

  - You are about to drop the column `billDetailId` on the `conn_student_class` table. All the data in the column will be lost.
  - You are about to drop the column `billDetailId` on the `conn_student_examtest` table. All the data in the column will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `conn_student_class_billDetailId_key` ON `conn_student_class`;

-- DropIndex
DROP INDEX `conn_student_examtest_billDetailId_key` ON `conn_student_examtest`;

-- AlterTable
ALTER TABLE `conn_employee_class` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `conn_employee_examtest` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `conn_student_class` DROP COLUMN `billDetailId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `conn_student_examtest` DROP COLUMN `billDetailId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `payment`;

-- CreateTable
CREATE TABLE `bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NULL,
    `classId` INTEGER NULL,
    `testId` INTEGER NULL,
    `totalPrice` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL DEFAULT '',
    `notes` VARCHAR(3000) NOT NULL DEFAULT '',
    `status` INTEGER NOT NULL DEFAULT 0,
    `beginAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
