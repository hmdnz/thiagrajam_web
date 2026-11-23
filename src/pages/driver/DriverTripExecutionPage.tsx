import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBookingDetails, useStartTrip, useCompleteTrip, useCancelBookingAsDriver } from '../../hooks/useBookings';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Loader } from '../../components/Loader';
import { ErrorBanner } from '../../components/ErrorBanner';
import { Modal } from '../../components/Modal';
import { 
  Navigation, CheckCircle2, AlertTriangle, Phone, Mail, 
  MapPin, Clock, Users, ArrowLeft, ShieldAlert 
} from 'lucide-react';

export const DriverTripExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data: booking, isLoading, error } = useBookingDetails(id || '');
  const startTripMutation = useStartTrip();
  const completeTripMutation = useCompleteTrip();
  const cancelMutation = useCancelBookingAsDriver();

  if (isLoading) return <Loader fullScreen message="Loading active trip details..." />;
  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorBanner message="Failed to load trip details or booking was not found." />
        <Link to="/driver/bookings" className="mt-4 inline-flex items-center text-emerald-600 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Bookings
        </Link>
      </div>
    );
  }

  const handleStartTrip = async () => {
    try {
      await startTripMutation.mutateAsync(booking.id);
    } catch {
      // Handled by mutation error state
    }
  };

  const handleCompleteTrip = async () => {
    try {
      await completeTripMutation.mutateAsync(booking.id);
      navigate('/driver/bookings');
    } catch {
      // Handled by mutation error state
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) return;
    try {
      await cancelMutation.mutateAsync({
        bookingId: booking.id,
        data: { reason: cancelReason },
      });
      setCancelModalOpen(false);
      navigate('/driver/bookings');
    } catch {
      // Handled by mutation error state
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/driver/bookings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Bookings
        </Link>
        <Badge status={booking.status} />
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-emerald-100 text-xs font-semibold tracking-wider uppercase">Trip Execution</span>
            <h1 className="text-2xl font-bold mt-1">Live Ride Control</h1>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Navigation className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-emerald-500/40 pt-4">
          <div>
            <p className="text-xs text-emerald-200">Origin</p>
            <p className="font-semibold text-sm">{booking.ride?.origin_city || 'Origin'}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-200">Destination</p>
            <p className="font-semibold text-sm">{booking.ride?.destination_city || 'Destination'}</p>
          </div>
        </div>
      </div>

      {(startTripMutation.error || completeTripMutation.error || cancelMutation.error) && (
        <ErrorBanner 
          message={
            (startTripMutation.error as any)?.response?.data?.detail ||
            (completeTripMutation.error as any)?.response?.data?.detail ||
            (cancelMutation.error as any)?.response?.data?.detail ||
            'Action failed. Please try again.'
          } 
        />
      )}

      {/* Passenger Details */}
      <Card title="Passenger Information">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {booking.user?.full_name || `Passenger #${booking.user_id.slice(0, 6)}`}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-400" />
                {booking.seats_booked} seat(s)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                Booked {new Date(booking.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {booking.user?.phone_number && (
              <a
                href={`tel:${booking.user.phone_number}`}
                className="p-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
                title="Call Passenger"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
            {booking.user?.email && (
              <a
                href={`mailto:${booking.user.email}`}
                className="p-3 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Email Passenger"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {booking.pickup_stop && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-900">Pickup Stop: </span>
              {booking.pickup_stop}
            </div>
          </div>
        )}
      </Card>

      {/* Route & Ride Details */}
      <Card title="Trip Itinerary">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Origin</p>
              <p className="font-medium text-gray-900">{booking.ride?.origin_city}</p>
              <p className="text-sm text-gray-600">{booking.ride?.origin_address}</p>
            </div>
          </div>
          <div className="border-l-2 border-dashed border-gray-300 ml-1.5 pl-5 py-1">
            <p className="text-xs text-gray-400">Direct Route</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-teal-600 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Destination</p>
              <p className="font-medium text-gray-900">{booking.ride?.destination_city}</p>
              <p className="text-sm text-gray-600">{booking.ride?.destination_address}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions based on booking status */}
      <Card title="Trip Actions">
        <div className="space-y-4">
          {booking.status === 'confirmed' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                The passenger has confirmed and paid. Click below once passengers are boarded and you are starting the journey.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={startTripMutation.isPending}
                onClick={handleStartTrip}
              >
                <Navigation className="w-5 h-5 mr-2" /> Start Trip Now
              </Button>
            </div>
          )}

          {booking.status === 'in_progress' && (
            <div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <p className="text-sm">
                  This trip is currently in progress. Once you have arrived safely at the destination, mark it complete to release earnings.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-teal-600 hover:bg-teal-700"
                isLoading={completeTripMutation.isPending}
                onClick={handleCompleteTrip}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" /> Complete Trip & Release Funds
              </Button>
            </div>
          )}

          {['pending', 'confirmed'].includes(booking.status) && (
            <div className="pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="md"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setCancelModalOpen(true)}
              >
                <ShieldAlert className="w-4 h-4 mr-2" /> Cancel Booking as Driver
              </Button>
            </div>
          )}

          {booking.status === 'completed' && (
            <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
              This trip was completed. Funds have been credited to your driver wallet.
            </div>
          )}
        </div>
      </Card>

      {/* Driver Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p>
              Cancelling a confirmed trip impacts your driver reliability score and refunds the passenger.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="e.g. Mechanical issue, road hazard, medical emergency..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              isLoading={cancelMutation.isPending}
              disabled={!cancelReason.trim()}
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
