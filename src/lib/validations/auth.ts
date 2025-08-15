import { z } from "zod"

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email address or username is required"),
  password: z.string().min(1, "Password is required"),
})

// Helper function to check if input is a valid email
export const isEmail = (input: string): boolean => {
  return z.string().email().safeParse(input).success;
}

export const registerStep1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const registerStep2Schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterStep1Data = z.infer<typeof registerStep1Schema>
export type RegisterStep2Data = z.infer<typeof registerStep2Schema>
export type RegisterFormData = z.infer<typeof registerSchema>
