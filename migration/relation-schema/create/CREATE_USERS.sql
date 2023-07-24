CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 8 
    	AND (password REGEXP '[0-9]' OR password REGEXP '[!@#$%^&*()]'))
)