"use client"
import { useState } from "react";
import LoginForm from "@/app/ui/LoginForm";
import RegisterForm from "./ui/RegisterForm";

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-2xl w-full bg-surface rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">
          { authMode == 'login' ? "Login" : "Cadastro" }
        </h1>
        {authMode == 'login' ?
          <LoginForm authMode={authMode} setAuthMode={setAuthMode} />
          : <RegisterForm authMode={authMode} setAuthMode={setAuthMode} />
        }
      </div>
    </div>
  );
};

export default AuthPage;
