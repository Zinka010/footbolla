We populate the database with the following commands to MySql

CREATE SCHEMA test_db;
CREATE TABLE test_db.test_table (userid int, message varchar(255));

INSERT INTO test_db.test_table VALUES(2, "This is a Test");
INSERT INTO test_db.test_table VALUES(3, "Justin");
INSERT INTO test_db.test_table VALUES(4, "Justun");
INSERT INTO test_db.test_table VALUES(5, "Arya");
INSERT INTO test_db.test_table VALUES(6, "Risha");
INSERT INTO test_db.test_table VALUES(7, "Amman");

SELECT * FROM test_db.test_table;

