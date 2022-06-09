/*
  Warnings:

  - You are about to drop the column `notes` on the `bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bill` DROP COLUMN `notes`,
    ADD COLUMN `code` VARCHAR(255) NOT NULL DEFAULT '',
    MODIFY `reason` VARCHAR(3000) NOT NULL DEFAULT '';
