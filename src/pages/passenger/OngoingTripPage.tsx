import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMyBookings } from '../../hooks/useBookings';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Loader } from '../../components/Loader';
import { ArrowLeft, CheckCircle2, Phone, ShieldAlert } from 'lucide-react';

export const OngoingTripPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const idNum = parseInt(bookingId || '0', 10);
  const { data: bookings = [], isLoading, refetch } = useMyBookings();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Live Trip #${bookingId} | Wenyfour`;
  }, [bookingId]);

  const booking = bookings.find((b) => b.id === idNum);

  if (isLoading) {
    return <Loader fullScreen message="Loading live trip details..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Booking Not Found</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/bookings')}>
          Back to My Bookings
        </Button>
      </div>
    );
  }

  const isStarted = !!booking.trip_started_at;
  const isCompleted = booking.status === 'completed' || !!booking.trip_completed_at;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/bookings')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to bookings
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Trip Progress</h1>
          <p className="text-sm text-slate-500">Booking #{booking.id}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh Status
        </Button>
      </div>

      {/* Progress Timeline */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">Journey Status</span>
          <Badge
            label={booking.status}
            variant={isCompleted ? 'neutral' : isStarted ? 'primary' : 'success'}
          />
        </div>

        <div className="py-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-brand-600 ring-4 ring-brand-100" />
              <div
                className={`w-0.5 h-14 ${
                  isStarted || isCompleted ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-4 w-4 rounded-full ${
                  isStarted || isCompleted
                    ? 'bg-brand-600 ring-4 ring-brand-100'
                    : 'bg-slate-300'
                }`}
              />
              <div
                className={`w-0.5 h-14 ${
                  isCompleted ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-4 w-4 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-600 ring-4 ring-emerald-100'
                    : 'bg-slate-300'
                }`}
              />
            </div>

            <div className="flex-1 space-y-8">
              <div>
                <p className="text-sm font-bold text-slate-900">Driver Confirmed</p>
                <p className="text-xs text-slate-500">
                  {booking.driver_confirmed_at
                    ? new Date(booking.driver_confirmed_at).toLocaleTimeString()
                    : 'Confirmed by driver'}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">Trip In Progress</p>
                <p className="text-xs text-slate-500">
                  {booking.trip_started_at
                    ? `Started at ${new Date(booking.trip_started_at).toLocaleTimeString()}`
                    : 'Awaiting driver departure'}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">Trip Completed</p>
                <p className="text-xs text-slate-500">
                  {booking.trip_completed_at
                    ? `Arrived at ${new Date(booking.trip_completed_at).toLocaleTimeString()}`
                    : 'Pending dropoff arrival'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking Specs */}
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Booking Summary
        </h3>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Travel Date:</span>
          <span className="font-semibold text-slate-900">{booking.travel_date}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Seats Reserved:</span>
          <span className="font-semibold text-slate-900">{booking.seats_booked} seat(s)</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Fare Paid:</span>
          <span className="font-bold text-brand-600">₦{Number(booking.fare).toLocaleString()}</span>
        </div>
      </Card>

      {/* Emergency Alert */}
      <Card className="p-5 border-red-200 bg-red-50/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-red-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-900">Safety Assistance</h4>
            <p className="text-xs text-red-700">Need urgent help during your ride?</p>
          </div>
        </div>
        <a href="tel:112">
          <Button variant="danger" size="sm">
            Call Emergency (112)
          </Button>
        </a>
      </Card>

      {isCompleted && (
        <div className="pt-2">
          <Link to={`/bookings/${booking.id}/rate`}>
            <Button size="lg" className="w-full font-bold">
              Rate Driver & Trip Experience
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
