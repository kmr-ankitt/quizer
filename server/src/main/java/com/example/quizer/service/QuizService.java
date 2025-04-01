// package com.example.quizer.service;

// import java.sql.Date;
// import java.sql.PreparedStatement;
// import java.sql.Statement;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.support.GeneratedKeyHolder;
// import org.springframework.jdbc.support.KeyHolder;
// import org.springframework.security.crypto.bcrypt.BCrypt;
// import org.springframework.stereotype.Service;

// import com.fasterxml.jackson.databind.ObjectMapper;

// @Service
// public class QuizService {

//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     public List<Map<String, Object>> getAllQuizzes() {
//         return jdbcTemplate.queryForList("SELECT * FROM quiz");
//     }

//     public Map<String, Object> getQuizById(int id) {
//         String query = "SELECT * FROM quiz WHERE id = ?";
//         List<Map<String, Object>> result = jdbcTemplate.queryForList(query, id);
//         if (result.isEmpty()) {
//             throw new IllegalArgumentException("Quiz with ID " + id + " not found");
//         }
//         return result.get(0);
//     }

//     public Integer createQuiz(Map<String, Object> quizData) {
//         try {
//             // Extract and validate input fields
//             String title = (String) quizData.get("title");
//             String description = (String) quizData.get("description");
//             String difficulty = (String) quizData.get("difficulty");
//             String subject = (String) quizData.get("subject");
//             Integer questionCount = (Integer) quizData.get("questionCount");
//             String timeLimitString = (String) quizData.get("timeLimit");
//             String dueDateString = (String) quizData.get("dueDate");
//             Boolean published = (Boolean) quizData.get("published");
//             Integer teacherId = (Integer) quizData.get("teacherId");
//             List<Map<String, Object>> questions = (List<Map<String, Object>>) quizData.get("questions");

//             if (title == null || questions == null || questions.isEmpty()) {
//                 throw new IllegalArgumentException("Title and questions are required.");
//             }

//             // Convert "30 minutes" to PostgreSQL INTERVAL format (PT30M)
//             String timeLimit = "PT" + timeLimitString.split(" ")[0] + "M";

//             // Insert quiz into quizzes table
//             KeyHolder keyHolder = new GeneratedKeyHolder();
//             String sql = "INSERT INTO quizzes (title, description, difficulty, subject, question_count, time_limit, due_date, published, teacher_id) "
//                     +
//                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

//             jdbcTemplate.update(connection -> {
//                 PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
//                 ps.setString(1, title);
//                 ps.setString(2, description);
//                 ps.setString(3, difficulty);
//                 ps.setString(4, subject);
//                 ps.setInt(5, questionCount);
//                 ps.setObject(6, timeLimit); // PostgreSQL INTERVAL format
//                 ps.setDate(7, Date.valueOf(dueDateString)); // Ensure correct format YYYY-MM-DD
//                 ps.setBoolean(8, published);
//                 ps.setInt(9, teacherId);
//                 return ps;
//             }, keyHolder);

//             Number generatedKey = keyHolder.getKey();
//             if (generatedKey == null) {
//                 throw new RuntimeException("Failed to retrieve generated quiz ID");
//             }
//             Integer quizId = generatedKey.intValue();

//             // Insert questions into the questions table
//             String questionSql = "INSERT INTO questions (quiz_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)";
//             for (Map<String, Object> question : questions) {
//                 jdbcTemplate.update(connection -> {
//                     PreparedStatement ps = connection.prepareStatement(questionSql);
//                     ps.setInt(1, quizId);
//                     ps.setString(2, (String) question.get("question_text"));

//                     // Convert List<String> to JSON for PostgreSQL
//                     String jsonOptions = ObjectMapper.writeValueAsString(question.get("options"));
//                     ps.setString(3, jsonOptions);
//                     ps.setString(4, (String) question.get("correctAnswer"));
//                     return ps;
//                 });
//             }

//             return quizId;
//         } catch (Exception e) {
//             throw new RuntimeException("Database error occurred: " + e.getMessage(), e);
//         }
//     }

//     public List<Map<String, Object>> showQuizzes() {
//         return jdbcTemplate.queryForList("SELECT id, title, difficulty, due_date FROM quiz WHERE published = TRUE");
//     }

//     public List<Map<String, Object>> showStudents(int quizId) {
//         return jdbcTemplate.queryForList(
//                 "SELECT s.student_id, s.name, qa.score FROM quiz_attempt qa JOIN student s ON qa.student_id = s.student_id WHERE qa.quiz_id = ?",
//                 quizId);
//     }

//     public void completeQuiz(int studentId, int quizId, int score) {
//         Integer count = jdbcTemplate.queryForObject(
//                 "SELECT COUNT(*) FROM quiz_attempt WHERE student_id = ? AND quiz_id = ?",
//                 Integer.class, studentId, quizId);

//         if (count != null && count == 0) {
//             jdbcTemplate.update(
//                     "INSERT INTO quiz_attempt (student_id, quiz_id, score, attempt_date) VALUES (?, ?, ?, NOW())",
//                     studentId, quizId, score);
//         }
//     }

//     public List<Map<String, Object>> getAllStudents() {
//         return jdbcTemplate.queryForList("SELECT * FROM student");
//     }

//     public void registerUser(String username, String password, String userType) {
//         String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
//         jdbcTemplate.update("INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)", username,
//                 hashedPassword, userType);
//     }

//     public boolean loginUser(String username, String password) {
//         try {
//             Map<String, Object> user = jdbcTemplate.queryForMap("SELECT * FROM users WHERE username = ?", username);
//             String storedHash = (String) user.get("password");
//             return BCrypt.checkpw(password, storedHash);
//         } catch (org.springframework.dao.EmptyResultDataAccessException e) {
//             return false;
//         } catch (org.springframework.dao.DataAccessException e) {
//             return false;
//         }
//     }
// }

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