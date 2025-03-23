package com.example.quizer.model;

import java.util.List;

public class QuizModel {
    private int quizNumber;
    private int totalQuiz;
    private List<String> correctAnswers;

    public QuizModel(int quizNumber, int totalQuiz, List<String> correctAnswers) {
        this.quizNumber = quizNumber;
        this.totalQuiz = totalQuiz;
        this.correctAnswers = correctAnswers;
    }

    public int getQuizNumber() {
        return quizNumber;
    }

    public void setQuizNumber(int quizNumber) {
        this.quizNumber = quizNumber;
    }

    public int getTotalQuiz() {
        return totalQuiz;
    }

    public void setTotalQuiz(int totalQuiz) {
        this.totalQuiz = totalQuiz;
    }

    public List<String> getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(List<String> correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
}
