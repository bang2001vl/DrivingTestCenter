/*
  Warnings:

  - Made the column `examId` on table `examtest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `examtest` DROP FOREIGN KEY `examtest_examId_fkey`;

-- AlterTable
ALTER TABLE `examtest` MODIFY `examId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `examtest` ADD CONSTRAINT `examtest_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
