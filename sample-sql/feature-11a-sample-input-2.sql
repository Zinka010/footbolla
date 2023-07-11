SELECT * 
FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches 
WHERE (home_team_id = 12 AND away_team_id = 14) 
      OR (home_team_id = 14 AND away_team_id = 12)  
ORDER BY season 
DESC LIMIT 5;
