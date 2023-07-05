package com.example.backend.UserTeams;

import com.example.backend.util.Util;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


@RestController
public class UserTeamController {
    final String username = "root"; // our default username is root
    final String password = "password"; // our default password is password
    final String dbName = "footyfiend"; // our current db name is footy_fiend
    final String url = "jdbc:mysql://127.0.0.1:3306/" + dbName;

    @PostMapping("/createUserTeam/{userId}/teamName/{teamName}")
    public ResponseEntity<String> createUserTeam(@PathVariable Integer userId, @PathVariable String teamName) {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
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
            Connection connection = DriverManager.getConnection(url, username, password);
            Integer teamID = request.getTeamId();
            Integer[] playerIDs = request.getPlayerIDs();
            StringBuilder insertRows = new StringBuilder();

            for (int i = 0; i < playerIDs.length; i++){
                insertRows.append("(").append(playerIDs[i]).append(",").append(teamID).append(")");
                if (i != playerIDs.length - 1){
                    insertRows.append(",");
                }
            }

            String insertQuery = "INSERT INTO IsInUserTeam VALUES " + insertRows;
            Statement statement = connection.createStatement();
            int rows_added = statement.executeUpdate(insertQuery);
            String returnMessage = "";
            if (rows_added >= 1){
                returnMessage = "The selected player(s) have has been added to the team";
            } else {
                returnMessage = "The selected player(s) couldn't added to the team";
            }
            statement.close();
            return ResponseEntity.ok(returnMessage);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to add player(s) to the team: %s", e));
        }
    }

    @GetMapping("/getUserTeams/{userId}")
    public ResponseEntity<List<UserTeamResponse>> getUserTeams(@PathVariable Integer userId) {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
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
            Connection connection = DriverManager.getConnection(url, username, password);
            Statement statement = connection.createStatement();
            String selectStatement = "SELECT Players.* FROM Players JOIN IsInUserTeam ON IsInUserTeam.player_id = Players.player_id " +
                    "JOIN UserTeams ON UserTeams.user_team_id = IsInUserTeam.user_team_id WHERE UserTeams.user_team_id = " + teamId;
            ResultSet resultSet = statement.executeQuery(selectStatement);
            JSONArray res = new Util().resultToJsonArray(resultSet, connection);
            JSONObject object = new JSONObject();

            String selectNameStatement = "SELECT team_name FROM UserTeams WHERE user_team_id = " + teamId;
            ResultSet name = statement.executeQuery(selectNameStatement);

            object.put("teamId", teamId);
            object.put("players", res);

            if(name.next()) {
                object.put("team_name", name.getString("team_name"));
            }

            return ResponseEntity.ok(object.toString());

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("new JSONArray()");
        }
    }
}
