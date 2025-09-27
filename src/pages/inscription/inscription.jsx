import { LoginForm } from "@/components/auth/sign-up-form"
export default function Home() {
    return (
        <div className="bg-background flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full flex justify-center items-center">
              <LoginForm />
            </div>
         </div>
    );
  }