import { z } from "zod"

export const LoginFormSchema = z.object({
  email: z.email("Formato de email inválido")
  .min(1, "O email é obrigatório").max(20, ''),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
})


export const RegisterFormSchema = z.object({
  name: z.string().min(1, "Nome de usuário obrigatório"),
  email: z.email("Formato de email inválido")
  .min(1, "O email é obrigatório"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})
