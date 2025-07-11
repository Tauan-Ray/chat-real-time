import axios from 'axios';
import { cookies } from "next/headers";
import { USER_TOKEN } from '@/lib';

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

export { service_api };