CREATE TABLE IF NOT EXISTS IsOwnerOf (
    user_team_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY(user_id, user_team_id),
    FOREIGN KEY(user_team_id) REFERENCES UserTeams(user_team_id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
)