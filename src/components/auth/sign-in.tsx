"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CardWrapper from "../card-wrapper";
import FormError from "../form-error";
import { FormSuccess } from "../form-success";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import SocialButton from "./social-button";
import LoginSchema from "@/helpers/zod/login-schema";
import { useAuthState } from "@/hooks/useAuthState";
import { signIn } from "@/lib/auth-client";
import { requestOTP } from "@/helpers/auth/request-otp";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AnonymousButton from "./anonymos-button";

const SignIn = () => {
    const router = useRouter();
    const { error, success, loading, setSuccess, setError, setLoading, resetState } = useAuthState();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            emailOrUsername: "",
            password: ""
        },
    });

    // Check if the value is an email
    const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        const { emailOrUsername, password } = values;

        // Determine if the input is an email or username
        const isEmailInput = isEmail(emailOrUsername);

        try {
            resetState();
            setLoading(true);

            if (isEmailInput) {
                await signIn.email(
                    { email: emailOrUsername, password },
                    {
                        onRequest: () => setLoading(true),
                        onResponse: () => setLoading(false),
                        onSuccess: async (ctx) => {
                            if (ctx.data.twoFactorRedirect) {
                                const res = await requestOTP();
                                if (res?.data) {
                                    setSuccess("OTP has been sent to your email");
                                    router.push("two-factor");
                                } else if (res?.error) {
                                    setError(res.error.message);
                                }
                            } else {
                                setSuccess("Logged in successfully");
                                router.replace("/");
                            }
                        },
                        onError: (ctx) => {
                            const errorMessage =
                                ctx.error.status === 403
                                    ? "Please verify your email address"
                                    : ctx.error.message;
                            setError(errorMessage);
                        },
                    }
                );
            } else {
                await signIn.username(
                    { username: emailOrUsername, password },
                    {
                        onRequest: () => setLoading(true),
                        onResponse: () => setLoading(false),
                        onSuccess: async (ctx) => {
                            if (ctx.data.twoFactorRedirect) {
                                const res = await requestOTP();
                                if (res?.data) {
                                    setSuccess("OTP has been sent to your email");
                                    router.push("two-factor");
                                } else if (res?.error) {
                                    setError(res.error.message);
                                }
                            } else {
                                setSuccess("Logged in successfully");
                                router.replace("/");
                            }
                        },
                        onError: (ctx) => {
                            const errorMessage =
                                ctx.error.status === 403
                                    ? "Please verify your email address"
                                    : ctx.error.message;
                            setError(errorMessage);
                        },
                    }
                );
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardWrapper
            cardTitle="Sign In"
            cardDescription="Enter your email or username below to login to your account"
            cardFooterDescription="Don't have an account?"
            cardFooterLink="/signup"
            cardFooterLinkTitle="Sign up"
        >
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Email or Username Field */}
                    <FormField
                        control={form.control}
                        name="emailOrUsername"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Username</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="text"
                                        placeholder="Enter email or username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                <Link href="/forgot-password" className="text-xs underline ml-60">
                                    Forgot Password?
                                </Link>
                            </FormItem>
                        )}
                    />

                    {/* Error & Success Messages */}
                    <FormError message={error} />
                    <FormSuccess message={success} />

                    {/* Submit Button */}
                    <Button disabled={loading} type="submit" className="w-full">
                        Login
                    </Button>

                    {/* Social Buttons */}
                    <div className="flex justify-between">
                        <SocialButton provider="google" icon={<FcGoogle />} label="Google" />
                        <SocialButton provider="github" icon={<FaGithub />} label="GitHub" />
                        <AnonymousButton />
                    </div>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default SignIn;
