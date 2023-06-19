SELECT DISTINCT 
Team.id, 
Team.team_long_name, 
Team.team_short_name, 
Team.team_api_id,
a.buildUpPlaySpeed, 
a.buildUpPlaySpeedClass, 
a.buildUpPlayDribbling, 
a.buildUpPlayDribblingClass, 
a.buildUpPlayPassing, 
a.buildUpPlayPassingClass, 
a.buildUpPlayPositioningClass, 
a.chanceCreationPassing, 
a.chanceCreationPassingClass, 
a.chanceCreationCrossing, 
a.chanceCreationCrossingClass, 
a.chanceCreationShooting, 
a.chanceCreationShootingClass, 
a.chanceCreationPositioningClass,
a.defencePressure, 
a.defencePressureClass, 
a.defenceAggression, 
a.defenceAggressionClass,
a.defenceTeamWidth, 
a.defenceTeamWidthClass, 
a.defenceDefenderLineClass
FROM Team, Team_Attributes a
WHERE Team.team_api_id = a.team_api_id AND Team.team_fifa_api_id = a.team_fifa_api_id
GROUP BY Team.id
LIMIT 20