"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data
const quizzes = [
  { id: 1, title: "Data Structures", questions: 12, students: 30, date: "2023-10-15" },
  { id: 2, title: "Operating Systems", questions: 18, students: 25, date: "2023-10-10" },
  { id: 3, title: "Computer Networks", questions: 22, students: 28, date: "2023-10-05" },
  { id: 4, title: "Database Management", questions: 15, students: 26, date: "2023-09-28" },
  { id: 5, title: "Artificial Intelligence", questions: 20, students: 22, date: "2023-09-20" },
]

const students = [
  { id: 1, name: "Aarav Sharma", email: "aarav@example.com", quizzesTaken: 4, avgScore: 92 },
  { id: 2, name: "Ishita Verma", email: "ishita@example.com", quizzesTaken: 5, avgScore: 78 },
  { id: 3, name: "Rohan Gupta", email: "rohan@example.com", quizzesTaken: 3, avgScore: 88 },
  { id: 4, name: "Ananya Singh", email: "ananya@example.com", quizzesTaken: 5, avgScore: 95 },
  { id: 5, name: "Kabir Patel", email: "kabir@example.com", quizzesTaken: 4, avgScore: 85 },
]


export default function TeacherDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null)

  const handleDeleteQuiz = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-5">
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
              QuizMaster
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Teacher" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Teacher</span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex m-20 flex-1">
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="  py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                  <p className="text-muted-foreground">Manage your quizzes and track student performance</p>
                </div>
              </div>

              <Tabs defaultValue="quizzes" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>


                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search quizzes..." className="pl-8" />
                    </div>

                    <Link href="/teacher-dashboard/create-quiz">
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Create Quiz
                      </Button>
                    </Link>
                  </div>

                  <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                    <CardHeader>
                      <CardTitle>Your Quizzes</CardTitle>
                      <CardDescription>Manage and track all your quizzes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden md:table-cell">Questions</TableHead>
                            <TableHead className="hidden md:table-cell">Students</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quizzes.map((quiz) => (
                            <TableRow key={quiz.id}>
                              <TableCell className="font-medium">{quiz.title}</TableCell>
                              <TableCell className="hidden md:table-cell">{quiz.questions}</TableCell>
                              <TableCell className="hidden md:table-cell">{quiz.students}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(quiz.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setQuizToDelete(quiz.id)
                                        setDeleteDialogOpen(true)
                                      }}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the quiz and all associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteQuiz}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-8" />
                  </div>

                  <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                    <CardHeader>
                      <CardTitle>Your Students</CardTitle>
                      <CardDescription>View and manage student performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden md:table-cell">Quizzes Taken</TableHead>
                            <TableHead>Avg. Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg" alt={student.name} />
                                    <AvatarFallback>
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  {student.name}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                              <TableCell className="hidden md:table-cell">{student.quizzesTaken}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    student.avgScore >= 90
                                      ? "default"
                                      : student.avgScore >= 70
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {student.avgScore}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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

