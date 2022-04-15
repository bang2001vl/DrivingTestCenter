/*
  Warnings:

  - Added the required column `dateEnd` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateClose` to the `exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateEnd` to the `exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOpen` to the `exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTimeEnd` to the `examtest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `billdetail` DROP FOREIGN KEY `BillDetail_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_examId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_class` DROP FOREIGN KEY `CONN_Employee_Class_classId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_class` DROP FOREIGN KEY `CONN_Employee_Class_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_examtest` DROP FOREIGN KEY `CONN_Employee_ExamTest_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_examtest` DROP FOREIGN KEY `CONN_Employee_ExamTest_examTestId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_class` DROP FOREIGN KEY `CONN_Student_Class_billDetailId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_class` DROP FOREIGN KEY `CONN_Student_Class_classId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_class` DROP FOREIGN KEY `CONN_Student_Class_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `CONN_Student_ExamTest_billDetailId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `CONN_Student_ExamTest_examTestId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `CONN_Student_ExamTest_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `examtest` DROP FOREIGN KEY `ExamTest_examId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_accountId_fkey`;

-- AlterTable
ALTER TABLE `class` ADD COLUMN `dateEnd` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `address` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `exam` ADD COLUMN `dateClose` DATETIME(3) NOT NULL,
    ADD COLUMN `dateEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `dateOpen` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `examtest` ADD COLUMN `dateTimeEnd` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `address` VARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE `examtest` ADD CONSTRAINT `examtest_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `billdetail` ADD CONSTRAINT `billdetail_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_examTestId_fkey` FOREIGN KEY (`examTestId`) REFERENCES `examtest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_billDetailId_fkey` FOREIGN KEY (`billDetailId`) REFERENCES `billdetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_class` ADD CONSTRAINT `conn_student_class_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_class` ADD CONSTRAINT `conn_student_class_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_class` ADD CONSTRAINT `conn_student_class_billDetailId_fkey` FOREIGN KEY (`billDetailId`) REFERENCES `billdetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_examtest` ADD CONSTRAINT `conn_employee_examtest_examTestId_fkey` FOREIGN KEY (`examTestId`) REFERENCES `examtest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_examtest` ADD CONSTRAINT `conn_employee_examtest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_class` ADD CONSTRAINT `conn_employee_class_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_class` ADD CONSTRAINT `conn_employee_class_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `account` RENAME INDEX `Account_username_password_idx` TO `account_username_password_idx`;

-- RenameIndex
ALTER TABLE `conn_student_class` RENAME INDEX `CONN_Student_Class_billDetailId_key` TO `conn_student_class_billDetailId_key`;

-- RenameIndex
ALTER TABLE `conn_student_examtest` RENAME INDEX `CONN_Student_ExamTest_billDetailId_key` TO `conn_student_examtest_billDetailId_key`;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_accountId_key` TO `employee_accountId_key`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_accountId_idx` TO `session_accountId_idx`;

-- RenameIndex
ALTER TABLE `student` RENAME INDEX `Student_accountId_key` TO `student_accountId_key`;
