import { JobsListResponse, JobDetailsResponse } from './types';
import { apiRequest } from './apiClient';

export const jobsApi = {
  getJobsList: async (pageNum: number = 0, pageSize: number = 30): Promise<JobsListResponse> => {
    const endpoint = `/work-assignments/public-jobs/list?pageNum=${pageNum}&pageSize=${pageSize}`;
    return apiRequest<JobsListResponse>(endpoint);
  },

  getJobDetails: async (jobId: string): Promise<JobDetailsResponse> => {
    const endpoint = `/work-assignments/public-jobs/${jobId}`;
    return apiRequest<JobDetailsResponse>(endpoint);
  },
}; 