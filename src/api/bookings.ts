import { apiClient } from './client';
import {
  BookingCreateInput,
  BookingOut,
  DriverPassengerBookingOut,
  BookingDriverConfirmInput,
  BookingDriverRejectInput,
  BookingTripActionInput,
  BookingCancellationInput,
  BookingCancellationOut,
} from '../types/bookings';

export const bookingsApi = {
  // POST /bookings/
  createBooking: async (input: BookingCreateInput): Promise<BookingOut> => {
    const response = await apiClient.post<BookingOut>('/bookings/', input);
    return response.data;
  },

  // GET /bookings/my-bookings
  getMyBookings: async (): Promise<BookingOut[]> => {
    const response = await apiClient.get<BookingOut[]>('/bookings/my-bookings');
    return response.data;
  },

  // GET /bookings/driver/bookings
  getDriverBookings: async (): Promise<DriverPassengerBookingOut[]> => {
    const response = await apiClient.get<DriverPassengerBookingOut[]>('/bookings/driver/bookings');
    return response.data;
  },

  // GET /bookings/driver/pending
  getDriverPendingBookings: async (): Promise<DriverPassengerBookingOut[]> => {
    const response = await apiClient.get<DriverPassengerBookingOut[]>('/bookings/driver/pending');
    return response.data;
  },

  // POST /bookings/{booking_id}/confirm
  confirmBooking: async (bookingId: number, input?: BookingDriverConfirmInput): Promise<BookingOut> => {
    const response = await apiClient.post<BookingOut>(`/bookings/${bookingId}/confirm`, input || {});
    return response.data;
  },

  // POST /bookings/{booking_id}/reject
  rejectBooking: async (bookingId: number, input: BookingDriverRejectInput): Promise<BookingOut> => {
    const response = await apiClient.post<BookingOut>(`/bookings/${bookingId}/reject`, input);
    return response.data;
  },

  // POST /bookings/{booking_id}/start-trip
  startTrip: async (bookingId: number, input?: BookingTripActionInput): Promise<BookingOut> => {
    const response = await apiClient.post<BookingOut>(`/bookings/${bookingId}/start-trip`, input || {});
    return response.data;
  },

  // POST /bookings/{booking_id}/complete-trip
  completeTrip: async (bookingId: number, input?: BookingTripActionInput): Promise<BookingOut> => {
    const response = await apiClient.post<BookingOut>(`/bookings/${bookingId}/complete-trip`, input || {});
    return response.data;
  },

  // POST /bookings/{booking_id}/cancel/passenger
  cancelAsPassenger: async (
    bookingId: number,
    input?: BookingCancellationInput
  ): Promise<BookingCancellationOut> => {
    const response = await apiClient.post<BookingCancellationOut>(
      `/bookings/${bookingId}/cancel/passenger`,
      input || {}
    );
    return response.data;
  },

  // POST /bookings/{booking_id}/cancel/driver
  cancelAsDriver: async (
    bookingId: number,
    input?: BookingCancellationInput
  ): Promise<BookingCancellationOut> => {
    const response = await apiClient.post<BookingCancellationOut>(
      `/bookings/${bookingId}/cancel/driver`,
      input || {}
    );
    return response.data;
  },
};
