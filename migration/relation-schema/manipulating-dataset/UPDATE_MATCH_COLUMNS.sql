UPDATE Match 
SET home_team_id = (
	SELECT id FROM Team
	WHERE team_api_id = Match.home_team_api_id
)
WHERE EXISTS (
	SELECT id FROM Team
	WHERE team_api_id = Match.home_team_api_id
);
UPDATE Match
SET away_team_id = (
    SELECT id FROM Team
    WHERE team_api_id = Match.away_team_api_id
)
WHERE EXISTS (
    SELECT id FROM Team
    WHERE team_api_id = Match.away_team_api_id
)