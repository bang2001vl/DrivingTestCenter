/*
  Warnings:

  - You are about to drop the `fullreportmonthly` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revenuereportdaily` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `revenuereportdaily` DROP FOREIGN KEY `RevenueReportDaily_rpMonthId_fkey`;

-- DropTable
DROP TABLE `fullreportmonthly`;

-- DropTable
DROP TABLE `revenuereportdaily`;

-- CreateTable
CREATE TABLE `revenue_report_daily` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `totalRevenue` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
