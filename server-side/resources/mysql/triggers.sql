DROP TRIGGER IF EXISTS after_insert_student_examtest_cnn;
DELIMITER $$
	CREATE TRIGGER after_insert_student_examtest_cnn
	AFTER INSERT ON conn_student_examtest
	FOR EACH ROW
	BEGIN
		DECLARE studentName VARCHAR(50);
        DECLARE examtestName VARCHAR(50);
        DECLARE examId INT;
        DECLARE examtestPrice INT;
        DECLARE reason VARCHAR(256);
		SELECT fullname INTO studentName FROM account WHERE id=NEW.studentId; 
		SELECT name, examId INTO examtestName, examId FROM examtest WHERE id=NEW.examTestId; 
		SELECT price INTO examtestPrice FROM exam WHERE id=examId; 
        SET reason = "Dong le phi ca thi: " + examtestName + "(id="+CONVERT(NEW.examTestId USING utf8mb4)+"). Nguoi dong: " + studentName + "(id="+CONVERT(NEW.studentId USING utf8mb4)+")";
		INSERT INTO bill
		SET
			studentId = NEW.studentId,
			testId = NEW.examTestId,
            totalPrice = examtestPrice,
			reason = reason;
	END$$

 DELIMITER ;
 