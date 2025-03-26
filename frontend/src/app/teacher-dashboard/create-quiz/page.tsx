"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Loader2, Plus, Trash2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Switch } from "@radix-ui/react-switch"
import { fetchGeneratedQuestions } from "@/app/_services/fetchGeneratedQuestions"

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  numberOfQuestions: z.coerce.number().min(1).max(20),
  timeLimit: z.coerce.number().min(5).max(120),
  isPublished: z.boolean().default(false),
})

type Question = {
  id: number
  text: string
  options: { id: string; text: string }[]
  correctAnswer: string
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      difficulty: "medium",
      numberOfQuestions: 5,
      timeLimit: 30,
      isPublished: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (questions.length === 0) {
      return
    }

    // In a real app, you would save the quiz to your database here
    console.log("Quiz data:", { ...values, questions })

    router.push("/teacher-dashboard")
  }

  const handleGenerateQuestions = async () => {
    const values = form.getValues()

    if (!values.subject || !values.difficulty) {
      return
    }

    setIsGenerating(true)

    try {
      const generatedQuestions = await fetchGeneratedQuestions({
        subject: values.subject,
        difficulty: values.difficulty,
        numberOfQuestions: values.numberOfQuestions,
      })

      setQuestions(generatedQuestions)

    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 px-5">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/teacher-dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="font-bold text-xl">Create Quiz</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="backdrop-blur-sm bg-card/50 border shadow-md">
                  <CardHeader>
                    <CardTitle>Quiz Details</CardTitle>
                    <CardDescription>Enter the basic information about your quiz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quiz Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Data Structures" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="data_structures">Data Structures</SelectItem>
                                <SelectItem value="operating_systems">Operating Systems</SelectItem>
                                <SelectItem value="computer_networks">Computer Networks</SelectItem>
                                <SelectItem value="database_management">Database Management</SelectItem>
                                <SelectItem value="artificial_intelligence">Artificial Intelligence</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a brief description of the quiz"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numberOfQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} max={20} {...field} />
                            </FormControl>
                            <FormDescription>Maximum 20 questions</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timeLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Limit (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" min={5} max={120} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Publish Quiz</FormLabel>
                            <FormDescription>Make this quiz available to students immediately</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quiz Questions</h2>
                    <p className="text-muted-foreground">Add questions to your quiz or generate them with AI</p>
                  </div>
                  <Button type="button" onClick={handleGenerateQuestions} disabled={isGenerating} className="gap-2">
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>

                <div className="space-y-4">
                  {questions.length > 0 ? (
                    questions.map((question, index) => (
                      <Card key={question.id} className="backdrop-blur-sm bg-card/50 border shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="font-medium">{question.text}</div>
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <div
                                key={option.id}
                                className={`flex items-center rounded-lg border p-3 ${option.id === question.correctAnswer ? "bg-primary/10 border-primary" : ""
                                  }`}
                              >
                                <div className="flex flex-1 items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-sm font-medium">
                                    {option.id.toUpperCase()}
                                  </div>
                                  <span>{option.text}</span>
                                </div>
                                {option.id === question.correctAnswer && (
                                  <div className="text-xs font-medium text-primary">Correct Answer</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="backdrop-blur-sm bg-card/50 border shadow-md border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="rounded-full bg-primary/10 p-3 mb-4">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No questions added yet</h3>
                        <p className="text-muted-foreground max-w-md mb-4">
                          Generate questions automatically with AI or add them manually
                        </p>
                        <Button
                          type="button"
                          onClick={handleGenerateQuestions}
                          disabled={isGenerating}
                          className="gap-2"
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          {isGenerating ? "Generating..." : "Generate with AI"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Separator />

                <div className="flex justify-end gap-4">
                  <Link href="/teacher-dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit">Create Quiz</Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </main>
    </div>
  )
}