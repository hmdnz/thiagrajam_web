import { CarPhotoOut } from './cars';

export type RecurrenceType = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';

export interface StopoverIn {
  location?: string;
  city_name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  order?: number;
  price_from_origin?: number;
}

export interface StopoverOut {
  id: number;
  ride_id: number;
  order: number;
  price_from_origin: number;
  lat?: number | null;
  lng?: number | null;
  city_name?: string | null;
  location?: string | null;
  address?: string | null;
}

export interface OccurrenceOut {
  id: number;
  date: string;
}

export interface CarSummaryOut {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  is_tinted: boolean;
  has_wifi: boolean;
  has_air_conditioning: boolean;
  has_power_outlets: boolean;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  wheelchair_accessible: boolean;
  photos: CarPhotoOut[];
}

export interface RideBase {
  origin_city: string;
  pickup_location: string;
  pickup_lat?: number | null;
  pickup_lng?: number | null;
  destination_city: string;
  dropoff_location: string;
  dropoff_lat?: number | null;
  dropoff_lng?: number | null;
  pickup_time: string; // HH:MM:SS
  price_per_seat: number;
  max_passengers: number;
  is_recurring?: boolean;
  recurrence_type?: RecurrenceType | null;
  custom_days?: number[] | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface RideCreateInput {
  car_id: number;
  origin_city: string;
  destination_city: string;
  pickup_location: string;
  pickup_lat?: number | null;
  pickup_lng?: number | null;
  dropoff_location: string;
  dropoff_lat?: number | null;
  dropoff_lng?: number | null;
  stopovers?: StopoverIn[];
  dates?: string[];
  start_date?: string;
  pickup_time: string; // e.g., "08:30:00"
  max_passengers: number;
  max_back_seat_passengers?: number | null;
  instant_booking?: boolean;
  price_per_seat: number;
}

export interface RideOut extends RideBase {
  id: number;
  driver_id: string;
  car_id?: number | null;
  is_recurring: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
  stopovers: StopoverOut[];
  occurrences: OccurrenceOut[];
  car?: CarSummaryOut | null;
  driver?: {
    id: string;
    full_name?: string | null;
    photo_url?: string | null;
    phone_number?: string | null;
  };
}

export interface RideSearchResult extends RideOut {
  searched_date: string;
  seats_remaining_for_date: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface RideSearchParams {
  from_location?: string;
  to_location?: string;
  departure_date?: string; // YYYY-MM-DD
  passengers?: number;
  page?: number;
  limit?: number;
}
