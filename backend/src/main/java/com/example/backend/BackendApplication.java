package com.example.backend;

import org.jooq.Record;
import org.jooq.RecordMapper;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@SpringBootApplication
@RestController
public class BackendApplication {

    final String username = "root"; // our default username is root
    final String password = "password"; // our default password is password
    final String dbName = "footyfiend"; // our current db name is footy_fiend
    final String url = "jdbc:mysql://127.0.0.1:3306/" + dbName;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    // Source https://github.com/eugenp/tutorials/blob/master/persistence-modules/core-java-persistence-2/src/main/java/com/baeldung/resultset2json/ResultSet2JSON.java
    // Released under MIT License
    private static JSONArray resultToJsonArray(ResultSet resultSet, Connection dbConnection) throws SQLException {
        ResultSetMetaData md = resultSet.getMetaData();
        int numCols = md.getColumnCount();
        List<String> colNames = IntStream.range(0, numCols)
                .mapToObj(i -> {
                    try {
                        return md.getColumnName(i + 1);
                    } catch (SQLException e) {

                        e.printStackTrace();
                        return "?";
                    }
                })
                .toList();

        List<JSONObject> json = DSL.using(dbConnection)
                .fetch(resultSet)
                .map(new RecordMapper<Record, JSONObject>() {

                    @Override
                    public JSONObject map(Record r) {
                        JSONObject obj = new JSONObject();
                        colNames.forEach(cn -> obj.put(cn, r.get(cn)));
                        return obj;
                    }
                });
        return new JSONArray(json);
    }

    @GetMapping("/players")
    public String getPlayers(@RequestParam(name = "startId", defaultValue = "0") Integer startId,
                             @RequestParam(name = "endId", defaultValue = "50") Integer endId) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT player_id, name, birthday, height, weight FROM Players WHERE player_id >="
                    + startId + " AND player_id < " + endId;
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = resultToJsonArray(resultSet, connection);

            return res.toString();
        } catch (SQLException e) {
            e.printStackTrace();
            return String.format("Unable to parse JSON: %s", e);
        }
    }

    @GetMapping("/playerCount")
    public String getPlayerCount() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT COUNT(*) AS playerCount FROM Players";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = resultToJsonArray(resultSet, connection);

            return res.toString();
        } catch (SQLException e) {
            e.printStackTrace();
            return String.format("Unable to parse JSON: %s", e);
        }
    }

    @GetMapping("/player/{ID}")
    public String getPlayerByID(@PathVariable String ID) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT * FROM Players WHERE player_id = " + ID;
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = resultToJsonArray(resultSet, connection);

            return res.toString();
        } catch (SQLException e) {
            e.printStackTrace();
            return String.format("Unable to parse JSON: %s", e);
        }
    }

    
}
