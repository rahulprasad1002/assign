import React from 'react';
import { fetchPendingRequirements } from '@/api/requirement';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

import { useInView } from 'react-intersection-observer';
import RequirementCard from '@/components/requirement';

export default function AllRequirementPage() {
  const { ref, inView } = useInView(); // Detect if the last element is in view
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['pending-requirements'],
      queryFn: fetchPendingRequirements,
      initialPageParam: 1, // ✅ Required: Initial page number,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined, // If nextPage exists, fetch it
    });

  console.log('da', data);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage(); // Load next page when the last element comes into view
    }
  }, [inView, hasNextPage, fetchNextPage]);

  console.log(data?.pages.length);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Pending Requirements</h2>
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map(
            (item: {
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
            }) => (
              <RequirementCard key={item._id} item={item} />
            )
          )}
        </React.Fragment>
      ))}

      {data && data.pages.flatMap((page) => page.data).length === 0 && (
        <p className="text-base text-center text-muted-foreground pt-8">
          No Pending Tasks
        </p>
      )}

      {/* Loader for infinite scroll */}
      {hasNextPage && (
        <div ref={ref} className="text-center p-4">
          {isFetchingNextPage ? (
            <Loader className="animate-spin size-6" />
          ) : (
            'Scroll down to load more'
          )}
        </div>
      )}
    </div>
  );
}
