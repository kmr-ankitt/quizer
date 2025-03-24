package com.example.quizer.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.example.quizer.model.QuizModel;

public class QuizRepository {

    private final String url = System.getProperty("spring.datasource.url");
    private final String username = System.getProperty("spring.datasource.username");
    private final String password = System.getProperty("spring.datasource.password");

    public void saveQuiz() {
    //     String sql = "INSERT INTO quiz (total_quiz, correct_answers) VALUES (?, ?)";
    //     try (Connection conn = DriverManager.getConnection(url, username, password);
    //          PreparedStatement stmt = conn.prepareStatement(sql)) {
    //         stmt.setInt(1, quiz.getTotalQuiz());
    //         stmt.setArray(2, conn.createArrayOf("TEXT", quiz.getCorrectAnswers().toArray()));
    //       } catch (SQLException e) {
    //         Logger.getLogger(QuizRepository.class.getName()).log(Level.SEVERE, "Database operation failed", e);
    //     }
    // }

            try (Connection conn = DriverManager.getConnection(url, username, password)) {
            
            // Insert into Users
            try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (user_type) VALUES (?)")) {
                stmt.setString(1, "Teacher");
                stmt.executeUpdate();
                
                stmt.setString(1, "Student");
                stmt.executeUpdate();
            }
            
            // Insert into Teacher
            try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO teacher (user_id, name, subject) VALUES (?, ?, ?)")) {
                stmt.setInt(1, 1); // Assuming Teacher is user_id 1
                stmt.setString(2, "John Doe");
                stmt.setString(3, "Mathematics");
                stmt.executeUpdate();
            }
            
            // Insert into Student
            try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO student (user_id, name, registration_number, quiz_attempted, quiz_score) VALUES (?, ?, ?, ?, ?)")) {
                stmt.setInt(1, 2); // Assuming Student is user_id 2
                stmt.setString(2, "Alice Smith");
                stmt.setString(3, "REG12345");
                stmt.setArray(4, conn.createArrayOf("INTEGER", new Integer[]{1, 2}));
                stmt.setArray(5, conn.createArrayOf("INTEGER", new Integer[]{85, 90}));
                stmt.executeUpdate();
            }

            // Insert into Quiz
            try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO quiz (teacher_id, total_quiz, correct_answers) VALUES (?, ?, ?)")) {
                stmt.setInt(1, 1); // Assuming Teacher is teacher_id 1
                stmt.setInt(2, 10);
                stmt.setArray(3, conn.createArrayOf("TEXT", new String[]{"A", "B", "C", "D"}));
                stmt.executeUpdate();
            }
            
            System.out.println("Data inserted successfully.");
        } catch (SQLException e) {
            Logger.getLogger(QuizRepository.class.getName()).log(Level.SEVERE, "Error inserting data", e);
        }
    }

    public List<QuizModel> getAllQuizzes() {
        List<QuizModel> quizzes = new ArrayList<>();
        String sql = "SELECT quiz_number, total_quiz, correct_answers FROM quiz";
        try (Connection conn = DriverManager.getConnection(url, username, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                int quizNumber = rs.getInt("quiz_number");
                int totalQuiz = rs.getInt("total_quiz");
                String[] correctAnswers = (String[]) rs.getArray("correct_answers").getArray();
                quizzes.add(new QuizModel(quizNumber, totalQuiz, Arrays.asList(correctAnswers)));
            }
        } catch (SQLException e) {
            Logger.getLogger(QuizRepository.class.getName()).log(Level.SEVERE, "Error fetching quizzes from database", e);
        }
        return quizzes;
    } 
}
