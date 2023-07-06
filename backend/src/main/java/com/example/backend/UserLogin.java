package com.example.backend;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
public class AuthenticationApplication {

    final String username = "root"; // our default username is root
    final String password = "password"; // our default password is password
    final String dbName = "footyfiend"; // our current db name is footy_fiend
    final String url = "jdbc:mysql://127.0.0.1:3306/" + dbName;


    // Endpoint for user signup
    @PostMapping("/signup")
    @Transactional
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
            connection = DriverManager.getConnection(this.url, this.username, this.password);

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
        // } finally {
        //     // Close the database resources
        //     try {
        //         if (preparedStatement != null) {
        //             preparedStatement.close();
        //         }
        //         if (connection != null) {
        //             connection.close();
        //         }
        //     } catch (SQLException e) {
        //         e.printStackTrace();
        //     }
        // }
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
            connection = DriverManager.getConnection(this.url, this.username, this.password);

            // Prepare the SQL statement
            String query = "SELECT * FROM users WHERE username = ? AND password = ?";
            preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, password);

            // Execute the query
            resultSet = preparedStatement.executeQuery();

            // Check if the user exists and credentials are correct
            if (resultSet.next()) {
                // User authentication successful
                return ResponseEntity.ok("Authentication successful.");
            } else {
                // User authentication failed
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
            }
        } catch (SQLException e) {
            // Handle any database errors
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        // } finally {
        //     // Close the database resources
        //     try {
        //         if (resultSet != null) {
        //             resultSet.close();
        //         }
        //         if (preparedStatement != null) {
        //             preparedStatement.close();
        //         }
        //         if (connection != null) {
        //             connection.close();
        //         }
        //     } catch (SQLException e) {
        //         e.printStackTrace();
        //     }
        // }
        }
    }

    public static class SignupRequest {
        private String username;
        private String email;
        private String password;

        // Getters and setters

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and setters

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}