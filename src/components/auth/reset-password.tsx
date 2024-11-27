"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import CardWrapper from '../card-wrapper'
import FormError from '../form-error'
import { FormSuccess } from '../form-success'
import { ResetPasswordSchema } from '@/helpers/zod/reset-password-schema'
import { authClient } from '@/lib/auth-client'
import { useAuthState } from '@/hooks/useAuthState'


const ResetPassword= () => {
    const router = useRouter()
    const {error, success, loading, setError, setLoading, setSuccess, resetState} = useAuthState()

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
        try {
            await authClient.resetPassword({
                newPassword: values.password,
             }, {
                 onResponse: () => {
                    setLoading(false)
                 },
                 onRequest: () => {
                     resetState()
                     setLoading(true)
                 },
                 onSuccess: () => {
                     setSuccess("New password has been created")
                     router.replace('/signin')
                 },
                 onError: (ctx) => {
                     setError(ctx.error.message);
                 },
             });
        } catch (error) {
            console.log(error)
            setError("Something went wrong")
        }

    }


    return (
        <CardWrapper
            cardTitle='Reset Password'
            cardDescription='create a new password'
            cardFooterLink='/login'
            cardFooterDescription='Remember your password?'
            cardFooterLinkTitle='Login'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        placeholder='************'
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder='*************'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={loading}>Submit</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default ResetPassword