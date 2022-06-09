/*
  Warnings:

  - You are about to alter the column `totalRevenue` on the `revenue_report_daily` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `revenue_report_daily` MODIFY `totalRevenue` INTEGER NOT NULL DEFAULT 0;
