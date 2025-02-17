import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequirementStatus } from '@/api/requirement';

interface Requirement {
  _id: string;
  title: string;
  carName: string;
  appName: string;
  status: string;
  requirements: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface RequirementCardProps {
  item: Requirement;
}

const RequirementCard: React.FC<RequirementCardProps> = ({ item }) => {
  const [check, setCheck] = React.useState<'check' | 'cross' | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateRequirementStatus,
    onSuccess: (data) => {
      console.log('Requirement updated:', data);

      // Refresh pending requirements list after status change
      queryClient.invalidateQueries({
        queryKey: ['pending-requirements'],
      });
      setCheck(null);
    },
    onError: (error: any) => {
      console.error(
        'Error updating requirement status:',
        error.response?.data?.message || error.message
      );
    },
  });

  return (
    <div className="border p-2 md:p-4 rounded-sm">
      <h3 className="text-xl truncate">{item.title}</h3>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <div>Car Name</div>
        <div className="truncate">{item.carName}</div>

        <div>App Name</div>
        <div className="truncate">{item.appName}</div>

        <div>Status</div>
        <div className="truncate">{item.status}</div>

        <div>Requirements</div>
        <div className="text-wrap">{item.requirements}</div>

        {item.user?.name && (
          <>
            <div>Name</div>
            <div className="truncate">{item.user.name}</div>
          </>
        )}

        {item.user?.email && (
          <>
            <div>Email</div>
            <div className="truncate">{item.user.email}</div>
          </>
        )}

        {item.user?.role && (
          <>
            <div>Role</div>
            <div className="truncate">{item.user.role}</div>
          </>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate({ id: item._id, status: 'APPROVED' });
            setCheck('check');
          }}
          variant={'ghost'}
          className="text-green-500 hover:bg-green-500"
        >
          {(check === null || check === 'cross') && <Check />}
          {mutation.isPending && check === 'check' && (
            <Loader className="animate-spin" />
          )}
        </Button>
        <Button
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate({ id: item._id, status: 'DISAPPROVED' });
            setCheck('cross');
          }}
          variant={'ghost'}
          className="text-red-500 hover:bg-red-500"
        >
          {(check === null || check === 'check') && <X />}
          {mutation.isPending && check === 'cross' && (
            <Loader className="animate-spin" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default RequirementCard;
