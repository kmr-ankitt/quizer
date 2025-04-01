"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchAllQuizzes } from "@/app/_services/fetchDb"

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0) // seconds
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [quizData, setQuizData] = useState<{
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    timeLimit: string;
    dueDate: string;
    published: boolean;
    questions: {
      id: number;
      question_text: string;
      options: {
        id: string;
        text: string;
      }[];
      correctAnswer: string;
    }[];
    questionCount: number;
  } | null>(null);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then((resolvedParams) => setUnwrappedParams(resolvedParams))
  }, [params])

  useEffect(() => {
    if (!unwrappedParams) return

    const fetchQuiz = async () => {
      try {
        const quizzes = await fetchAllQuizzes()
        const [quiz] = quizzes.find((_, index: number) => index === Number(unwrappedParams.id))
        if (quiz) {
          setQuizData(quiz)
          setTimeRemaining(quiz.timeLimit * 60)
        } else {
          console.error("Quiz not found")
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error)
      }
    }
    fetchQuiz()
  }, [unwrappedParams])

  console.log(quizData)

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const handleAnswer = (value: string) => {
    if (quizData) {
      const updatedAnswers = {
        ...answers,
        [quizData.questions[currentQuestion].id]: value,
      }
      setAnswers(updatedAnswers)
      localStorage.setItem(`${quizData.title.trim().replace(/\s+/g, "-").toLowerCase()}-ans`, JSON.stringify(updatedAnswers))
    }
  }

  const handleNext = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    if (unwrappedParams) {
      router.push(`/quiz-results/${unwrappedParams.id}`)
    }
  }

  const progress = quizData
    ? ((currentQuestion + 1) / quizData.questions.length) * 100
    : 0

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  if (!quizData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex px-5 h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setExitDialogOpen(true)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-bold text-xl">{quizData.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {formatTime(timeRemaining)}
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </span>
              <span className="text-sm font-medium">{progress.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-card/50 border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">{quizData.questions[currentQuestion].question_text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[quizData.questions[currentQuestion].id] || ""}
                    onValueChange={handleAnswer}
                    className="space-y-3"
                  >
                    {quizData.questions[currentQuestion].options.map((option: { id: string; text: string }) => (
                      <div
                        key={option.id}
                        className={`flex items-center rounded-lg border p-4 transition-colors ${answers[quizData.questions[currentQuestion].id] === option.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                          }`}
                      >
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} className="sr-only" />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="flex flex-1 cursor-pointer items-center gap-2 font-normal"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-sm font-medium">
                            {option.id.toUpperCase()}
                          </div>
                          <span>{option.text}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    Previous
                  </Button>
                  {currentQuestion < quizData.questions.length - 1 ? (
                    <Button onClick={handleNext} disabled={!answers[quizData.questions[currentQuestion].id]}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSubmitDialogOpen(true)}
                      disabled={!answers[quizData.questions[currentQuestion].id]}
                    >
                      Submit Quiz
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {quizData.questions.map((question: { id: number; question_text: string; options: { id: string; text: string }[]; correctAnswer: string }, index: number) => (
              <Button
                key={question.id}
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${currentQuestion === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : answers[question.id]
                    ? "bg-primary/10"
                    : ""
                  }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* Exit Quiz Dialog */}
      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will not be saved. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/student-dashboard">
                <Button variant="destructive">Exit Quiz</Button>
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Quiz Dialog */}
      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {Object.keys(answers).length === quizData.questions.length ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>You have answered all questions.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span>
                    You have answered {Object.keys(answers).length} out of {quizData.questions.length} questions.
                  </span>
                </div>
              )}
              <div className="mt-2">Are you sure you want to submit your quiz?</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit Quiz</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
