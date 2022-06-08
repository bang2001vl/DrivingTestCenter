DROP PROCEDURE IF EXISTS create_bill_student_examtest;
DELIMITER $$
	CREATE PROCEDURE create_bill_student_examtest
	(IN studentId INT, IN examtestId INT)
	BEGIN
		DECLARE studentName VARCHAR(50);
        DECLARE examtestName VARCHAR(50);
        DECLARE examtestParentId INT;
        DECLARE examtestPrice INT;
        DECLARE reason VARCHAR(256);
		SELECT fullname INTO studentName FROM account WHERE id=studentId; 
		SELECT name, examId INTO examtestName, examtestParentId FROM examtest WHERE id=examtestId; 
		SELECT price INTO examtestPrice FROM exam WHERE id=examtestParentId;
        SET reason = CONCAT("[Auto-generated] Đóng lệ phí ca thi: ", examtestName, "Người đóng: ", studentName, ".");
-- 		SELECT studentId, examtestId, studentName, examtestName, examtestParentId, examtestPrice, reason;
		INSERT INTO bill
		SET
			studentId = studentId,
			testId = examTestId,
            totalPrice = examtestPrice,
			reason = reason;
	END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS create_bill_student_class;
DELIMITER $$
	CREATE PROCEDURE create_bill_student_class
	(IN studentId INT, IN classId INT)
	BEGIN
		DECLARE studentName VARCHAR(50);
        DECLARE className VARCHAR(50);
        DECLARE classPrice INT;
        DECLARE reason VARCHAR(256);
		SELECT fullname INTO studentName FROM account WHERE id=studentId; 
		SELECT name, price INTO className, classPrice FROM class WHERE id=classId; 
        SET reason = CONCAT("[Auto-generated] Đóng học phí lớp: ", className, "Người đóng: ", studentName, ".");
-- 		SELECT studentId, classId, studentName, className, classPrice, reason;
		INSERT INTO bill
		SET
			studentId = studentId,
			testId = examTestId,
            totalPrice = examtestPrice,
			reason = reason;
	END$$

DELIMITER ;