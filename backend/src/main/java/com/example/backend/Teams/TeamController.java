package com.example.backend.Teams;

import com.example.backend.Constants;
import com.example.backend.util.Util;
import org.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.*;

@RestController
public class TeamController {
    @GetMapping("/team")
    public ResponseEntity<String> getTeams(@RequestParam(name = "startIdx", defaultValue = "0") Integer startIdx,
                                             @RequestParam(name = "endIdx", defaultValue = "50") Integer endIdx
                                          ) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

            // Since LIMIT A, B returns B starting at row A
            if (startIdx > endIdx) {
                startIdx = 0;
                endIdx = 50;
            }

            String readMessageQuery = "SELECT team_id, team_short_name, team_long_name FROM Teams ORDER BY team_short_name"
                    + " LIMIT " + startIdx + ", " + (endIdx - startIdx);;

            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/team/{team_id}")
    public ResponseEntity<String> getTeams(@PathVariable String team_id) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);


            String readMessageQuery = "SELECT * FROM Teams WHERE team_id = " + team_id;

            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/teamCount")
    public ResponseEntity<String> getTeamCount() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT COUNT(*) AS teamCount FROM Teams";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/roster/{team_id}")
    public ResponseEntity<String> getTeamRosterById(@PathVariable String team_id) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT P.name, PTH.season, P.player_id FROM footyfiend.Teams as T, footyfiend.PlayerTeamHistory AS PTH,"
                        + " footyfiend.Players AS P WHERE PTH.team_id = T.team_id AND P.player_id = PTH.player_id AND PTH.team_id = " + team_id
                    + " ORDER BY PTH.season, P.name";

            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/overall_match_history/{team1_id}/{team2_id}")
    public ResponseEntity<String> getOverallMatchHistory(@PathVariable String team1_id, @PathVariable String team2_id)  {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT SUM(team1_win) AS numTeam1Win, SUM(team2_win) AS numTeam2Win, SUM(TIE) AS numTies " +
                                        "FROM (" +
                                        "SELECT home_team_score > away_team_score AS team1_win, " +
                                                "home_team_score < away_team_score AS team2_win, " +
                                                "home_team_score = away_team_score AS TIE " +
                                        "FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches " +
                                        "WHERE (home_team_id = " + team1_id + " AND away_team_id = " + team2_id + ") " +
                                        "UNION ALL " +
                                        "SELECT away_team_score > home_team_score AS team1_win, " +
                                                "away_team_score < home_team_score AS team2_win, " +
                                                "home_team_score = away_team_score AS TIE " +
                                        "FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches " +
                                        "WHERE (home_team_id = " + team2_id + " AND away_team_id = " +  team1_id + ")) AS T;";


            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/last_five_matches/{team1_id}/{team2_id}")
    public ResponseEntity<String> getTeamRosterById(@PathVariable String team1_id, @PathVariable String team2_id) {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT * " +
                            "FROM ( " +
                                    "SELECT home_team_id as team1_id, away_team_id as team2_id, home_team_score AS team1_score, away_team_score AS team2_score, season " +
                                    "FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches " +
                                    "WHERE (home_team_id = " + team1_id +" AND away_team_id = " + team2_id + ") " +
                                    "UNION ALL " +
                                    "SELECT away_team_id as team1_id, home_team_id as team2_id, away_team_score AS team1_score, home_team_score AS team2_score, season " +
                                    "FROM footyfiend.MatchesPlayed NATURAL JOIN footyfiend.Matches " +
                                    "WHERE (home_team_id = " + team2_id +" AND away_team_id = " + team1_id + ") " +
                            ") AS T " +
                            "ORDER BY SEASON DESC " +
                            "LIMIT 5;";


            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

}
