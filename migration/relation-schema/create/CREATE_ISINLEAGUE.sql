CREATE TABLE IF NOT EXISTS IsInLeague(
    league_id INTEGER,
    team_id INTEGER,
    PRIMARY KEY(league_id, team_id),
    FOREIGN KEY(league_id) REFERENCES Leagues(league_id),
    FOREIGN KEY(team_id) REFERENCES Teams(team_id)
)