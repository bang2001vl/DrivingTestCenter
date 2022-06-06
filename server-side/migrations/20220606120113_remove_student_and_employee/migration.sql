/*
  Warnings:

  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `conn_employee_class` DROP FOREIGN KEY `conn_employee_class_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_examtest` DROP FOREIGN KEY `conn_employee_examtest_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_class` DROP FOREIGN KEY `conn_student_class_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `conn_student_examtest_studentId_fkey`;

-- DropTable
DROP TABLE `employee`;

-- DropTable
DROP TABLE `student`;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_class` ADD CONSTRAINT `conn_student_class_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_examtest` ADD CONSTRAINT `conn_employee_examtest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_class` ADD CONSTRAINT `conn_employee_class_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
