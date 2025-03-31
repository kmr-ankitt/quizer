import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-10">
      <header className="w-[100%] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between p-5 w-full ">
          <div className="font-bold text-2xl">Quizer</div>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Quizer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and take quizzes with our intuitive platform. Perfect for teachers and students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <Card className="backdrop-blur-sm bg-card/50 border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>For Teachers</CardTitle>
              <CardDescription>Create and manage quizzes, track student performance</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Generate custom quizzes with AI assistance ✨</li>
                <li>Create multiple-choice questions effortlessly</li>
                <li>Assign quizzes to your students with ease</li>
                <li>Track and analyze student performance</li>
                </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?role=teacher" className="w-full">
                <Button variant="outline" className="w-full">
                  Login as Teacher
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>For Students</CardTitle>
              <CardDescription>Take quizzes and track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access assigned quizzes from your teachers</li>
                <li>Take quizzes with an intuitive interface</li>
                <li>Get immediate feedback on your answers</li>
                <li>Track your progress and performance over time</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?role=student" className="w-full">
                <Button variant="outline" className="w-full">
                  Login as Student
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">© 2025 QuizMaster. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

