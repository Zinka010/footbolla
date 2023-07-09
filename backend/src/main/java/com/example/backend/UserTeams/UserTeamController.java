package com.example.backend.UserTeams;

import com.example.backend.Constants;
import com.example.backend.util.Util;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;


@RestController
public class UserTeamController {

    @PostMapping("/createUserTeam/{userId}/teamName/{teamName}")
    public ResponseEntity<String> createUserTeam(@PathVariable Integer userId, @PathVariable String teamName) {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String insertQuery = "INSERT INTO UserTeams (team_name) VALUES('" + teamName + "')";
            Statement statement = connection.createStatement();
            int rows_added = statement.executeUpdate(insertQuery, Statement.RETURN_GENERATED_KEYS);
            String returnMessage = "";
            if (rows_added == 1){
                ResultSet generatedKeys = statement.getGeneratedKeys();
                if (generatedKeys.next()) {
                    int newId = generatedKeys.getInt(1);

                    String insertIntoOwnerOf = "INSERT INTO IsOwnerOf (user_team_id, user_id) VALUES(" + newId + "," + userId + ")";
                    statement.executeUpdate(insertIntoOwnerOf);
                }
                returnMessage = "The user team " + teamName + " has been created";
            } else {
                returnMessage = "The user team could not be added";
            }
            return ResponseEntity.ok(returnMessage);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to create team: %s", e));
        }
    }

    @PostMapping("/addToUserTeam")
    public ResponseEntity<String> addPlayerToUserTeam(@RequestBody AddToUserTeamRequest request) {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            Integer teamID = request.getTeamId();
            PlayerObject[] players = request.players();
            StringBuilder insertRows = new StringBuilder();

            String returnMessage = "The selected player(s) have has been added to the team";

            for (PlayerObject player : players) {
                Statement statement = connection.createStatement();
                String selectStatement = "SELECT * FROM IsInUserTeam WHERE user_team_id = " + teamID + " AND (position = " + player.getPosition().ordinal() + " OR player_id = " + player.getPlayerId() + ")";
                ResultSet res = statement.executeQuery(selectStatement);
                int rowsUpdated = 0;

                if (res.next()) {
                    String updateStatement = "UPDATE IsInUserTeam SET player_id = " + player.getPlayerId() + ", position = " + player.getPosition().ordinal() +
                            " WHERE user_team_id = " + teamID + " AND (position = " + player.getPosition().ordinal() + " OR player_id = " + player.getPlayerId() + ")" ;
                    rowsUpdated = statement.executeUpdate(updateStatement);

                } else {
                    String insertStatement = "INSERT INTO IsInUserTeam VALUES " + "(" + player.getPlayerId() + ',' + teamID + ',' + player.getPosition().ordinal() + ")";
                    rowsUpdated = statement.executeUpdate(insertStatement);
                }

                if (rowsUpdated == 0) {
                    returnMessage = "The selected player(s) couldn't be added to the team";
                }

                statement.close();
            }

            return ResponseEntity.ok(returnMessage);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to add player(s) to the team: %s", e));
        }
    }

    @GetMapping("/getUserTeams/{userId}")
    public ResponseEntity<List<UserTeamResponse>> getUserTeams(@PathVariable Integer userId) {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            Statement statement = connection.createStatement();
            String selectStatment = "SELECT u.team_name, u.user_team_id FROM UserTeams u, IsOwnerOf o WHERE o.user_id = " + userId + " AND o.user_team_id = u.user_team_id";
            ResultSet resultSet = statement.executeQuery(selectStatment);
            ArrayList<UserTeamResponse> list = new ArrayList<>();
            while(resultSet.next()) {
                list.add(new UserTeamResponse(resultSet.getInt("user_team_id"), resultSet.getString("team_name")));
            }

            return ResponseEntity.ok(list);

        } catch (SQLException e) {
           e.printStackTrace();
           return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

    @GetMapping("/getTeam/{teamId}")
    public ResponseEntity<String> getTeam(@PathVariable Integer teamId) {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            Statement statement = connection.createStatement();
            String selectStatement = "SELECT Players.* FROM Players JOIN IsInUserTeam ON IsInUserTeam.player_id = Players.player_id " +
                    "JOIN UserTeams ON UserTeams.user_team_id = IsInUserTeam.user_team_id WHERE UserTeams.user_team_id = " + teamId;
            ResultSet resultSet = statement.executeQuery(selectStatement);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);
            JSONObject object = new JSONObject();

            object.put("teamId", teamId);
            object.put("players", res);

            String selectNameStatement = "SELECT team_name FROM UserTeams WHERE user_team_id = " + teamId;
            ResultSet name = statement.executeQuery(selectNameStatement);

            if(name.next()) {
                object.put("team_name", name.getString("team_name"));
            }

            String selectPositionStatement = "SELECT position, player_id FROM IsInUserTeam WHERE user_team_id = " + teamId;
            ResultSet positionSet = statement.executeQuery(selectPositionStatement);
            JSONArray positionRes = Util.resultToJsonArray(positionSet, connection);

            object.put("positions", positionRes);


            return ResponseEntity.ok(object.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new JSONArray().toString());
        }
    }

    @GetMapping("/searchPlayers")
    public ResponseEntity<String> searchPlayers(@RequestParam String q) {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            Statement statement = connection.createStatement();

            String search = "SELECT * FROM Players WHERE LOWER(name) LIKE LOWER('%" + q + "%') LIMIT 10";
            ResultSet res = statement.executeQuery(search);
            JSONArray result = Util.resultToJsonArray(res, connection);

            return ResponseEntity.ok(result.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new JSONArray().toString());
        }
    }

    private JSONArray getUserTeamScore(@PathVariable String team_id) throws SQLException {

        Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
        String getTeamScore = "With team_player_ids AS (SELECT player_id from isInUserTeam where user_team_id = " + team_id + ")\n" +
                "(SELECT (sum(finishing) + sum(dribbling) + sum(sprint_speed) + sum(strength) + sum(aggression) + sum(interceptions))/COUNT(*) AS team_score FROM team_player_ids natural join Players);";

        System.out.println(getTeamScore);
        Statement statement = connection.createStatement();
        ResultSet resultSet1 = statement.executeQuery(getTeamScore);
        JSONArray res1 = Util.resultToJsonArray(resultSet1, connection);
        statement.close();

        return res1;

    }

    @GetMapping("/predictWinner/{team1_id}/{team2_id}")
    public ResponseEntity<String> predictWinner(@PathVariable String team1_id, @PathVariable String team2_id) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {

            JSONArray getTeam1Score = getUserTeamScore(team1_id);
            JSONArray getTeam2Score = getUserTeamScore(team2_id);
            BigDecimal team1Score = (BigDecimal) getTeam1Score.getJSONObject(0).get("team_score");
            BigDecimal team2Score = (BigDecimal) getTeam2Score.getJSONObject(0).get("team_score");
            System.out.println(team1Score);
            System.out.println(team2Score);

            JSONArray res = new JSONArray();
            if (team1Score.compareTo(team2Score) == 1) {
                res.put(team1_id);
            } else {
                res.put(team2_id);
            }
            return ResponseEntity.ok(res.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }
}
