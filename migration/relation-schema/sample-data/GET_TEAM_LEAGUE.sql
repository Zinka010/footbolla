SELECT l.id as TeamId, t.id as LeagueId
FROM Team t
JOIN Match m ON t.id = m.home_team_id
JOIN League l ON l.id = m.league_id
GROUP BY t.id