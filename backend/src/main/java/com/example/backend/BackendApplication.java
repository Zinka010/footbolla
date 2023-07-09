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


}
