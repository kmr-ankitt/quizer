"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { registerUser } from "../_services/fetchDb"



const formSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    userType: z.enum(["student", "teacher"], { required_error: "Please select a user type" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"student" | "teacher">("student")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      userType: "student",
    },
  })

  useEffect(() => {
    const sessionData = localStorage.getItem("session");
    if (sessionData) {
      const session = JSON.parse(sessionData);
      console.log("Session" , session)
      if (session) {
        router.push(`/${session.userType}-dashboard`);
      }
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await registerUser(values.username, values.password, values.userType)
      console.log(values.userType)
      if (response) {
        // Store session data in localStorage or cookies
        localStorage.setItem("session", JSON.stringify({ username: values.username, userType: values.userType }))

        // Redirect to the appropriate dashboard
        router.push(`/${values.userType}-dashboard`)
      } else {
        console.error("Registration failed:", response)
      }
    } catch (error) {
      console.error("An error occurred during registration:", error)
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between p-5 w-full">
          <Link href="/" className="font-bold text-xl">
            Quizer
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-card/50 border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Register for Quizer</CardTitle>
              <CardDescription className="text-center">Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={userType}
                onValueChange={(value) => {
                  form.setValue("userType", value as "student" | "teacher");
                  setUserType(value as "student" | "teacher");
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>
                <TabsContent value={userType}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Type</FormLabel>
                            <FormControl>
                              <Input value={field.value} readOnly onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
