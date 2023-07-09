package com.example.backend.util;

import org.jooq.Record;
import org.jooq.RecordMapper;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.IntStream;

public class Util {

    // Source https://github.com/eugenp/tutorials/blob/master/persistence-modules/core-java-persistence-2/src/main/java/com/baeldung/resultset2json/ResultSet2JSON.java
    // Released under MIT License
    public static JSONArray resultToJsonArray(ResultSet resultSet, Connection dbConnection) throws SQLException {
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
}
