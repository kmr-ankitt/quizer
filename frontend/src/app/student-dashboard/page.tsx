"use client"

import { useState } from "react"
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

// Sample data
const availableQuizzes = [
  { id: 1, title: "Data Structures", questions: 10, timeLimit: "30 min", dueDate: "2023-10-30" },
  { id: 2, title: "Algorithms", questions: 15, timeLimit: "45 min", dueDate: "2023-11-05" },
  { id: 3, title: "Operating Systems", questions: 20, timeLimit: "60 min", dueDate: "2023-11-10" },
]

const completedQuizzes = [
  { id: 1, title: "Computer Networks", questions: 12, score: 85, date: "2023-09-28" },
  { id: 2, title: "Database Management", questions: 15, score: 92, date: "2023-09-20" },
  { id: 3, title: "Software Engineering", questions: 10, score: 78, date: "2023-09-15" },
]

export default function StudentDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                    {availableQuizzes.map((quiz) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="backdrop-blur-sm bg-card/50 border shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                          <CardHeader>
                            <CardTitle>{quiz.title}</CardTitle>
                            <CardDescription>
                              {quiz.questions} questions · {quiz.timeLimit}
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
                            <Link href={`/quiz/${quiz.id}`} className="w-full">
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
                          <span className="text-3xl font-bold">85%</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10">
                          <span className="text-sm text-muted-foreground">Quizzes Completed</span>
                          <span className="text-3xl font-bold">{completedQuizzes.length}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10">
                          <span className="text-sm text-muted-foreground">Best Score</span>
                          <span className="text-3xl font-bold">92%</span>
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

