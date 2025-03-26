package com.example.quizer.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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
                "INSERT INTO quizzes (title, questions, time_limit, due_date) VALUES (?, ?, ?, ?)",
                quizData.get("title"),
                quizData.get("questions"),
                quizData.get("timeLimit"),
                quizData.get("dueDate"));
    }

    public void updateQuiz(int id, Map<String, Object> quizData) {
        jdbcTemplate.update(
                "UPDATE quizzes SET title = ?, questions = ?, time_limit = ?, due_date = ? WHERE id = ?",
                quizData.get("title"),
                quizData.get("questions"),
                quizData.get("timeLimit"),
                quizData.get("dueDate"),
                id);
    }

    public void deleteQuiz(int id) {
        jdbcTemplate.update("DELETE FROM quizzes WHERE id = ?", id);
    }
}
