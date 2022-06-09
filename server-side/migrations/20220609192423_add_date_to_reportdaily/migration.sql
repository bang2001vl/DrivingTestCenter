/*
  Warnings:

  - Added the required column `date` to the `revenue_report_daily` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `revenue_report_daily` ADD COLUMN `date` DATETIME(3) NOT NULL;
