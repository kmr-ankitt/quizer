package com.example.quizer;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class QuizRepository {

    private final JdbcTemplate jdbcTemplate;

    public QuizRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createTable() {
        String sql = "CREATE TABLE IF NOT EXISTS quizzes (id INTEGER PRIMARY KEY, name TEXT)";
        jdbcTemplate.execute(sql);
        System.out.println("Table created successfully.");
    }
}

