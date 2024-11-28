import { z } from "zod";

export const twoFactorSchema = z.object({
    code: z
     .string({message: "Code is required"})
     .min(6, {message: "It requires minimum 6 characters"})
     .max(6, {message: "Code should not exceed 6 characters"})
     .regex(/^\d{6}$/, { message: "Code must be exactly 6 numeric digits" })
})