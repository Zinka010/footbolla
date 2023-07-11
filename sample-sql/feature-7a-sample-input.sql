With team_player_ids AS (SELECT player_id from isInUserTeam where user_team_id = 1)
(SELECT (sum(finishing) + sum(dribbling) + sum(sprint_speed) + sum(strength) + sum(aggression) + sum(interceptions))/COUNT(*) AS team_score FROM team_player_ids natural join Players);
