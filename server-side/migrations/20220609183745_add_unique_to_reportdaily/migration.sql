/*
  Warnings:

  - A unique constraint covering the columns `[year,month,day]` on the table `revenue_report_daily` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `revenue_report_daily_year_month_day_key` ON `revenue_report_daily`(`year`, `month`, `day`);
