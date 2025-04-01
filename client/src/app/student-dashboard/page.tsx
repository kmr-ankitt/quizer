"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Menu, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { fetchAllQuizzes, fetchCompletedQuizzes } from "../_services/fetchDb"

export default function StudentDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [completedQuizzes, setCompletedQuizzes] = useState<any>([])
  const router = useRouter()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await fetchAllQuizzes()
        const completedQuizzesResult = (await fetchCompletedQuizzes()) || []
        const [completedQuiz] = completedQuizzesResult
        setQuizzes(fetchedQuizzes)
        setCompletedQuizzes(completedQuiz)
      } catch (error) {
        console.error("Failed to fetch quizzes:", error)
      }
    }
    fetchQuizzes()
  }, [])

  console.log(completedQuizzes)
  const logout = () => {
    localStorage.removeItem("session")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="   flex p-5 h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <Link href="/" className="font-bold text-xl">
              Quizer
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Student" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Student</span>
            </div>
            <div>
              <Button variant="outline" className="hidden md:flex" onClick={logout}>
                Logout
              </Button>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1">

        {/* Main content */}
        <main className="flex-1 overflow-auto m-15">
          <div className="   py-6">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground">View and take quizzes, track your performance</p>
              </div>

              <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                  <TabsTrigger value="available">Available Quizzes</TabsTrigger>
                  <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
                </TabsList>

                {/* Available Quizzes Tab */}
                <TabsContent value="available" className="space-y-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search quizzes..." className="pl-8" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.flat().map((quiz, index) => (
                      <motion.div
                        key={quiz.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="backdrop-blur-sm bg-card/50 border shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                          <CardHeader>
                            <CardTitle>{quiz.title}</CardTitle>
                            <CardDescription>
                              {quiz.questionCount} questions · {quiz.timeLimit} min
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                              <Clock className="h-4 w-4" />
                              <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>Not started</span>
                              </div>
                              <Progress value={0} className="h-2" />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Link href={`/quiz/${index}`} className="w-full">
                              <Button className="w-full">Start Quiz</Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                {/* Completed Quizzes Tab */}
                <TabsContent value="completed" className="space-y-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search completed quizzes..." className="pl-8" />
                  </div>

                  <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                    <CardHeader>
                      <CardTitle>Your Results</CardTitle>
                      <CardDescription>View your quiz history and performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quiz</TableHead>
                            <TableHead className="hidden md:table-cell">Questions</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedQuizzes.map((quiz) => (
                            <TableRow key={quiz.id}>
                              <TableCell className="font-medium">{quiz.title}</TableCell>
                              <TableCell className="hidden md:table-cell">{quiz.questions}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    quiz.score >= 90
                                      ? "default"
                                      : quiz.score >= 70
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {quiz.score}%
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(quiz.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Link href={`/quiz-results/${quiz.id}`}>
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                      <CardDescription>Your overall quiz performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10">
                          <span className="text-sm text-muted-foreground">Average Score</span>
                          <span className="text-3xl font-bold">
                            {completedQuizzes.length > 0
                              ? `${(
                                completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) /
                                completedQuizzes.length
                              ).toFixed(2)}%`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10">
                          <span className="text-sm text-muted-foreground">Quizzes Completed</span>
                          <span className="text-3xl font-bold">{completedQuizzes.length}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10">
                          <span className="text-sm text-muted-foreground">Best Score</span>
                          <span className="text-3xl font-bold">
                            {completedQuizzes.length > 0
                              ? `${Math.max(...completedQuizzes.map((quiz) => quiz.score))}%`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}