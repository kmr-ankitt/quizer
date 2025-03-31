package com.example.quizer.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getAllQuizzes() {
        return jdbcTemplate.queryForList("SELECT * FROM quizzes");
    }

    public Map<String, Object> getQuizById(int id) {
        return jdbcTemplate.queryForMap("SELECT * FROM quizzes WHERE id = ?", id);
    }

    public void createQuiz(Map<String, Object> quizData) {
        jdbcTemplate.update(
                "INSERT INTO quizzes (title, description, difficulty, questions, time_limit, due_date, published) VALUES (?, ?, ?, ?, ?, ?, ?)",
                quizData.get("title"),
                quizData.get("description"),
                quizData.get("difficulty"),
                quizData.get("questions"),
                quizData.get("timeLimit"),
                quizData.get("dueDate"),
                quizData.get("published"));
    }

    public List<Map<String, Object>> showQuizzes() {
        return jdbcTemplate.queryForList("SELECT id, title, difficulty, due_date FROM quizzes WHERE published = TRUE");
    }

    public List<Map<String, Object>> showStudents(int quizId) {
        return jdbcTemplate.queryForList(
                "SELECT s.student_id, s.name, qa.score FROM quiz_attempt qa JOIN students s ON qa.student_id = s.student_id WHERE qa.quiz_id = ?",
                quizId);
    }

    public void completeQuiz(int studentId, int quizId, int score) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM quiz_attempt WHERE student_id = ? AND quiz_id = ?",
                Integer.class, studentId, quizId);

        if (count != null && count == 0) {
            jdbcTemplate.update(
                    "INSERT INTO quiz_attempt (student_id, quiz_id, score, attempt_date) VALUES (?, ?, ?, NOW())",
                    studentId, quizId, score);
        }
    }

    public List<Map<String, Object>> getAllStudents() {
        return jdbcTemplate.queryForList("SELECT * FROM students");
    }

    public void registerUser(String username, String password, String userType) {
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        jdbcTemplate.update("INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)", username,
                hashedPassword, userType);
    }

    public boolean loginUser(String username, String password) {
        try {
            Map<String, Object> user = jdbcTemplate.queryForMap("SELECT * FROM users WHERE username = ?", username);
            String storedHash = (String) user.get("password");
            return BCrypt.checkpw(password, storedHash);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return false;
        } catch (org.springframework.dao.DataAccessException e) {
            return false;
        }
    }
}
