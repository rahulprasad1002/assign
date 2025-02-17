import { axiosInstance } from '@/lib/utils';

export const addRequirement = async (requirementData: {
  title: string;
  carName: string;
  appName: string;
  requirements: string;
}) => {
  const response = await axiosInstance.post(
    '/requirements/new',
    requirementData
  );
  return response.data; // Return the data from the API
};

export const fetchPendingRequirements = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/requirements/pending?page=${pageParam}&limit=10`
  );
  return response.data;
};

export const updateRequirementStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const response = await axiosInstance.patch(`/requirements/update/${id}`, {
    status,
  });
  return response.data;
};
