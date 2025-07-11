"use client"
import { RegisterFormSchema } from "@/app/lib/schemas"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, LockKeyhole, Mail, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from '@/components/pt-zod'
import { registerUser } from "../actions/auth"

type RegisterFormProps = {
    authMode: 'login' | 'signup';
    setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
}

const RegisterForm = ({ authMode, setAuthMode }: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
        setIsLoading(true)
        await registerUser(values)
        setIsLoading(false)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-3">Nome de usuário</FormLabel>
                                <div className="flex items-center space-x-2 relative">
                                    <User className="absolute left-5 text-slate-400" size={16} />
                                    <FormControl className="pl-8">
                                        <Input placeholder="Insira seu nome" autoFocus disabled={isLoading} {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="ml-3" />
                            </FormItem>
                        )}
                    />
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-3">Confirmar senha</FormLabel>
                                <div className="flex items-center space-x-2 relative">
                                <LockKeyhole className="absolute left-5 text-slate-400" size={16} />
                                <FormControl className="pl-8">
                                    <Input placeholder="Confirme sua senha" type={showPassword ? "text" : "password"} disabled={isLoading} {...field} />
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
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                >
                    {authMode === 'login'
                        ? 'Não tem uma conta? Crie uma agora.'
                        : 'Já possui uma conta? Faça login.'}
                </p>
                </form>
            </Form>
            <Button disabled={isLoading} form="form-login" className="w-full rounded-3xl py-5 mt-7" onClick={form.handleSubmit(onSubmit)}>
                { isLoading ? <p>Carregando</p> : <p>Registrar</p> }
            </Button>
        </>
    )
}

export default RegisterForm