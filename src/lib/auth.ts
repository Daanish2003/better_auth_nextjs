// auth.ts
import prisma from "@/db";
import { resend } from "@/helpers/email/resend";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, username } from "better-auth/plugins"

export const auth = betterAuth({
  appName: "better_auth_nextjs",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Email Verification",
        html: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/google",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/github",
    },
  },
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({user, otp}) {
          await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: user.email,
            subject: "Two Factor",
            html: `Your OTP is ${otp}`
          })
          
        }
      },
      skipVerificationOnEnable: true
    }),
    username()
  ]
});
