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
            String readMessageQuery = "SELECT P.name, PTH.season FROM footyfiend.Teams as T, footyfiend.PlayerTeamHistory AS PTH,"
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

}
