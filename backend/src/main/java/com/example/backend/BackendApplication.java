package com.example.backend;

import com.example.backend.util.Util;
import org.jooq.Record;
import org.jooq.RecordMapper;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;

@SpringBootApplication
@RestController
public class BackendApplication {

    final String username = "root"; // our default username is root
    final String password = "password"; // our default password is password
    final String dbName = "footyfiend"; // our current db name is footy_fiend
    final String url = "jdbc:mysql://127.0.0.1:3306/" + dbName;
    Util util = new Util();
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    // Source https://github.com/eugenp/tutorials/blob/master/persistence-modules/core-java-persistence-2/src/main/java/com/baeldung/resultset2json/ResultSet2JSON.java
    // Released under MIT License


    @GetMapping("/players")
    public ResponseEntity<String> getPlayers(@RequestParam(name = "startId", defaultValue = "0") Integer startId,
                             @RequestParam(name = "endId", defaultValue = "50") Integer endId) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT player_id, name, birthday, height, weight FROM Players WHERE player_id >="
                    + startId + " AND player_id < " + endId;
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/playerCount")
    public ResponseEntity<String> getPlayerCount() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT COUNT(*) AS playerCount FROM Players";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/player/{ID}")
    public ResponseEntity<String> getPlayerByID(@PathVariable String ID) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT * FROM Players WHERE player_id = " + ID;
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = util.resultToJsonArray(resultSet, connection);
            statement.close();
            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/predictWinner/{user_id}/{teamName1}/{teamName2}")
    public ResponseEntity<String> predictWinner(@PathVariable String user_id, String teamName1, String teamName2) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String getTeam1Score = "With team_player_ids AS (SELECT player_id from isInUserTeam where user_team_id = (Select user_team_id from UserTeams natural join isOwnerOf where team_name = '" + teamName1 + "' and user_id = "+ user_id +"))" +
                    "(SELECT (sum(finishing) + sum(dribbling) + sum(sprint_speed) + sum(strength) + sum(aggression) + sum(interceptions))/COUNT(*) AS team_score FROM team_player_ids natural join Players);";
            String getTeam2Score = "With team_player_ids AS (SELECT player_id from isInUserTeam where user_team_id = (Select user_team_id from UserTeams natural join isOwnerOf where team_name = '" + teamName2 + "' and user_id = "+ user_id +"))" +
                    "(SELECT (sum(finishing) + sum(dribbling) + sum(sprint_speed) + sum(strength) + sum(aggression) + sum(interceptions))/COUNT(*) AS team_score FROM team_player_ids natural join Players);";

            Statement statement = connection.createStatement();
            ResultSet resultSet1 = statement.executeQuery(getTeam1Score);
            ResultSet resultSet2 = statement.executeQuery(getTeam2Score);
            JSONArray res1 = util.resultToJsonArray(resultSet1, connection);
            JSONArray res2 = util.resultToJsonArray(resultSet2, connection);
            JSONObject object = new JSONObject();

            statement.close();
            System.out.println(res1.get(0));
            return ResponseEntity.ok(res1.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }


}
