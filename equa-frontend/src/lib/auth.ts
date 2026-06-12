import api from './api';
import { ApiResponse, AuthData, LoginFormValues, RegisterFormValues } from '@/types';
import { AxiosError } from 'axios';

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.errors?.length) {
      return data.errors.map((e) => e.message).join('. ');
    }
    if (data?.message) return data.message;
    if (error.message === 'Network Error') return 'Cannot reach the server. Check your connection.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export async function registerApi(values: Omit<RegisterFormValues, 'confirmPassword'>): Promise<AuthData> {
  try {
    const res = await api.post<ApiResponse<AuthData>>('/auth/register', values);
    return res.data.data!;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function loginApi(values: LoginFormValues): Promise<AuthData> {
  try {
    const res = await api.post<ApiResponse<AuthData>>('/auth/login', values);
    return res.data.data!;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function getMeApi() {
  try {
    const res = await api.get<ApiResponse<AuthData['user']>>('/auth/me');
    return res.data.data!;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}
