package com.example.backend.Players;

import com.example.backend.Constants;
import com.example.backend.util.Util;
import org.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.yaml.snakeyaml.events.Event;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PlayerController {

    @GetMapping("/players")
    public ResponseEntity<String> getPlayers(@RequestParam(name = "startId", defaultValue = "0") Integer startId,
                                             @RequestParam(name = "endId", defaultValue = "50") Integer endId) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT player_id, name, birthday, height, weight FROM Players WHERE player_id >="
                    + startId + " AND player_id < " + endId;
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }


    @GetMapping("/playerCount")
    public ResponseEntity<String> getPlayerCount() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT COUNT(*) AS playerCount FROM Players";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }

    public static JSONArray getPlayersById(List<String> IDs) throws SQLException {
        Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

        StringBuilder sb = new StringBuilder();
        sb.append("SELECT * FROM Players WHERE ");

        for (int i = 0; i < IDs.size(); ++i) {
            sb.append("player_id = ");
            sb.append(IDs.get(i));
            if (i != IDs.size() - 1) {
                sb.append(" OR ");
            }
        }

        System.out.println(sb.toString());

        String readMessageQuery =  sb.toString();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(readMessageQuery);
        JSONArray res = Util.resultToJsonArray(resultSet, connection);
        statement.close();

        return res;
    }

    @GetMapping("/player/{ID}")
    public ResponseEntity<String> getPlayerByIDEndpoint(@PathVariable String ID) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            List<String> IDs = new ArrayList<>();
            IDs.add(ID);

            return ResponseEntity.ok(getPlayersById(IDs).toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }
}
