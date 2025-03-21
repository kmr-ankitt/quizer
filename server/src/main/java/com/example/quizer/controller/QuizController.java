package com.example.quizer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/")
public class QuizController {
    @GetMapping("/") 
    public String hello() {
        return "Hello, World!";
    }
}
