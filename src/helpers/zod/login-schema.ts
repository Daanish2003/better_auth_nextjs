import { z } from "zod";

const LoginSchema = z.object({
    email: z
    .string()
    .email({message: "Invalid email"})
    .min(1, {message: "Email is required"}),
    password: z
    .string()
    .min(8, {message: "Password must be at least 8 characters long"})
    .max(20, {message: "Password must be at most 20 characters long"}),
})

export default LoginSchema