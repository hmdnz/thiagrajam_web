import { apiClient } from './client';
import {
  ReviewCreateInput,
  ReviewOut,
  RatingSummaryOut,
  BookingReviewsOut,
} from '../types/reviews';

export const reviewsApi = {
  // POST /reviews/
  submitReview: async (input: ReviewCreateInput): Promise<ReviewOut> => {
    const response = await apiClient.post<ReviewOut>('/reviews/', input);
    return response.data;
  },

  // GET /reviews/user/{user_id}
  getUserRating: async (userId: string): Promise<RatingSummaryOut> => {
    const response = await apiClient.get<RatingSummaryOut>(`/reviews/user/${userId}`);
    return response.data;
  },

  // GET /reviews/booking/{booking_id}
  getBookingReviews: async (bookingId: number): Promise<BookingReviewsOut> => {
    const response = await apiClient.get<BookingReviewsOut>(`/reviews/booking/${bookingId}`);
    return response.data;
  },

  // GET /reviews/me
  getMyRatingSummary: async (): Promise<RatingSummaryOut> => {
    const response = await apiClient.get<RatingSummaryOut>('/reviews/me');
    return response.data;
  },

  // GET /reviews/given
  getReviewsGiven: async (): Promise<ReviewOut[]> => {
    const response = await apiClient.get<ReviewOut[]>('/reviews/given');
    return response.data;
  },

  // GET /reviews/received
  getReviewsReceived: async (): Promise<ReviewOut[]> => {
    const response = await apiClient.get<ReviewOut[]>('/reviews/received');
    return response.data;
  },
};
