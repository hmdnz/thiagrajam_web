import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings';
import {
  BookingCreateInput,
  BookingDriverConfirmInput,
  BookingDriverRejectInput,
  BookingTripActionInput,
  BookingCancellationInput,
} from '../types/bookings';

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'my-bookings'],
    queryFn: () => bookingsApi.getMyBookings(),
  });
};

export const useDriverBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'driver-bookings'],
    queryFn: () => bookingsApi.getDriverBookings(),
  });
};

export const useDriverPendingBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'driver-pending'],
    queryFn: () => bookingsApi.getDriverPendingBookings(),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BookingCreateInput) => bookingsApi.createBooking(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: number; input?: BookingDriverConfirmInput }) =>
      bookingsApi.confirmBooking(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: number; input: BookingDriverRejectInput }) =>
      bookingsApi.rejectBooking(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useStartTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: number; input?: BookingTripActionInput }) =>
      bookingsApi.startTrip(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCompleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: number; input?: BookingTripActionInput }) =>
      bookingsApi.completeTrip(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBookingAsPassenger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: number; input?: BookingCancellationInput }) =>
      bookingsApi.cancelAsPassenger(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBookingAsDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: number; input?: BookingCancellationInput }) =>
      bookingsApi.cancelAsDriver(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
