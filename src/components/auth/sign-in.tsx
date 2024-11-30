"use client";

import React, { useEffect, useState } from "react";
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
import { useAuthState } from "@/hooks/useAuthState";
import { signIn } from "@/lib/auth-client";

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

// Import the schemas (adjusted to match likely export)
import SignInSchema from "@/helpers/zod/login-schema";
import { Mail, Mailbox } from "lucide-react";
import { requestOTP } from "@/helpers/auth/request-otp";
import { oneTapCall } from "./one-tap";

const SignIn = () => {
    const [signInMethod, setSignInMethod] = useState<'traditional' | 'magicLink'>('traditional');
    const router = useRouter();
    const { 
        error, 
        success, 
        loading, 
        setSuccess, 
        setError, 
        setLoading, 
        resetState 
    } = useAuthState();

    useEffect(() => {
        oneTapCall()
    },[])

    // Infer schemas from the union
    const TraditionalSignInSchema = SignInSchema.options[0];
    const MagicLinkSignInSchema = SignInSchema.options[1];

    // Dynamically select schema based on sign-in method
    const currentSchema = signInMethod === 'traditional' 
        ? TraditionalSignInSchema 
        : MagicLinkSignInSchema;

    const form = useForm<z.infer<typeof currentSchema>>({
        resolver: zodResolver(currentSchema),
        defaultValues: {
            emailOrUsername: "",
            ...(signInMethod === 'traditional' ? { password: "" } : {}),
        },
    });

    const onSubmit = async (values: z.infer<typeof currentSchema>) => {
        resetState();
        setLoading(true);

        try {
            if (signInMethod === 'magicLink') {
                // Magic Link sign-in
                await signIn.magicLink(
                    { email: values.emailOrUsername },
                    {
                        onRequest: () => setLoading(true),
                        onResponse: () => setLoading(false),
                        onSuccess: () => {
                            setSuccess("A magic link has been sent to your email.");
                        },
                        onError: (ctx) => {
                            setError(ctx.error.message || "Failed to send magic link.");
                        },
                    }
                );
            } else {
                // Traditional sign-in
                const signInValues = values as z.infer<typeof TraditionalSignInSchema>;
                
                // Determine if input is email or username
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInValues.emailOrUsername);
                
                if (isEmail) {
                    await signIn.email(
                        { 
                            email: signInValues.emailOrUsername, 
                            password: signInValues.password 
                        },
                        {
                            onRequest: () => setLoading(true),
                            onResponse: () => setLoading(false),
                            onSuccess: async(ctx) => {
                                if(ctx.data.twoFactorRedirect) {
                                    const response = await requestOTP()
                                    if(response?.data) {
                                        setSuccess("OTP has been sent to your email")
                                        router.push("/two-factor")
                                    } else if (response?.error) {
                                        setError(response.error.message)
                                    }
                                } else {
                                    setSuccess("Logged in successfully.");
                                    router.replace("/");
                                }
                            },
                            onError: (ctx) => {
                                setError(
                                    ctx.error.message || "Email login failed. Please try again."
                                );
                            },
                        }
                    );
                } else {
                    await signIn.username(
                        { 
                            username: signInValues.emailOrUsername, 
                            password: signInValues.password 
                        },
                        {
                            onRequest: () => setLoading(true),
                            onResponse: () => setLoading(false),
                            onSuccess: async(ctx) => {
                                if(ctx.data.twoFactorRedirect) {
                                    const response = await requestOTP()
                                    if(response?.data) {
                                        setSuccess("OTP has been sent to your email")
                                        router.push("/two-factor")
                                    } else if (response?.error) {
                                        setError(response.error.message)
                                    }
                                } else {
                                    setSuccess("Logged in successfully.");
                                    router.replace("/");
                                }
                            },
                            onError: (ctx) => {
                                setError(
                                    ctx.error.message || "Username login failed. Please try again."
                                );
                            },
                        }
                    );
                }
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
            cardDescription="Enter your details below to login to your account"
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
                                <FormLabel>
                                    {signInMethod === 'magicLink' ? 'Email' : 'Email or Username'}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="text"
                                        placeholder={
                                            signInMethod === 'magicLink'
                                                ? "Enter your email"
                                                : "Enter email or username"
                                        }
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field (only for traditional sign-in) */}
                    {signInMethod === 'traditional' && (
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
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs underline ml-60"
                                    >
                                        Forgot Password?
                                    </Link>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Error & Success Messages */}
                    <FormError message={error} />
                    <FormSuccess message={success} />

                    {/* Submit Button */}
                    <Button disabled={loading} type="submit" className="w-full">
                        {signInMethod === 'magicLink' ? "Send Magic Link" : "Login"}
                    </Button>

                    {/* Social Buttons */}
                    <div className="flex justify-between mt-4">
                        <SocialButton provider="google" icon={<FcGoogle />} label="" />
                        <SocialButton provider="github" icon={<FaGithub />} label="" />
                        <Button
                            type="button"
                            className="w-20"
                            onClick={() => setSignInMethod(
                                signInMethod === 'traditional' ? 'magicLink' : 'traditional'
                            )}
                        >
                            {signInMethod === 'traditional'
                                ? (
                                    <Mailbox />
                                )
                                : (
                                   <Mail />
                                )}
                        </Button>
                        <AnonymousButton />
                    </div>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default SignIn;