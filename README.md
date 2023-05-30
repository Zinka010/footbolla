We populate the database with the following commands to MySql

```
CREATE SCHEMA test_db;
CREATE TABLE test_db.test_table (userid int, message varchar(255));

INSERT INTO test_db.test_table VALUES(2, "This is a Test");
INSERT INTO test_db.test_table VALUES(3, "Justin");
INSERT INTO test_db.test_table VALUES(4, "Justun");
INSERT INTO test_db.test_table VALUES(5, "Arya");
INSERT INTO test_db.test_table VALUES(6, "Risha");
INSERT INTO test_db.test_table VALUES(7, "Amman");

SELECT * FROM test_db.test_table;
```

We verify that our connection works by going running the our application with:

```
cd ./backend
./gradlew bootRun
```

We then go to http://localhost:8080/hello and verify that a  "This is a Test" is there
