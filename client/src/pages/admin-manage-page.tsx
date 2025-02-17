import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader } from 'lucide-react';
import UserCard from '@/components/user-card';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAllUsers } from '@/api/user';

export const useUsers = () => {
  return useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};

export default function AllUsersPage() {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold">Roles Manage </h2>

      {data?.pages
        .flatMap((page) => page.data)
        .map((user) => (
          <UserCard key={user._id} user={user} />
        ))}

      {hasNextPage && (
        <div ref={ref} className="text-center p-4">
          {isFetchingNextPage ? (
            <Loader className="animate-spin size-6" />
          ) : (
            'Scroll down to load more'
          )}
        </div>
      )}

      {data && data.pages.flatMap((page) => page.data).length === 0 && (
        <p className="text-center text-base">No Users Found</p>
      )}
    </div>
  );
}
