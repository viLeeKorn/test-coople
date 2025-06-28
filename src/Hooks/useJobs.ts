import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi, JobsListResponse } from '#Api';

export const queryKeys = {
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    details: () => [...queryKeys.jobs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
  },
} as const;

export const useInfiniteJobsList = (pageSize: number = 30) => {
  return useInfiniteQuery({
    queryKey: queryKeys.jobs.lists(),
    queryFn: ({ pageParam = 0 }) => jobsApi.getJobsList(pageParam, pageSize),
    initialPageParam: 0,
    getNextPageParam: (lastPage: JobsListResponse, allPages) => {
      const totalJobs = lastPage.data.total;
      const currentJobsCount = allPages.reduce(
        (total, page) => total + page.data.items.length, 
        0
      );
      return currentJobsCount < totalJobs ? allPages.length : undefined;
    },
    staleTime: 1000 * 60 * 2, 
    gcTime: 1000 * 60 * 5,
  });
};

export const useJobDetails = (jobId: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId),
    queryFn: () => jobsApi.getJobDetails(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10, 
  });
};

export const usePrefetchJobDetails = () => {
  const queryClient = useQueryClient();
  
  return (jobId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.detail(jobId),
      queryFn: () => jobsApi.getJobDetails(jobId),
      staleTime: 1000 * 60 * 5,
    });
  };
}; 