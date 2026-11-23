import { apiClient } from './client';
import {
  RideCreateInput,
  RideOut,
  RideSearchResult,
  PaginatedResponse,
  RideSearchParams,
} from '../types/rides';

export const ridesApi = {
  // GET /rides/search
  searchRides: async (params: RideSearchParams): Promise<PaginatedResponse<RideSearchResult>> => {
    const response = await apiClient.get<PaginatedResponse<RideSearchResult>>('/rides/search', {
      params,
    });
    return response.data;
  },

  // GET /rides/my-rides
  getMyRides: async (filters?: {
    pickup_location?: string;
    dropoff_location?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<RideOut[]> => {
    const response = await apiClient.get<RideOut[]>('/rides/my-rides', {
      params: filters,
    });
    return response.data;
  },

  // GET /rides/{ride_id}
  getRideById: async (rideId: number): Promise<RideOut> => {
    const response = await apiClient.get<RideOut>(`/rides/${rideId}`);
    return response.data;
  },

  // POST /rides/
  publishRide: async (input: RideCreateInput): Promise<RideOut> => {
    const response = await apiClient.post<RideOut>('/rides/', input);
    return response.data;
  },

  // GET /rides/all
  getAllRides: async (driverId?: string): Promise<RideOut[]> => {
    const response = await apiClient.get<RideOut[]>('/rides/all', {
      params: driverId ? { driver_id: driverId } : undefined,
    });
    return response.data;
  },
};
