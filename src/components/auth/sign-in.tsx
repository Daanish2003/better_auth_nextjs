// components/auth/sign-in.tsx
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

const SignIn = () => {
    const router = useRouter();
    const { error, success, loading, setSuccess, setError, setLoading, resetState } =
        useAuthState();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        try {
            resetState();
            setLoading(true);

            await signIn.email(
                { email: values.email, password: values.password },
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
            cardDescription="Enter your email below to login to your account"
            cardFooterDescription="Don't have an account?"
            cardFooterLink="/signup"
            cardFooterLinkTitle="Sign up"
        >
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="email"
                                        placeholder="example@gmail.com"
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
                    <div className="flex gap-x-2">
                        <SocialButton provider="google" icon={<FcGoogle />} label="Sign in with Google" />
                        <SocialButton provider="github" icon={<FaGithub />} label="Sign in with GitHub" />
                    </div>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default SignIn;


