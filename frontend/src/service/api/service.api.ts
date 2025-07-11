import axios from 'axios';
import { cookies } from "next/headers";
import { USER_TOKEN } from '@/lib';
import { updateSession } from '@/app/lib/session';

const service_api = axios.create({
  baseURL: `http://localhost:3000`,
  timeout: 10000,
});

service_api.interceptors.request.use(async (config) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(USER_TOKEN)?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


service_api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshResult = await updateSession()

      if (!refreshResult) {
        return Promise.reject(error)
      }

      const cookieStore = await cookies()
      const newToken = cookieStore.get(USER_TOKEN)?.value

      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      }

      return service_api(originalRequest)
    }

    return Promise.reject(error)
  }
)

export { service_api };