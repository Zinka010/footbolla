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
        String username = "PUT_USERNAME_HERE"; // our default username is root
        String password = "PUT_PASSWORD_HERE"; // our default password is password
        String dbName = "test_db"; // our current db name is test_db

        String url = "jdbc:mysql://127.0.0.1:3306/" + dbName;
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(url, username, password);
            System.out.println(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String createStatement = "CREATE TABLE test_table (message varchar(255))";
        try {
            Statement statement = connection.createStatement();
            boolean resultSet = statement.execute(createStatement);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String addMessageQuery = "INSERT INTO test_table VALUES (\"Hello World\")";
        try {
            Statement statement = connection.createStatement();
            boolean resultSet = statement.execute(addMessageQuery);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String readMessageQuery = "SELECT message FROM test_table";
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(readMessageQuery);
            resultSet.next();
            name = resultSet.getString(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String dropTableQuery = "DROP TABLE test_table";

        try {
            Statement statement = connection.createStatement();
            boolean resultSet = statement.execute(dropTableQuery);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Going to http://localhost:8080/hello should return "Hello Hello World" since name = "Hello World" (from the DB).
        return String.format("Hello %s!", name);
    }
}
