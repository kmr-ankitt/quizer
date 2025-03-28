package com.example.quizer.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quizer.ai.QuizGenerate;
import com.example.quizer.service.QuizService;

@RestController()
@RequestMapping("/")
public class QuizController {

    private final String url = System.getProperty("spring.datasource.url");
    private final String username = System.getProperty("spring.datasource.username");
    private final String password = System.getProperty("spring.datasource.password");

    @PostMapping("/generate-quiz")
    public ResponseEntity<String> generateQuiz(@RequestBody Map<String, String> params) {
        String topic = params.get("topic");
        String difficulty = params.get("difficulty");
        int numberOfQuestions = Integer.parseInt(params.get("numberOfQuestions"));

        QuizGenerate quizGenerate = new QuizGenerate();
        String result = quizGenerate.generateQuizQuestions(topic, difficulty, numberOfQuestions);

        return ResponseEntity.ok(result);
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

    @Autowired
    private QuizService quizService;

    @GetMapping("/quizzes")
    public List<Map<String, Object>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getQuizById(@PathVariable int id) {
        return quizService.getQuizById(id);
    }

    @PostMapping("/set-quiz")
    public String createQuiz(@RequestBody Map<String, Object> quizData) {
        quizService.createQuiz(quizData);
        return "Quiz Created Successfully!";
    }

    @PutMapping("/{id}")
    public String updateQuiz(@PathVariable int id, @RequestBody Map<String, Object> quizData) {
        quizService.updateQuiz(id, quizData);
        return "Quiz Updated Successfully!";
    }

    @DeleteMapping("/{id}")
    public String deleteQuiz(@PathVariable int id) {
        quizService.deleteQuiz(id);
        return "Quiz Deleted Successfully!";
    }

}
