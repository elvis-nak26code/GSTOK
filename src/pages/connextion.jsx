import { LoginForm } from "@/components/auth/login-form"
export default function Home() {
    return (
        <div className="bg-background flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
         </div>
    );
  }