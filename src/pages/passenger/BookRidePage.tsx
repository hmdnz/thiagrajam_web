import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useRideDetails } from '../../hooks/useRides';
import { useCreateBooking } from '../../hooks/useBookings';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { ArrowLeft, Plus, Minus, ShieldCheck } from 'lucide-react';

export const BookRidePage: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || '';
  const maxSeatsParam = parseInt(searchParams.get('seats') || '4', 10);

  const idNum = parseInt(rideId || '0', 10);
  const { data: ride, isLoading } = useRideDetails(idNum);
  const { user } = useAuthStore();
  const createBookingMutation = useCreateBooking();
  const navigate = useNavigate();

  const [seats, setSeats] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Confirm Ride Booking | Wenyfour';
  }, []);

  if (isLoading || !ride) {
    return <Loader fullScreen message="Preparing booking..." />;
  }

  const travelDate = dateParam || (ride.occurrences?.[0]?.date as string) || '';
  const pricePerSeat = Number(ride.price_per_seat);
  const totalFare = pricePerSeat * seats;

  const handleConfirm = async () => {
    setErrorMessage(null);
    try {
      const booking = await createBookingMutation.mutateAsync({
        ride_id: ride.id,
        travel_date: travelDate,
        seats_booked: seats,
      });

      navigate(
        `/payment?bookingId=${booking.id}&amount=${Number(booking.fare) || totalFare}&email=${encodeURIComponent(
          user?.email || 'passenger@wenyfour.com'
        )}`
      );
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to trip
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Confirm Seat Reservation</h1>
        <p className="text-sm text-slate-500">Review trip itinerary and select seat count</p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Trip Recap */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Trip Itinerary
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {ride.origin_city} → {ride.destination_city}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pickup: {ride.pickup_location} at {ride.pickup_time.slice(0, 5)}
            </p>
            <p className="text-xs text-slate-500">Dropoff: {ride.dropoff_location}</p>
          </div>
          <div className="p-2.5 bg-brand-50 text-brand-700 font-bold rounded-xl text-xs">
            Date: {travelDate}
          </div>
        </div>
      </Card>

      {/* Seat Picker */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Select Seats
        </h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">Passenger Seats</p>
            <p className="text-xs text-slate-500">Up to {maxSeatsParam} seats available</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSeats((s) => Math.max(1, s - 1))}
              disabled={seats <= 1}
              className="h-9 w-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-xl font-black text-slate-900 w-8 text-center">{seats}</span>
            <button
              type="button"
              onClick={() => setSeats((s) => Math.min(maxSeatsParam, s + 1))}
              disabled={seats >= maxSeatsParam}
              className="h-9 w-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Fare Breakdown */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Fare Summary
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>
              ₦{pricePerSeat.toLocaleString()} × {seats} {seats === 1 ? 'seat' : 'seats'}
            </span>
            <span className="font-semibold text-slate-900">₦{totalFare.toLocaleString()}</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
            <span>Total Payable</span>
            <span className="text-2xl font-black text-brand-600">
              ₦{totalFare.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          size="lg"
          onClick={handleConfirm}
          loading={createBookingMutation.isPending}
          className="font-bold px-8"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};
