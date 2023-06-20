SELECT DISTINCT
    P.id AS PlayerId,
    T.id AS TeamId,
    MP.season AS Season
FROM
    Player AS P
JOIN
    Player_Attributes AS PA ON P.player_api_id = PA.player_api_id
JOIN
    (
        SELECT
            M.home_player_1 AS player_api_id,
            M.home_team_api_id AS team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_2,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_3,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_4,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_5,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_6,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_7,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_8,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_9,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_10,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.home_player_11,
            M.home_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_1 AS player_api_id,
            M.away_team_api_id AS team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_2,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_3,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_4,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_5,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_6,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_7,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_8,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_9,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_10,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
        UNION ALL
        SELECT
            M.away_player_11,
            M.away_team_api_id,
            M.season
        FROM
            Match AS M
    ) AS MP ON P.player_api_id = MP.player_api_id
JOIN
    Team AS T ON T.team_api_id = MP.team_api_id
ORDER BY P.player_name;