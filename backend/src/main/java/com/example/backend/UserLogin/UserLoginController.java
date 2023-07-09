package com.example.backend.UserLogin;


import com.example.backend.Constants;
import com.example.backend.util.Util;
import org.json.JSONArray;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
public class UserLoginController {

    // Endpoint for user signup
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        String username = signupRequest.getUsername();
        String email = signupRequest.getEmail();
        String password = signupRequest.getPassword();

        // Perform validation on username and password
        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required.");
        }

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            // Connect to the MySQL database
            connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

            // Check if the username is already taken
            String checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
            preparedStatement = connection.prepareStatement(checkUsernameQuery);
            preparedStatement.setString(1, username);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                // User already exists
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken.");
            }

            // Check if an account with this email already exists
            String checkEmailQuery = "SELECT * FROM users WHERE email = ?";
            preparedStatement = connection.prepareStatement(checkEmailQuery);
            preparedStatement.setString(1, email);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                // User already exists
                return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email ID already exists.");
            }

            // If username, email, and password are all valid,  store the information in the users table
            String query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, email);
            preparedStatement.setString(3, password);

            // Execute the query
            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
                // User signup successful
                return ResponseEntity.ok("User signup successful.");
            } else {
                // User signup failed
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to signup.");
            }
        } catch (SQLException e) {
            // Handle any database errors
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }


    // Endpoint for user login authentication
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        //Validate that the username and password fields are not empty
        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required.");
        }

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            // Connect to the MySQL database
            connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

            // Prepare the SQL statement
            String query = "SELECT user_id, username, email FROM users WHERE username = ? AND password = ?";
            preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, password);

            // Execute the query
            resultSet = preparedStatement.executeQuery();
            JSONArray res = Util.resultToJsonArray(resultSet, connection);

            // Check if the user exists and credentials are correct
            if (res.length() > 0) {
                return ResponseEntity.ok(res.toString());
            } else {
                // User authentication failed
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
            }
        } catch (SQLException e) {
            // Handle any database errors
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
}