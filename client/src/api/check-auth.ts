import { axiosInstance } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

export const checkAuthStatus = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data.data;
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['authUser']); // Get auth data globally
};
