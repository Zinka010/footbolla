CREATE TABLE IF NOT EXISTS Matches (
    match_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    season VARCHAR(255),
    home_team_score INTEGER,
    away_team_score INTEGER
)