CREATE TABLE IF NOT EXISTS footyfiends.USERS (
user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 8),
salt VARCHAR(255) NOT NULL UNIQUE
)
/*
    Query Template:
    INSERT INTO Users (username, email, password) VALUES(a, b, c)
*/


INSERT INTO footyfiends.Users (username, email, password) VALUES("rishadluthra", "rishadluthra@gmail.com", "rishad_luthra1");
INSERT INTO footyfiends.Users (username, email, password) VALUES("erlinghaaland", "erling@gmail.com", "erlinghaaland9_");
INSERT INTO footyfiends.Users (username, email, password) VALUES("kevindebruyne", "debruyne@gmail.com", "kdbkdb17@");
INSERT INTO footyfiends.Users (username, email, password) VALUES("elwey_foden", "ronnie_foden2019@gmail.com", "elweeeyyy4_7");

SELECT TOP 10 FROM footyfiend.Users