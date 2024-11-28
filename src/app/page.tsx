import Settings from "@/components/auth/settings";
import SignOut from "@/components/auth/sign-out";


export default function Home() {
  return (
    <nav className="flex items-center h-16 border-b px-12 justify-between">
       <span className="font-bold text-xl">Auth</span>
       <div className="flex gap-x-2">
       <SignOut />
       <Settings />
       </div>
    </nav>
    
  );
}
