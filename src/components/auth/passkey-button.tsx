import { Key } from "lucide-react"
import { Button } from "../ui/button"
import { signIn } from "@/lib/auth-client"
import { useAuthState } from "@/hooks/useAuthState";

export const PasskeyButton = () => {
    const { 
        setSuccess, 
        setError, 
        setLoading, 
        resetState 
    } = useAuthState();
    
    const handlePasskey = async() => {
        try{
            await signIn.passkey({
                
            }, {
                onRequest: () => {
                    resetState()
                    setLoading(true)
                },
                onResponse: () => {
                    setLoading(false)
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                },
                onSuccess: () => {
                    setSuccess("loggedIn Successfully")
                }
            })

        } catch(error) {
            console.log(error)
            setError("Something went wrong")
        }
    }

    return (
        <Button onClick={handlePasskey} className="w-full">
            <Key />
            Sign-in with Passkey
        </Button>
    )
}