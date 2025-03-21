package com.example.quizer.runner;

import com.example.quizer.model.Quiz;
import com.example.quizer.repository.QuizRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseRunner implements CommandLineRunner {

    private final QuizRepository quizRepository;

    public DatabaseRunner(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Inserting initial data...");
        quizRepository.save(new Quiz("Java Basics"));
        quizRepository.save(new Quiz("Spring Boot Fundamentals"));
        System.out.println("Initial data inserted.");
    }
}

