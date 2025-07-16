'use server'

import 'server-only'
import { jwtVerify } from 'jose'
import { service_api } from '@/service/api/service.api';
import { cookies } from 'next/headers'
import { USER_TOKEN, USER_REFRESH_TOKEN, getJwtSecretKey, handleApiError } from '@/lib/index';

type SessionPayload = {
  name?: string;
  email: string;
  password: string;
}

type EncryptProps = {
  access_token: string;
  refresh_token: string;
  status?: number | string;
  message?: string;
}

export type UserProps = {
  id: string;
  name: string;
  email: string;
  createdAt: Date
  updatedat: Date
  message?: string;
  status?: number | string;
}

export async function encrypt(payload: SessionPayload, type: 'login' | 'register'): Promise<EncryptProps> {
  const url = type == 'login' ? '/auth/login' : '/auth/register'
  const body = type == 'login' ?
    {
      email: payload.email,
      password: payload.password
    }
    : {
      name: payload.name,
      email: payload.email,
      password: payload.password
    }
  const response = await service_api.post(url, body)
    .then(({ data, status }) => ({ ...data }))
    .catch(({ response, message }) => {
      console.log(response)

      if (response) return { status: response?.status, message: response?.statusText };
      return { message, status: 500 }
    })

    return response
}

export async function decrypt(session: string | undefined = '') {
  if (session) {
    try {
      const { payload } = await jwtVerify(session, await getJwtSecretKey())

      return payload;
    } catch (error: any) {
      if (error?.code !== 'ERR_JWS_INVALID') {
        console.log('Falha ao verificar sessão', error)
      }
    }
  }
}


export async function createSession(payload: SessionPayload, type: 'login' | 'register') {
  const session = await encrypt(payload, type)

  if (session?.message) return session;

  const cookieStore = await cookies()
  cookieStore.set(USER_TOKEN, session?.access_token, {
    expires: new Date(Date.now() + 1000 * 60 * 15),
    sameSite: 'lax',
    path: '/',
  })

  cookieStore.set(USER_REFRESH_TOKEN, session?.refresh_token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateSession() {
  const session = (await cookies()).get(USER_REFRESH_TOKEN)?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const newAcessToken = await getRefreshToken(session)

  if ('access_token' in newAcessToken) {
    const cookieStore = await cookies()
    cookieStore.set(USER_TOKEN, newAcessToken.access_token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
      sameSite: 'lax',
      path: '/',
    })

    return { message: 'New token access created' }
  } else {
    return newAcessToken
  }

}

export async function getRefreshToken(refreshToken: string): Promise<{ access_token: string } | { status: number, message: string }> {
  return await service_api.post('/auth/refresh', {
    refreshToken
  })
    .then(({ data, status }) => ({ ...data }))
    .catch(({ response, message }) => {

      if (response) return { status: response?.status, message: response?.statusText };
      return { message, status: 500 }
    })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(USER_TOKEN)
  cookieStore.delete(USER_REFRESH_TOKEN)
}

export async function getUser(): Promise<UserProps> {
  return await service_api.get('/user')
    .then(({ data }) => {
      const { passwordHash, ...result } = data;
      return result;
    })
    .catch(handleApiError)
}

export async function getUserByEmail(email: string) {
  return await service_api.get(`/user/${email}`)
    .then(({ data }) => {
      const { passwordHash, ...result } = data;
      return result;
    })
    .catch(handleApiError)
}
