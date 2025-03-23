package com.example.quizer.controller;

import java.sql.Connection;
import java.sql.DriverManager;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/")
public class QuizController {

    private final String url = System.getProperty("spring.datasource.url");
    private final String username = System.getProperty("spring.datasource.username");
    private final String password = System.getProperty("spring.datasource.password");

    @GetMapping("/")
    public String hello() {
        return "Hello, World!";
    }

    @GetMapping("/test-db")
    public String testDatabaseConnection() {
        try (Connection connection = DriverManager.getConnection(url, username, password)) {
            if (connection.isValid(2)) { // Check if the connection is valid within 2 seconds
                return "Database connection successful!";
            } else {
                return "Database connection failed: Connection is not valid.";
            }
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}
