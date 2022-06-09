DROP TRIGGER IF EXISTS after_insert_student_examtest_cnn;
DELIMITER $$
	CREATE TRIGGER after_insert_student_examtest_cnn
	AFTER INSERT ON conn_student_examtest
	FOR EACH ROW
	BEGIN
		CALL create_bill_student_examtest(NEW.studentId, NEW.examTestId);
		UPDATE exam_test SET countStudent=countStudent+1 WHERE id=NEW.examTestId;
	END$$

 DELIMITER ;

DROP TRIGGER IF EXISTS after_insert_student_class_cnn;
DELIMITER $$
	CREATE TRIGGER after_insert_student_class_cnn
	AFTER INSERT ON conn_student_class
	FOR EACH ROW
	BEGIN
		CALL create_bill_student_class(NEW.studentId, NEW.classId);
		UPDATE class SET countStudent=countStudent+1 WHERE id=NEW.classId;
	END$$

 DELIMITER ;