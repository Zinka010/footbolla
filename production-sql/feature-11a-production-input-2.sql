SELECT *
FROM (
      SELECT home_team_id as team1_id, away_team_id as team2_id, home_team_score AS team1_score, away_team_score AS team2_score, season
      FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches
      WHERE (home_team_id = 12 AND away_team_id = 14)
      UNION ALL
      SELECT away_team_id as team1_id, home_team_id as team2_id, away_team_score AS team1_score, home_team_score AS team2_score, season
      FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches
      WHERE (home_team_id = 14 AND away_team_id = 12)
      ) AS T
ORDER BY SEASON DESC
LIMIT 5;

