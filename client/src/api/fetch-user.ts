import { axiosInstance } from '@/lib/utils';

export const fetchUser = async () => {
  const response = await axiosInstance.get('/api/auth/me'); // Backend will check cookie automatically
  return response.data; // Expected { id, name, email }
};
