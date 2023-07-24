package com.example.backend.UserLogin;


import com.example.backend.Constants;
import com.example.backend.util.Util;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

import java.sql.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
            String query = "INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)";

            boolean isValid = true;
            if(password.length()>=8) {
                Pattern letter = Pattern.compile("[a-zA-z]");
                Pattern digit = Pattern.compile("[0-9]");
                Pattern special = Pattern.compile ("[!@#$%&*()_+=|<>?{}\\[\\]~-]");

                Matcher hasLetter = letter.matcher(password);
                Matcher hasDigit = digit.matcher(password);
                Matcher hasSpecial = special.matcher(password);

                isValid = hasLetter.find() && hasDigit.find() && hasSpecial.find();

            } else {
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Password must be 8 characters or longer, and must contain a number and a special character.");
            }

            if (!isValid) {
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Password must be 8 characters or longer, and must contain a number and a special character.");
            }
            // Generate salt and hashed password
            String salt = generateSalt();
            String saltedPassword = salt + password;
            String hashedPassword = hashPassword(saltedPassword);

            preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, email);
            preparedStatement.setString(3, hashedPassword);
            preparedStatement.setString(4, salt);

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to signup.");
        }
    }

    // Helper method to hash the password
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] saltBytes = new byte[16];
        random.nextBytes(saltBytes);
        return Base64.getEncoder().encodeToString(saltBytes);
    }


    // Endpoint for user login authentication
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        String salt = loginRequest.getSalt();

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
            String query = "SELECT user_id, username, email, password, salt FROM users WHERE username = ?";
            preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, username);

            // Execute the query
            resultSet = preparedStatement.executeQuery();
            JSONArray jsonArray = new JSONArray();

            if (resultSet.next()) {
                String storedUsername = resultSet.getString("username");
                String storedPassword = resultSet.getString("password");
                String storedSalt = resultSet.getString("salt");

                // Combine stored salt and entered password and hash them
                String saltedPassword = storedSalt + password;
                String hashedPassword = hashPassword(saltedPassword);

                // Compare the generated hashed password with the stored hashed password
                if (storedPassword.equals(hashedPassword)) {
                    JSONObject userJson = new JSONObject();
                    userJson.put("user_id", resultSet.getInt("user_id"));
                    userJson.put("username", resultSet.getString("username"));
                    userJson.put("email", resultSet.getString("email"));
                    jsonArray.put(userJson);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
                }
            } else {
                // User not found
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }

            return ResponseEntity.ok(jsonArray.toString());
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