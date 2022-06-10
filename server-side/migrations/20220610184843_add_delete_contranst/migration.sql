-- DropForeignKey
ALTER TABLE `class_schedule` DROP FOREIGN KEY `class_schedule_classId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_class` DROP FOREIGN KEY `conn_employee_class_classId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_class` DROP FOREIGN KEY `conn_employee_class_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_examtest` DROP FOREIGN KEY `conn_employee_examtest_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_employee_examtest` DROP FOREIGN KEY `conn_employee_examtest_examTestId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_class` DROP FOREIGN KEY `conn_student_class_classId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_class` DROP FOREIGN KEY `conn_student_class_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `conn_student_examtest_examTestId_fkey`;

-- DropForeignKey
ALTER TABLE `conn_student_examtest` DROP FOREIGN KEY `conn_student_examtest_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `exam_schedule` DROP FOREIGN KEY `exam_schedule_examId_fkey`;

-- DropForeignKey
ALTER TABLE `exam_test` DROP FOREIGN KEY `exam_test_examId_fkey`;

-- AlterTable
ALTER TABLE `account` MODIFY `address` VARCHAR(1000) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `conn_student_examtest` ADD COLUMN `note` VARCHAR(1000) NOT NULL DEFAULT '',
    ADD COLUMN `result` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `exam_test` ADD CONSTRAINT `exam_test_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_schedule` ADD CONSTRAINT `class_schedule_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_schedule` ADD CONSTRAINT `exam_schedule_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_examtest` ADD CONSTRAINT `conn_student_examtest_examTestId_fkey` FOREIGN KEY (`examTestId`) REFERENCES `exam_test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_class` ADD CONSTRAINT `conn_student_class_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_student_class` ADD CONSTRAINT `conn_student_class_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_examtest` ADD CONSTRAINT `conn_employee_examtest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_examtest` ADD CONSTRAINT `conn_employee_examtest_examTestId_fkey` FOREIGN KEY (`examTestId`) REFERENCES `exam_test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_class` ADD CONSTRAINT `conn_employee_class_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conn_employee_class` ADD CONSTRAINT `conn_employee_class_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
