import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ridesApi } from '../api/rides';
import { RideSearchParams, RideCreateInput } from '../types/rides';

export const useSearchRides = (params: RideSearchParams, enabled = true) => {
  return useQuery({
    queryKey: ['rides', 'search', params],
    queryFn: () => ridesApi.searchRides(params),
    enabled: enabled && !!params.departure_date,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useMyRides = (filters?: {
  pickup_location?: string;
  dropoff_location?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['rides', 'my-rides', filters],
    queryFn: () => ridesApi.getMyRides(filters),
  });
};

export const useRideDetails = (rideId: number) => {
  return useQuery({
    queryKey: ['rides', 'detail', rideId],
    queryFn: () => ridesApi.getRideById(rideId),
    enabled: !!rideId,
  });
};

export const usePublishRide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RideCreateInput) => ridesApi.publishRide(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });
};
