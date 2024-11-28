// src/lib/auth-client.ts
import { twoFactorClient } from "better-auth/plugins";
import {
    createAuthClient
} from "better-auth/react";


export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        twoFactorClient()
    ]
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;