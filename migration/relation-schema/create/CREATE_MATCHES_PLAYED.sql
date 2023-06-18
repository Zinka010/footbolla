CREATE TABLE IF NOT EXISTS MatchesPlayed (
    match_id INTEGER PRIMARY KEY,
    home_team_id INTEGER,
    away_team_id INTEGER,
    FOREIGN KEY(match_id) REFERENCES Matches(match_id),
    FOREIGN KEY(home_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY(away_team_id) REFERENCES Teams(team_id)
)