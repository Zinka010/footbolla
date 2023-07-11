package com.example.backend.Leagues;

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
public class LeagueController {
    @GetMapping("/league")
    public ResponseEntity<String> getLeagues(@RequestParam(name = "startIdx", defaultValue = "0") Integer startIdx,
                                           @RequestParam(name = "endIdx", defaultValue = "50") Integer endIdx
    ) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

            // Since LIMIT A, B returns B starting at row A
            if (startIdx > endIdx) {
                startIdx = 0;
                endIdx = 50;
            }

            String readMessageQuery = "SELECT league_id, league_name FROM Leagues ORDER BY league_name"
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

    @GetMapping("/league/{league_id}")
    public ResponseEntity<String> getLeagues(@PathVariable String league_id) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);


            String readMessageQuery = "SELECT * FROM Leagues WHERE league_id = " + league_id;

            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    @GetMapping("/leagueCount")
    public ResponseEntity<String> getLeagueCount() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT COUNT(*) AS leagueCount FROM Leagues";
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
