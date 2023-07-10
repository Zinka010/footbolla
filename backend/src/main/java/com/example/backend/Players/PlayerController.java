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
import java.util.Objects;

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

    @GetMapping("/getWithFilters")
    public ResponseEntity<String> getWithFilter(@RequestParam(name = "team", defaultValue = "") String team, @RequestParam(name = "league", defaultValue = "") String league,
                                                @RequestParam(name = "position", defaultValue = "-1") Integer position, @RequestParam(name = "playerName", defaultValue = "") String playerName,
                                                @RequestParam(name = "rating", defaultValue = "false") boolean rating, @RequestParam(name = "speed", defaultValue = "false") boolean speed,
                                                @RequestParam(name = "startId", defaultValue = "0") Integer startId, @RequestParam(name = "endId", defaultValue = "50") Integer endId) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        try {
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);
            String readMessageQuery = "SELECT * ";

            if (!Objects.equals(team, "")){
                readMessageQuery = readMessageQuery + "FROM Teams WHERE Teams.team_long_name LIKE '%" + team + "%'";
            } else if (!Objects.equals(league, "")){
                readMessageQuery = readMessageQuery + "FROM Leagues WHERE Leagues.league_name LIKE '%" + league + "%'";
            } else if (!Objects.equals(position, -1) || !Objects.equals(playerName, "")){
                readMessageQuery = readMessageQuery + "FROM Players WHERE player_id >= " + startId + " AND player_id <= " + endId + " AND ";
                if (!Objects.equals(playerName, "")){
                    readMessageQuery = readMessageQuery + "Players.name LIKE '%" + playerName + "%'";
                }
                if (!Objects.equals(position, -1) && !Objects.equals(playerName, "")){
                    readMessageQuery = readMessageQuery + " AND ";
                }
                if (!Objects.equals(position, -1)){
                    readMessageQuery = readMessageQuery + "Players.positioning = " + position;
                }
            }

            if (rating || speed){
                if (Objects.equals(position, -1) && Objects.equals(playerName, "")){
                    readMessageQuery = readMessageQuery + "FROM PLAYERS WHERE player_id >= " + startId + " AND player_id <= " + endId;
                }
                readMessageQuery += " ORDER BY";
                if (rating){
                    readMessageQuery = readMessageQuery + " PLAYERS.overall_rating";
                }
                if (rating && speed){
                    readMessageQuery = readMessageQuery + ",";
                }
                if (speed){
                    readMessageQuery = readMessageQuery + " PLAYERS.sprint_speed";
                }
            }
            System.out.println(readMessageQuery);
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            JSONArray res = Util.resultToJsonArray(resultSet, connection);
            statement.close();
            return ResponseEntity.ok(res.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(String.format("Unable to parse JSON: %s", e));
        }
    }
}
