"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, CheckCircle, XCircle, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample quiz result data
const quizResult = {
  id: 1,
  title: "Math Fundamentals",
  score: 80,
  totalQuestions: 5,
  correctAnswers: 4,
  timeTaken: "12:45",
  date: "2023-10-15",
  questions: [
    {
      id: 1,
      text: "What is 9 × 7?",
      userAnswer: "b",
      correctAnswer: "b",
      options: [
        { id: "a", text: "56" },
        { id: "b", text: "63" },
        { id: "c", text: "72" },
        { id: "d", text: "81" },
      ],
      isCorrect: true,
      explanation: "9 × 7 = 63",
    },
    {
      id: 2,
      text: "Solve for x: 3x + 5 = 20",
      userAnswer: "b",
      correctAnswer: "b",
      options: [
        { id: "a", text: "x = 3" },
        { id: "b", text: "x = 5" },
        { id: "c", text: "x = 7.5" },
        { id: "d", text: "x = 15" },
      ],
      isCorrect: true,
      explanation: "3x + 5 = 20, 3x = 15, x = 5",
    },
    {
      id: 3,
      text: "What is the area of a circle with radius 4?",
      userAnswer: "b",
      correctAnswer: "c",
      options: [
        { id: "a", text: "8π" },
        { id: "b", text: "12π" },
        { id: "c", text: "16π" },
        { id: "d", text: "64π" },
      ],
      isCorrect: false,
      explanation: "Area of a circle = πr², so πr² = π × 4² = 16π",
    },
    {
      id: 4,
      text: "What is the square root of 144?",
      userAnswer: "a",
      correctAnswer: "a",
      options: [
        { id: "a", text: "12" },
        { id: "b", text: "14" },
        { id: "c", text: "16" },
        { id: "d", text: "24" },
      ],
      isCorrect: true,
      explanation: "√144 = 12",
    },
    {
      id: 5,
      text: "If a rectangle has length 8 and width 6, what is its perimeter?",
      userAnswer: "c",
      correctAnswer: "c",
      options: [
        { id: "a", text: "14" },
        { id: "b", text: "24" },
        { id: "c", text: "28" },
        { id: "d", text: "48" },
      ],
      isCorrect: true,
      explanation: "Perimeter = 2(length + width) = 2(8 + 6) = 2(14) = 28",
    },
  ],
}

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className=" flex h-16 px-5 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/student-dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="font-bold text-xl">Quiz Results</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1  py-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="backdrop-blur-sm bg-card/50 border shadow-lg mb-6">
              <CardHeader className="pb-2">
                <CardTitle>{quizResult.title}</CardTitle>
                <CardDescription>
                  Completed on {new Date(quizResult.date).toLocaleDateString()} · Time taken: {quizResult.timeTaken}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-primary/10">
                    <span className="text-sm text-muted-foreground mb-1">Your Score</span>
                    <span className="text-4xl font-bold">{quizResult.score}%</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {quizResult.correctAnswers} of {quizResult.totalQuestions} correct
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Performance</span>
                          <span className="text-sm font-medium">
                            {quizResult.score >= 90
                              ? "Excellent"
                              : quizResult.score >= 70
                                ? "Good"
                                : quizResult.score >= 50
                                  ? "Average"
                                  : "Needs Improvement"}
                          </span>
                        </div>
                        <Progress
                          value={quizResult.score}
                          className={`h-2 ${
                            quizResult.score >= 90
                              ? "bg-green-500"
                              : quizResult.score >= 70
                                ? "bg-blue-500"
                                : quizResult.score >= 50
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-primary/10">
                          {quizResult.totalQuestions} Questions
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-300">
                          {quizResult.correctAnswers} Correct
                        </Badge>
                        <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-300">
                          {quizResult.totalQuestions - quizResult.correctAnswers} Incorrect
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/student-dashboard" className="w-full">
                  <Button className="w-full gap-2">
                    <Home className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <h2 className="text-2xl font-bold mb-4">Question Review</h2>

            <div className="space-y-4">
              {quizResult.questions.map((question, index) => (
                <Card
                  key={question.id}
                  className={`backdrop-blur-sm border shadow-md ${question.isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                    }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Question {index + 1}
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </CardTitle>
                        <CardDescription>{question.text}</CardDescription>
                      </div>
                      <Badge variant={question.isCorrect ? "default" : "destructive"}>
                        {question.isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center rounded-lg border p-3 ${option.id === question.correctAnswer && option.id === question.userAnswer
                            ? "bg-green-500/10 border-green-500/50"
                            : option.id === question.correctAnswer
                              ? "bg-green-500/10 border-green-500/50"
                              : option.id === question.userAnswer
                                ? "bg-red-500/10 border-red-500/50"
                                : ""
                            }`}
                        >
                          <div className="flex flex-1 items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium">
                              {option.id.toUpperCase()}
                            </div>
                            <span>{option.text}</span>
                          </div>
                          {option.id === question.correctAnswer && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {option.id === question.userAnswer && option.id !== question.correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

