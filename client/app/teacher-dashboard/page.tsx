"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
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
import { useToast } from "@/components/ui/use-toast"
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

const barChartData = [
  { name: "Data Structures", avgScore: 82 },
  { name: "Operating Systems", avgScore: 88 },
  { name: "Computer Networks", avgScore: 76 },
  { name: "Database Management", avgScore: 84 },
  { name: "Artificial Intelligence", avgScore: 79 },
]

const pieChartData = [
  { name: "90-100%", value: 15, color: "#10b981" },
  { name: "80-89%", value: 20, color: "#3b82f6" },
  { name: "70-79%", value: 10, color: "#6366f1" },
  { name: "Below 70%", value: 5, color: "#f43f5e" },
]

export default function TeacherDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  const handleDeleteQuiz = () => {
    toast({
      title: "Quiz deleted",
      description: "The quiz has been successfully deleted.",
    })
    setDeleteDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
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

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col gap-1 p-4">
            <Link href="/teacher-dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/teacher-dashboard/quizzes">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Quizzes
              </Button>
            </Link>
            <Link href="/teacher-dashboard/students">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Students
              </Button>
            </Link>
          </div>
          <div className="mt-auto p-4 border-t">
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </aside>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 w-full bg-background md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="font-bold text-xl">Menu</div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <Link href="/teacher-dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/teacher-dashboard/quizzes" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <BookOpen className="h-4 w-4" />
                    Quizzes
                  </Button>
                </Link>
                <Link href="/teacher-dashboard/students" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Students
                  </Button>
                </Link>
              </div>
              <div className="mt-auto p-4 border-t">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                  <p className="text-muted-foreground">Manage your quizzes and track student performance</p>
                </div>
                <Link href="/teacher-dashboard/create-quiz">
                  <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create Quiz
                  </Button>
                </Link>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total Quizzes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{quizzes.length}</div>
                        <p className="text-sm text-muted-foreground">5 active quizzes</p>
                      </CardContent>
                    </Card>
                    <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total Students</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{students.length}</div>
                        <p className="text-sm text-muted-foreground">3 active now</p>
                      </CardContent>
                    </Card>
                    <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">85%</div>
                        <p className="text-sm text-muted-foreground">+2% from last month</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                      <CardHeader>
                        <CardTitle>Quiz Performance</CardTitle>
                        <CardDescription>Average scores by subject</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="avgScore" fill="hsl(var(--primary))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                      <CardHeader>
                        <CardTitle>Score Distribution</CardTitle>
                        <CardDescription>Student performance breakdown</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Legend />
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest quiz submissions and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Sam Wilson completed "Science Quiz"</p>
                            <p className="text-xs text-muted-foreground">Score: 92% · 2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Jamie Smith completed "Math Fundamentals"</p>
                            <p className="text-xs text-muted-foreground">Score: 78% · 5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">You created "Geography Challenge"</p>
                            <p className="text-xs text-muted-foreground">15 questions · 1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search quizzes..." className="pl-8" />
                    </div>
                    <Link href="/teacher-dashboard/create-quiz">
                      <Button className="gap-2 w-full md:w-auto">
                        <Plus className="h-4 w-4" />
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
                                      ? "success"
                                      : student.avgScore >= 70
                                        ? "default"
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

