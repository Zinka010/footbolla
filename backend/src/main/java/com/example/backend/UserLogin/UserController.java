package com.example.backend.UserLogin;


import com.example.backend.Constants;
import com.example.backend.util.Util;
import org.json.JSONArray;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

import java.sql.*;

@RestController
public class UserController {

    // Endpoint for user signup
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        String username = signupRequest.getUsername();
        String email = signupRequest.getEmail();
        String password = signupRequest.getPassword();

        // Validate that the username and password fields are not empty
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to signup. Passwords must be at least 8 characters long and contain at least one number or special character.");
        }
    }


    // Endpoint for user login authentication
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Validate that the username and password fields are not empty
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
    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteUserAccount(@RequestBody DeleteRequest deleteRequest) {
        String email = deleteRequest.getEmail();
        String password = deleteRequest.getPassword();

        //Validate that the username and password fields are not empty
        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required.");
        }

        try {
            // Create a connection to the database
            Connection connection = DriverManager.getConnection(Constants.url, Constants.username, Constants.password);

            String getUser_idQuery = "SELECT user_id FROM Users WHERE email = '"+ email+"'";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(getUser_idQuery);
            int obtainedID = -1;

            if (resultSet.next()) {
                obtainedID = resultSet.getInt(1);
                System.out.println(obtainedID);
            }

            if (obtainedID > 0) {
                System.out.println(obtainedID);
                String deleteUserTeamQuery = "DELETE FROM UserTeams where user_team_id IN (SELECT user_team_id FROM isOwnerOf where user_id = ?)";
                PreparedStatement preparedStatement_deleteUserTeam = connection.prepareStatement(deleteUserTeamQuery);
                preparedStatement_deleteUserTeam.setInt(1, obtainedID);
                int rowsAffected_deleteUserTeam = preparedStatement_deleteUserTeam.executeUpdate();
            }

            // Prepare the SQL query
            String deleteUserQuery = "DELETE FROM Users WHERE email = ? AND password = ?";

            // Create a prepared statement
            PreparedStatement preparedStatement_deleteUser = connection.prepareStatement(deleteUserQuery);
            preparedStatement_deleteUser.setString(1, email);
            preparedStatement_deleteUser.setString(2, password);

            // Execute the query
            int rowsAffected = preparedStatement_deleteUser.executeUpdate();

            if (rowsAffected == 0) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
            }

            return ResponseEntity.ok("User account deleted successfully");
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}