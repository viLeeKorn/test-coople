import { Job } from '#Utils/favorites';

export interface JobsListResponse {
  status: number;
  data: {
    items: Job[];
    total: number;
  };
}

export interface JobDetailsResponse {
  status: number;
  data: Job;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
} 