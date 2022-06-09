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
 
DROP TRIGGER IF EXISTS after_delete_student_examtest_cnn;
DELIMITER $$
	CREATE TRIGGER after_delete_student_examtest_cnn
	AFTER DELETE ON conn_student_examtest
	FOR EACH ROW
	BEGIN
		UPDATE exam_test SET countStudent=countStudent-1 WHERE id=OLD.examTestId;
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
 
DROP TRIGGER IF EXISTS after_delete_student_class_cnn;
DELIMITER $$
	CREATE TRIGGER after_delete_student_class_cnn
	AFTER DELETE ON conn_student_class
	FOR EACH ROW
	BEGIN
		UPDATE class SET countStudent=countStudent-1 WHERE id=OLD.classId;
	END$$

 DELIMITER ;
 
DROP TRIGGER IF EXISTS before_insert_bill;
DELIMITER $$
	CREATE TRIGGER before_insert_bill
	BEFORE INSERT ON bill
	FOR EACH ROW
	BEGIN
		SET NEW.code = CAST(uuid_short() AS CHAR);

		INSERT INTO revenue_report_daily(ryear,rmonth,rday,rdate,totalRevenue)
		VALUES(YEAR(UTC_TIMESTAMP),MONTH(UTC_TIMESTAMP),DAY(UTC_TIMESTAMP),UTC_TIMESTAMP,NEW.totalPrice) 
		ON DUPLICATE KEY UPDATE totalRevenue=totalRevenue+NEW.totalPrice;
	END$$

 DELIMITER ;