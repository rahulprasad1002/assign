import { axiosInstance } from '@/lib/utils';

export const fetchAllUsers = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/users/all?page=${pageParam}&limit=10`
  );
  return response.data;
};

export const updateUserRole = async ({
  id,
  role,
}: {
  id: string;
  role: string;
}) => {
  const response = await axiosInstance.patch(`/users/update-role/${id}`, {
    role,
  });
  return response.data;
};
