CREATE TABLE IF NOT EXISTS PlayerTeamHistory(
    player_id INTEGER,
    team_id INTEGER,
    season VARCHAR(255),
    PRIMARY KEY(player_id, team_id, season),
    FOREIGN KEY(player_id) REFERENCES Players(player_id),
    FOREIGN KEY(team_id) REFERENCES Teams(team_id)
)