package com.example.quizer.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @Autowired
    private QuizService quizService;

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

    @GetMapping("/quiz")
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

    @GetMapping("/show-quizzes")
    public List<Map<String, Object>> showQuizzes() {
        return quizService.showQuizzes();
    }

    @GetMapping("/show-students/{quizId}")
    public List<Map<String, Object>> showStudents(@PathVariable int quizId) {
        return quizService.showStudents(quizId);
    }

    @PostMapping("/complete-quiz")
    public String completeQuiz(@RequestBody Map<String, Integer> data) {
        int studentId = data.get("studentId");
        int quizId = data.get("quizId");
        int score = data.get("score");
        quizService.completeQuiz(studentId, quizId, score);
        return "Quiz Completed Successfully!";
    }

    @GetMapping("/students")
    public List<Map<String, Object>> getAllStudents() {
        return quizService.getAllStudents();
    }
}
