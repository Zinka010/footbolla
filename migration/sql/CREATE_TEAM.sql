CREATE TABLE IF NOT EXISTS Team (
	id	INTEGER PRIMARY KEY AUTO_INCREMENT,
	team_api_id	INTEGER,
	team_fifa_api_id	INTEGER,
	team_long_name	VARCHAR(255),
	team_short_name	VARCHAR(255),
    UNIQUE (team_api_id)
)