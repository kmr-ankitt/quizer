package com.example.quizer.ai;

import java.io.IOException;

import org.apache.http.HttpException;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

public class QuizGenerate {
    private final String GEMINI_API_KEY = System.getProperty("GEMINI_API_KEY");
    Client client = Client.builder().apiKey(GEMINI_API_KEY).build();

    public String generateQuiz(String input) {
        try {
            GenerateContentResponse response = client.models.generateContent("gemini-2.0-flash-001",
                    input, null);
            return response.text();
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
            return e.getMessage();
        } catch (HttpException e) {
            System.out.println("HTTP Error: " + e.getMessage());
            return e.getMessage();
        }
    }
}