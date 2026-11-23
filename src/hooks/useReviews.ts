import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews';
import { ReviewCreateInput } from '../types/reviews';

export const useUserRating = (userId: string) => {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => reviewsApi.getUserRating(userId),
    enabled: !!userId,
  });
};

export const useBookingReviews = (bookingId: number) => {
  return useQuery({
    queryKey: ['reviews', 'booking', bookingId],
    queryFn: () => reviewsApi.getBookingReviews(bookingId),
    enabled: !!bookingId,
  });
};

export const useMyRatingSummary = () => {
  return useQuery({
    queryKey: ['reviews', 'me'],
    queryFn: () => reviewsApi.getMyRatingSummary(),
  });
};

export const useReviewsGiven = () => {
  return useQuery({
    queryKey: ['reviews', 'given'],
    queryFn: () => reviewsApi.getReviewsGiven(),
  });
};

export const useReviewsReceived = () => {
  return useQuery({
    queryKey: ['reviews', 'received'],
    queryFn: () => reviewsApi.getReviewsReceived(),
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewCreateInput) => reviewsApi.submitReview(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
