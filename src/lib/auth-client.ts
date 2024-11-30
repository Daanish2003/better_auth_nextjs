// src/lib/auth-client.ts
import { twoFactorClient } from "better-auth/plugins";
import { anonymousClient, magicLinkClient, oneTapClient, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        twoFactorClient(),
        usernameClient(),
        anonymousClient(),
        magicLinkClient(),
        oneTapClient({
             clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
        })
    ]
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;