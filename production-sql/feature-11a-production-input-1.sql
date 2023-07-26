SELECT SUM(team1_win) AS numTeam1Win, SUM(team2_win) AS numTeam2Win, SUM(TIE) AS numTies 
FROM (
    SELECT home_team_score > away_team_score AS team1_win, home_team_score < away_team_score AS team2_win, home_team_score = away_team_score AS TIE 
    FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches 
    WHERE (home_team_id = 12 AND away_team_id = 14) 
    UNION ALL 
    SELECT away_team_score > home_team_score AS team1_win, away_team_score < home_team_score AS team2_win, home_team_score = away_team_score AS TIE 
    FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches 
    WHERE (home_team_id = 14 AND away_team_id = 12)) AS T;
