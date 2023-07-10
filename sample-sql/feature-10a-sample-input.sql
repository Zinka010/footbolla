SELECT P.name, PTH.season, P.player_id 
FROM footyfiend.Teams as T, footyfiend.PlayerTeamHistory AS PTH, footyfiend.Players AS P 
WHERE PTH.team_id = T.team_id AND P.player_id = PTH.player_id  AND PTH.team_id = 12
ORDER BY PTH.season, P.name;

