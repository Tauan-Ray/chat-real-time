import { z } from '@/components/pt-zod';
import { LoginFormSchema, RegisterFormSchema } from '../lib/schemas'
import { HttpStatusCode } from "axios";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { createSession, deleteSession } from "../lib/session";

export async function signIn(value: z.infer<typeof LoginFormSchema>) {
  const res = await createSession(value, 'login');

  if (!res?.message) {
    return redirect('/')
  } else {
    if (res.status == HttpStatusCode.Unauthorized) {
      toast.warning(res.message, {
        description: "Usuário ou senha incorretos!",
      })
    } else {
      console.log(res);

      toast.error(res.message, {
        description: 'Falha na requisição, serviço indisponível.',
      })
    }
  }
}

export async function registerUser(value: z.infer<typeof RegisterFormSchema>) {
  const { confirmPassword, ...userData } = value
  const res = await createSession(userData, 'register')
  console.log(res)

  if (!res?.message) {
    return redirect('/')
  } else {
    if (res.status === HttpStatusCode.BadRequest) {
      toast.warning(res.message, {
        description: 'Email já registrado no sistema!'
      })
    } else {
      console.log(res)

      toast.error(res.message, {
        description: 'Falha na requisição, serviço indisponível!'
      })
    }
  }
}

export async function logout() {
  deleteSession()
  redirect('/')
}