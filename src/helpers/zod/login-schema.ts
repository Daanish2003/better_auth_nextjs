import { z } from "zod";

// Schema for traditional sign-in (email/username + password)
const TraditionalSignInSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Email or Username is required")
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length >= 3,
      {
        message: "Must be a valid email or username",
      }
    ),
  password: z.string().nonempty("Password is required"),
});

// Schema for magic link sign-in (email only)
const MagicLinkSignInSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email"),
});

// Combined schema for dynamic sign-in
const SignInSchema = z.union([TraditionalSignInSchema, MagicLinkSignInSchema]);

export default SignInSchema;
