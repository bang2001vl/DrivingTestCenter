DROP TRIGGER IF EXISTS after_insert_student_examtest_cnn;
DELIMITER $$
	CREATE TRIGGER after_insert_student_examtest_cnn
	AFTER INSERT ON conn_student_examtest
	FOR EACH ROW
	BEGIN
		CALL create_bill_student_examtest(NEW.studentId, NEW.examTestId);
		UPDATE examTest SET countStudent
	END$$

 DELIMITER ;

DROP TRIGGER IF EXISTS after_insert_student_class_cnn;
DELIMITER $$
	CREATE TRIGGER after_insert_student_class_cnn
	AFTER INSERT ON conn_student_class
	FOR EACH ROW
	BEGIN
		CALL create_bill_student_class(NEW.studentId, NEW.examTestId);
	END$$

 DELIMITER ;