SELECT footyfiend.Players.* FROM footyfiend.Players JOIN footyfiend.IsInUserTeam ON footyfiend.IsInUserTeam.player_id = footyfiend.Players.player_id JOIN footyfiend.UserTeams ON footyfiend.UserTeams.user_team_id = footyfiend.IsInUserTeam.user_team_id WHERE footyfiend.UserTeams.user_team_id = 1;