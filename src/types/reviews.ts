export type ReviewRole = 'passenger' | 'driver';

export interface ReviewCreateInput {
  booking_id: number;
  rating: number; // 1-5
  comment?: string | null;
  tags?: string[] | null;
}

export interface ReviewerSummary {
  id: string;
  full_name?: string | null;
  photo_url?: string | null;
}

export interface ReviewOut {
  id: number;
  booking_id: number;
  ride_id: number;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  role_type: ReviewRole;
  tags?: string | null;
  comment?: string | null;
  created_at: string;
  reviewer?: ReviewerSummary | null;
}

export interface RatingSummaryOut {
  user_id: string;
  average_rating: number;
  total_reviews: number;
  driver_average_rating?: number | null;
  driver_reviews_count: number;
  passenger_average_rating?: number | null;
  passenger_reviews_count: number;
  rating_breakdown: Record<string, number>;
  recent_reviews: ReviewOut[];
}

export interface BookingReviewsOut {
  booking_id: number;
  driver_review?: ReviewOut | null;
  passenger_review?: ReviewOut | null;
}
