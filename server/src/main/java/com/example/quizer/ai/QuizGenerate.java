package com.example.quizer.ai;

import java.io.IOException;

import org.apache.http.HttpException;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

public class QuizGenerate {
    private final String GEMINI_API_KEY = System.getProperty("GEMINI_API_KEY");
    Client client = Client.builder().apiKey(GEMINI_API_KEY).build();

    public String generateQuizQuestions(String subject, String difficulty, int numberOfQuestions) {
        try {
            String prompt = String.format("""
                    Create %d multiple-choice quiz questions about %s at a %s difficulty level.

                    For each question:
                    1. Provide a clear question text
                    2. Create 4 possible answers labeled a, b, c, and d
                    3. Indicate which answer is correct

                    Format your response as a valid JSON array with the following structure:
                    [
                      {
                        "id": 1,
                        "text": "Question text here?",
                        "options": [
                          { "id": "a", "text": "First option" },
                          { "id": "b", "text": "Second option" },
                          { "id": "c", "text": "Third option" },
                          { "id": "d", "text": "Fourth option" }
                        ],
                        "correctAnswer": "a"
                      },
                      ...more questions
                    ]

                    Make sure the questions are appropriate for %s level students studying %s.
                    Ensure the JSON is valid with no trailing commas.""",
                    numberOfQuestions, subject, difficulty, difficulty, subject);

            GenerateContentResponse response = client.models.generateContent("gemini-2.0-flash-001", prompt, null);
            String responseText = response.text();

            System.out.println("Response: " + responseText);
            return responseText;
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
            return "Error: " + e.getMessage();
        } catch (HttpException e) {
            System.out.println("HTTP Error: " + e.getMessage());
            return "HTTP Error: " + e.getMessage();
        } catch (Exception e) {
            System.out.println("Unexpected Error: " + e.getMessage());
            return "Unexpected Error: " + e.getMessage();
        }
    }
}
