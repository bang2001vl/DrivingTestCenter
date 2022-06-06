/*
  Warnings:

  - You are about to drop the column `examId` on the `class` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `class_examId_fkey`;

-- AlterTable
ALTER TABLE `class` DROP COLUMN `examId`,
    MODIFY `rules` VARCHAR(3000) NOT NULL DEFAULT '';
