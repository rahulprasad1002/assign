import React from 'react';
import { updateUserRole } from '@/api/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from './ui/badge';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UserCardProps {
  user: User;
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      }); // Refresh the user list
    },
    onError: (error: any) => {
      console.error(
        'Error updating user role:',
        error.response?.data?.message || error.message
      );
    },
  });
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const mutation = useUpdateUserRole();

  const handleRoleChange = (newRole: string) => {
    mutation.mutate({ id: user._id, role: newRole });
  };

  return (
    <div className="border p-4 rounded-md flex flex-col gap-2">
      <h3 className="font-bold flex gap-2">
        <span>{user.name} </span>
        {user.role === 'OWNER' && <Badge className="text-xs">owner</Badge>}
      </h3>
      <p>{user.email}</p>

      {user.role !== 'OWNER' && (
        <Select
          onValueChange={(d) => {
            handleRoleChange(d);
          }}
          defaultValue={user.role}
        >
          <SelectTrigger className="max-w-80">
            <SelectValue
              placeholder="Select a verified App to display"
              className="text-white "
            />
          </SelectTrigger>
          <SelectContent className="max-w-80">
            <SelectItem className=" hover:cursor-pointer" value="USER">
              USER
            </SelectItem>
            <SelectItem className="hover:cursor-pointer" value="ADMIN">
              ADMIN
            </SelectItem>
          </SelectContent>
        </Select>
      )}

      {mutation.isPending && (
        <p className="text-sm text-gray-500">Updating...</p>
      )}
    </div>
  );
};

export default UserCard;
