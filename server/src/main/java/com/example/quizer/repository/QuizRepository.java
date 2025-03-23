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

    public void saveQuiz(QuizModel quiz) {
        String sql = "INSERT INTO quiz (total_quiz, correct_answers) VALUES (?, ?)";
        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, quiz.getTotalQuiz());
            stmt.setArray(2, conn.createArrayOf("TEXT", quiz.getCorrectAnswers().toArray()));
          } catch (SQLException e) {
            Logger.getLogger(QuizRepository.class.getName()).log(Level.SEVERE, "Database operation failed", e);
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
