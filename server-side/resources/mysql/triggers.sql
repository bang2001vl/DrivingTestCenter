DROP TRIGGER IF EXISTS report_month;

DELIMITER $$

    CREATE TRIGGER calc_report_month AFTER INSERT ON bill
    FOR EACH ROW
    BEGIN
        IF EXISTS (SELECT id FROM revenue_report_daily WHERE MONTH(NEW.createdAt)=month AND YEAR(NEW.createdAt)=year)
        INSERT INTO revenue_report_daily(year, month, day, totalRevenue)
        VALUES(YEAR(NEW.createdAt), MONTH(NEW.createdAt), DAY(NEW.createdAt), NEW.totalPrice)
    END$$

 DELIMITER ;