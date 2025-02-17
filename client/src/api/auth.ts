import { axiosInstance } from '@/lib/utils';

interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

export const signUpUser = async (data: AuthCredentials) => {
  const response = await axiosInstance.post('/auth/sign-up', data);
  return response.data.data;
};

export const signInUser = async (data: Omit<AuthCredentials, 'name'>) => {
  const response = await axiosInstance.post('/auth/sign-in', data);
  return response.data.data;
};

export const signOutUser = async () => {
  const response = await axiosInstance.post('/auth/sign-out');
  return response.data;
};
