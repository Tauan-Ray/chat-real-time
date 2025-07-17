"use client"
import { LoginFormSchema } from "../lib/schemas"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, Loader2, LockKeyhole, LogIn, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from '@/components/pt-zod'
import { signIn } from "@/app/auth/actions/auth"
import { redirect } from "next/navigation"


const LoginForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        setIsLoading(true)
        await signIn(values)
        setIsLoading(false)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-3">Email</FormLabel>
                                <div className="flex items-center space-x-2 relative">
                                    <Mail className="absolute left-5 text-slate-400" size={16} />
                                    <FormControl className="pl-8">
                                        <Input placeholder="Insira seu email" autoFocus disabled={isLoading} {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="ml-3" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-3">Senha</FormLabel>
                                <div className="flex items-center space-x-2 relative">
                                <LockKeyhole className="absolute left-5 text-slate-400" size={16} />
                                <FormControl className="pl-8">
                                    <Input placeholder="Insira sua senha" type={showPassword ? "text" : "password"} disabled={isLoading} {...field} />
                                </FormControl>
                                <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3">
                                    {showPassword ? <EyeOffIcon size={20} className="text-slate-400" /> : <EyeIcon size={20} className="text-slate-400" />}
                                </div>
                                </div>
                                <FormMessage className="ml-3" />
                            </FormItem>
                        )}
                    />
                <p className="mt-4 ml-3 cursor-pointer text-primary-dark hover:underline hover:text-accent transition-colors duration-200 text-sm md:text-base"
                   onClick={() => redirect('/auth/signup')}
                >
                    Não tem uma conta? Crie uma agora.
                </p>
                </form>
            </Form>
            <Button disabled={isLoading} form="form-login" className="w-full rounded-3xl py-5 mt-7" onClick={form.handleSubmit(onSubmit)}>
                {isLoading ? (
                    <Loader2 size={22} className="animate-spin text-white" />
                ): (
                    <>
                        <LogIn size={20} className="text-white" />
                        <span className="font-medium">Entrar</span>
                    </>
                )}
            </Button>
        </>
    )
}

export default LoginForm