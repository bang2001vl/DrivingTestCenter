/*
  Warnings:

  - You are about to drop the column `userId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `session_ibfk_1`;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `userId`,
    DROP COLUMN `userRole`,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
