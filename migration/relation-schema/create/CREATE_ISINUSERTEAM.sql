CREATE TABLE IF NOT EXISTS IsInUserTeam (
    player_id INTEGER,
    user_team_id INTEGER,
    PRIMARY KEY(player_id, user_team_id),
    FOREIGN KEY(player_id) REFERENCES Players(player_id),
    FOREIGN KEY(user_team_id) REFERENCES UserTeams(user_team_id)
)