import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMyBookings, useCancelBookingAsPassenger } from '../../hooks/useBookings';
import { BookingOut, BookingCancellationOut } from '../../types/bookings';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { Ticket, Calendar, Clock, AlertTriangle } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingOut | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellationResult, setCancellationResult] = useState<BookingCancellationOut | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: bookings = [], isLoading, error, refetch } = useMyBookings();
  const cancelMutation = useCancelBookingAsPassenger();

  useEffect(() => {
    document.title = 'My Bookings | Wenyfour';
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'danger';
      case 'completed':
      default:
        return 'neutral';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'confirmed', 'in_progress'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return ['cancelled', 'rejected', 'failed'].includes(b.status);
    return true;
  });

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setErrorMessage(null);
    try {
      const res = await cancelMutation.mutateAsync({
        bookingId: cancelModalBooking.id,
        input: { reason: cancelReason.trim() || undefined },
      });
      setCancellationResult(res);
      refetch();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-sm text-slate-500">Track and manage your upcoming and completed trips</p>
        </div>
        <Link to="/rides">
          <Button size="sm">Search New Ride</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-all ${
              activeTab === tab
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ErrorBanner message={error ? getErrorMessage(error) : null} onRetry={refetch} />

      {isLoading ? (
        <Loader message="Loading your bookings..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings in this category"
          description="When you reserve seats on a trip, they will appear right here."
          actionTitle="Find Rides"
          onAction={() => (window.location.href = '/rides')}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((item) => (
            <Card key={item.id} className="p-5 hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">Booking #{item.id}</span>
                    <Badge label={item.status} variant={getStatusVariant(item.status)} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Travel Date: {item.travel_date}
                    </span>
                    <span>•</span>
                    <span>{item.seats_booked} seat(s) reserved</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xl font-bold text-brand-600">
                      ₦{Number(item.fare).toLocaleString()}
                    </span>
                    <p className="text-xs text-slate-400">Total Fare</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {['confirmed', 'in_progress'].includes(item.status) && (
                      <Link to={`/bookings/${item.id}/ongoing`}>
                        <Button size="sm" className="font-semibold">
                          Live Trip
                        </Button>
                      </Link>
                    )}

                    {item.status === 'completed' && (
                      <Link to={`/bookings/${item.id}/rate`}>
                        <Button variant="secondary" size="sm">
                          Rate Driver
                        </Button>
                      </Link>
                    )}

                    {['pending', 'confirmed'].includes(item.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCancellationResult(null);
                          setCancelReason('');
                          setCancelModalBooking(item);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      <Modal
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        title={`Cancel Booking #${cancelModalBooking?.id}`}
      >
        {!cancellationResult ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to cancel this booking? Short notice cancellations may incur
              cancellation penalty fees according to terms.
            </p>

            <Input
              label="Reason for Cancellation (Optional)"
              placeholder="e.g. Change of plans"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="md" onClick={() => setCancelModalBooking(null)}>
                Keep Booking
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleCancelBooking}
                loading={cancelMutation.isPending}
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <p className="text-sm font-semibold text-slate-900">{cancellationResult.message}</p>
            <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Original Fare:</span>
                <span>₦{(cancellationResult.original_fare_kobo / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Penalty Deducted:</span>
                <span>₦{(cancellationResult.penalty_kobo / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-200">
                <span>Refund to Passenger:</span>
                <span>₦{(cancellationResult.passenger_refund_kobo / 100).toLocaleString()}</span>
              </div>
            </div>
            <Button size="md" className="w-full" onClick={() => setCancelModalBooking(null)}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
