/*
  Warnings:

  - You are about to drop the column `dateEnd` on the `class_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `dateStart` on the `class_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `class_schedule` table. All the data in the column will be lost.
  - Added the required column `dateTimeEnd` to the `class_schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTimeStart` to the `class_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `class_schedule` DROP COLUMN `dateEnd`,
    DROP COLUMN `dateStart`,
    DROP COLUMN `title`,
    ADD COLUMN `dateTimeEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `dateTimeStart` DATETIME(3) NOT NULL;
