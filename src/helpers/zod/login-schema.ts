import { z } from "zod";

const LoginSchema = z
  .object({
    emailOrUsername: z
      .string()
      .min(1, { message: "Email or username is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
  })
  .refine(
    (data) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrUsername) || /^[a-zA-Z0-9_.]+$/.test(data.emailOrUsername),
    {
      message: "Provide a valid email or username",
      path: ["emailOrUsername"],
    }
  );

export default LoginSchema