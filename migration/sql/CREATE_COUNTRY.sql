CREATE TABLE IF NOT EXISTS Country (
	id	INTEGER PRIMARY KEY AUTO_INCREMENT,
	name	VARCHAR(255),
    UNIQUE(name)   
)