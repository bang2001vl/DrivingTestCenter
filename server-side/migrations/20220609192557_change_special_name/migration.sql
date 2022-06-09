/*
  Warnings:

  - You are about to drop the column `date` on the `revenue_report_daily` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `revenue_report_daily` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `revenue_report_daily` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `revenue_report_daily` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ryear,rmonth,rday]` on the table `revenue_report_daily` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rdate` to the `revenue_report_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rday` to the `revenue_report_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rmonth` to the `revenue_report_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ryear` to the `revenue_report_daily` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `revenue_report_daily_year_month_day_key` ON `revenue_report_daily`;

-- AlterTable
ALTER TABLE `revenue_report_daily` DROP COLUMN `date`,
    DROP COLUMN `day`,
    DROP COLUMN `month`,
    DROP COLUMN `year`,
    ADD COLUMN `rdate` DATETIME(3) NOT NULL,
    ADD COLUMN `rday` INTEGER NOT NULL,
    ADD COLUMN `rmonth` INTEGER NOT NULL,
    ADD COLUMN `ryear` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `revenue_report_daily_ryear_rmonth_rday_key` ON `revenue_report_daily`(`ryear`, `rmonth`, `rday`);
