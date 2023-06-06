CREATE TABLE IF NOT EXISTS Player (
	id	INTEGER PRIMARY KEY AUTO_INCREMENT,
	player_api_id	INTEGER,
	player_name	VARCHAR(255),
	player_fifa_api_id	INTEGER,
	birthday	VARCHAR(255),
	height	INTEGER,
	weight	INTEGER,
    UNIQUE(player_api_id),
    UNIQUE(player_fifa_api_id)
)