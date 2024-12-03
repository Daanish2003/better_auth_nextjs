"use client"
import React from 'react'
import { Button } from '../ui/button'
import { authClient, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const SignOut = () => {
    const router = useRouter()
    const session = authClient.useSession()

    if(!session.data) {
      return (
        <Button onClick={() => {router.push("/signin")}}>
          Login
        </Button>
      )
    }

  return (
    <Button
    onClick={async() => {await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin")
        }
      }
    })}}
    >Logout</Button>
  )
}

export default SignOut