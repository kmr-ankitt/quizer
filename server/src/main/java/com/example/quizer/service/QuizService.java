package com.example.quizer.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getAllQuizzes() {
        return jdbcTemplate.queryForList("SELECT * FROM quiz");
    }

    public Optional<Map<String, Object>> getQuizById(int id) {
        String query = "SELECT * FROM quiz WHERE id = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(query, id);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public List<Map<String, Object>> showQuizzes() {
        return jdbcTemplate.queryForList("SELECT id, title, difficulty, due_date FROM quiz WHERE published = TRUE");
    }

    public List<Map<String, Object>> showStudents(int quizId) {
        return jdbcTemplate.queryForList(
                "SELECT s.student_id, s.name, qa.score FROM quiz_attempt qa JOIN student s ON qa.student_id = s.student_id WHERE qa.quiz_id = ?",
                quizId);
    }

    public void completeQuiz(int studentId, int quizId, int score) {
        int count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM quiz_attempt WHERE student_id = ? AND quiz_id = ?",
                Integer.class, studentId, quizId);

        if (count == 0) {
            jdbcTemplate.update(
                    "INSERT INTO quiz_attempt (student_id, quiz_id, score, attempt_date) VALUES (?, ?, ?, NOW())",
                    studentId, quizId, score);
        }
    }

    public List<Map<String, Object>> getAllStudents() {
        return jdbcTemplate.queryForList("SELECT * FROM student");
    }

    public void registerUser(String username, String password, String userType) {
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        jdbcTemplate.update("INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)", username,
                hashedPassword, userType);
    }

    public boolean loginUser(String username, String password) {
        try {
            Map<String, Object> user = jdbcTemplate.queryForMap("SELECT * FROM users WHERE username = ?", username);
            return BCrypt.checkpw(password, (String) user.get("password"));
        } catch (Exception e) {
            return false;
        }
    }
}
