import React from 'react'
import { Button } from '../ui/button'
import { User } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useAuthState } from '@/hooks/useAuthState'
import { useRouter } from 'next/navigation'

const AnonymousButton = () => {
    const router = useRouter();
    const {setSuccess, setError, setLoading, resetState } = useAuthState();

    const handleSignInAnonymous = async () => {
        try {
            await authClient.signIn.anonymous({
                fetchOptions: {
                    onSuccess: () => {
                        setSuccess("LoggedIn successfully")
                        router.replace('/')
                    },
                    onError: (ctx) => setError(ctx.error.message),
                    onRequest: () => {
                        resetState()
                        setLoading(true)
                    },
                    onResponse: () => setLoading(true)
                }
            })
    
        } catch(error) {
            console.log(error)
            setError("Something went wrong")
        }
        
    }
  return (
    <Button className='w-28' onClick={handleSignInAnonymous}>
        <User />
        Guest
    </Button>
  )
}

export default AnonymousButton