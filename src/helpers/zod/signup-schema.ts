import { z } from "zod";

export const PasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(64, { message: "Password must be at most 64 characters long" }),
});

export const SignupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Minimum 2 characters are required" })
      .max(20, { message: "Maximum of 20 characters are allowed" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
  })