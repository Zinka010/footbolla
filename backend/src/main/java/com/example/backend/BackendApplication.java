package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.*;

@SpringBootApplication
@RestController
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @GetMapping("/hello")
    public String sayHello(@RequestParam(value = "myName", defaultValue = "World") String name) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        String username = "root"; // our default username is root
        String password = "password"; // our default password is password
        String dbName = "test_db"; // our current db name is test_db

        String url = "jdbc:mysql://127.0.0.1:3306/" + dbName;
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String readMessageQuery = "SELECT * FROM test_table";
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            resultSet.next();
            name = resultSet.getString(2);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Going to http://localhost:8080/hello should return "Hello HelloWorld" since name = "Hello World" (from the DB).
        return String.format("Hello %s!", name);
    }
}
