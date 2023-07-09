package com.example.backend.Players;

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
public class PlayerController {

    /**
     *  Helper function to get players in inclusive range of ID's
     *
     * @param startId Start of the ID range
     * @param endId End of the ID range
     * @param extendedInfo Whether to return all info on the player
     * @return JSONArray containing the result of the function
     * @throws SQLException Throw exception on invalid SQL query
     */
    private JSONArray getPlayersByIdRange(Integer startId, Integer endId, boolean extendedInfo) throws SQLException {
        Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

        StringBuilder sb = new StringBuilder();
        sb.append("SELECT ");

        if (extendedInfo) {
            sb.append(" * ");
        } else {
            sb.append(" player_id, name, birthday, height, weight ");
        }

        sb.append("FROM Players WHERE player_id >= ");
        sb.append(startId);
        sb.append(" AND player_id  <= ");
        sb.append(endId);

        String readMessageQuery =  sb.toString();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(readMessageQuery);
        JSONArray res = Util.resultToJsonArray(resultSet, connection);
        statement.close();

        return res;
    }

    @GetMapping("/players")
    public ResponseEntity<String> getPlayers(@RequestParam(name = "startId", defaultValue = "0") Integer startId,
                                             @RequestParam(name = "endId", defaultValue = "50") Integer endId) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            return ResponseEntity.ok(getPlayersByIdRange(startId, endId, false).toString());
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

    @GetMapping("/player/{ID}")
    public ResponseEntity<String> getPlayerByIDEndpoint(@PathVariable Integer ID) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            return ResponseEntity.ok(getPlayersByIdRange(ID, ID, true).toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }
}
