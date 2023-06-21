package com.example.backend;

import org.jooq.RecordMapper;
import org.jooq.impl.DSL;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.*;
import java.util.List;

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

    @GetMapping("/players")
    public String getPlayers(@RequestParam(name = "startId", defaultValue = "0") Integer startId,
                             @RequestParam(name = "endId", defaultValue = "50") Integer endId) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            String readMessageQuery = "SELECT player_id, name, birthday, height, weight FROM Players WHERE player_id >="
                    + startId + " AND player_id < " + endId;
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONObject result = new JSONObject(DSL.using(connection)
                    .fetch(resultSet)
                    .formatJSON());

            return result.toString();
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
            JSONObject result = new JSONObject(DSL.using(connection)
                    .fetch(resultSet)
                    .formatJSON());

            return result.toString();
        } catch (SQLException e) {
            e.printStackTrace();
            return String.format("Unable to parse JSON: %s", e);
        }
    }


}
