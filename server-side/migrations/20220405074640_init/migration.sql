/*
  Warnings:

  - You are about to drop the column `userRole` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `session` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionData` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account` DROP COLUMN `userRole`,
    ADD COLUMN `roleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `userRole`,
    ADD COLUMN `sessionData` VARCHAR(5000) NOT NULL;

-- CreateTable
CREATE TABLE `CONST_ROLE` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
