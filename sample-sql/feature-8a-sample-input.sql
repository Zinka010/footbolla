CREATE TABLE IF NOT EXISTS footyfiends.USERS (
user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 8)
)
/*
    Query Template:
    INSERT INTO Users (username, email, password) VALUES(a, b, c)
*/


INSERT INTO footyfiends.Users (username, email, password) VALUES("rishadl", "rish@gmail.com", "littleciteh");
INSERT INTO footyfiends.Users (username, email, password) VALUES("adhingz", "adhing@gmail.com", "manutd123");
INSERT INTO footyfiends.Users (username, email, password) VALUES("justin123", "jt123@gmail.com", "just1nt123");
INSERT INTO footyfiends.Users (username, email, password) VALUES("justun", "justun2001@gmail.com", "just881231");
INSERT INTO footyfiends.Users (username, email, password) VALUES("amman99", "am99@gmail.com", "thispass12333");


SELECT TOP 10 FROM footyfiend.Users