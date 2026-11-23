export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'failed';

export type CancellationType = 'passenger_cancellation' | 'driver_cancellation' | 'admin_cancellation';
export type CancellationRefundStatus = 'none' | 'pending' | 'processed' | 'failed';

export interface BookingCreateInput {
  ride_id: number;
  travel_date: string; // YYYY-MM-DD
  seats_booked: number;
}

export interface BookingOut {
  id: number;
  passenger_id: string;
  ride_id: number;
  car_id?: number | null;
  travel_date: string;
  seats_booked: number;
  fare: number | string;
  status: BookingStatus;
  driver_confirmed_at?: string | null;
  trip_started_at?: string | null;
  trip_completed_at?: string | null;
  funds_released_at?: string | null;
  created_at: string;
}

export interface DriverPassengerBookingOut {
  booking_id: number;
  passenger_id: string;
  passenger_name?: string | null;
  passenger_email?: string | null;
  passenger_phone?: string | null;
  ride_id: number;
  travel_date: string;
  pickup_time: string;
  pickup_location: string;
  dropoff_location: string;
  seats_booked: number;
  fare: number | string;
  status: BookingStatus;
  created_at: string;
  driver_confirmed_at?: string | null;
}

export interface BookingDriverConfirmInput {
  note?: string;
}

export interface BookingDriverRejectInput {
  reason: string;
}

export interface BookingTripActionInput {
  note?: string;
}

export interface BookingCancellationInput {
  reason?: string;
}

export interface BookingCancellationOut {
  message: string;
  booking_id: number;
  cancellation_type: CancellationType;
  original_fare_kobo: number;
  penalty_kobo: number;
  passenger_refund_kobo: number;
  passenger_voucher_kobo: number;
  driver_voucher_kobo: number;
  company_share_kobo: number;
  driver_wallet_charge_kobo: number;
  refund_required: boolean;
  refund_requested: boolean;
  refund_status: CancellationRefundStatus;
}
