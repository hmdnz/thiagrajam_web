import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useDriverBookings,
  useDriverPendingBookings,
  useConfirmBooking,
  useRejectBooking,
} from '../../hooks/useBookings';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { Calendar, User, Phone, Check, X } from 'lucide-react';

export const DriverBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'all'>('pending');
  const [rejectBookingId, setRejectBookingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: allBookings = [], isLoading: loadingAll, refetch: refetchAll } = useDriverBookings();
  const { data: pendingBookings = [], isLoading: loadingPending, refetch: refetchPending } =
    useDriverPendingBookings();

  const confirmMutation = useConfirmBooking();
  const rejectMutation = useRejectBooking();

  useEffect(() => {
    document.title = 'Passenger Bookings | Wenyfour';
  }, []);

  const handleRefresh = () => {
    refetchAll();
    refetchPending();
  };

  const handleConfirm = async (bookingId: number) => {
    setErrorMessage(null);
    try {
      await confirmMutation.mutateAsync({ bookingId });
      handleRefresh();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectBookingId) return;
    if (!rejectReason.trim()) {
      setErrorMessage('Please provide a reason for rejecting.');
      return;
    }

    setErrorMessage(null);
    try {
      await rejectMutation.mutateAsync({
        bookingId: rejectBookingId,
        input: { reason: rejectReason.trim() },
      });
      setRejectBookingId(null);
      setRejectReason('');
      handleRefresh();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const displayedList =
    activeTab === 'pending'
      ? pendingBookings
      : activeTab === 'confirmed'
      ? allBookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress')
      : allBookings;

  const isLoading = loadingAll || loadingPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Passenger Booking Requests</h1>
        <p className="text-sm text-slate-500">Confirm seats or manage passenger trip actions</p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pending ({pendingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'confirmed'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Requests ({allBookings.length})
        </button>
      </div>

      {isLoading ? (
        <Loader message="Loading requests..." />
      ) : displayedList.length === 0 ? (
        <EmptyState
          title="No Bookings in this tab"
          description="When passengers book seats on your published rides, they will appear here."
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map((item) => (
            <Card key={item.booking_id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.passenger_name || 'Passenger'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {item.passenger_phone || item.passenger_email || 'Contact pending'}
                    </p>
                  </div>
                </div>
                <Badge
                  label={item.status}
                  variant={
                    item.status === 'confirmed'
                      ? 'success'
                      : item.status === 'pending'
                      ? 'warning'
                      : 'neutral'
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Pickup:</span> {item.pickup_location}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Dropoff:</span> {item.dropoff_location}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Date:</span> {item.travel_date} at{' '}
                  {item.pickup_time ? item.pickup_time.slice(0, 5) : '08:00'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Seats Booked:</span>{' '}
                  {item.seats_booked} seat(s)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400">Fare Earned: </span>
                  <span className="text-lg font-bold text-brand-600">
                    ₦{Number(item.fare).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleConfirm(item.booking_id)}
                        loading={confirmMutation.isPending}
                        className="font-semibold"
                      >
                        <Check className="mr-1 h-3.5 w-3.5" /> Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRejectBookingId(item.booking_id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Reject
                      </Button>
                    </>
                  )}

                  {item.status === 'confirmed' && (
                    <Link to={`/driver/bookings/${item.booking_id}/execute`}>
                      <Button size="sm" className="font-bold">
                        Start / Execute Trip
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectBookingId}
        onClose={() => setRejectBookingId(null)}
        title="Reject Booking Request"
      >
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-sm text-slate-600">
            Please provide a brief reason for declining this passenger’s reservation.
          </p>

          <Input
            label="Reason for rejection"
            placeholder="e.g. Vehicle fully occupied or schedule change"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setRejectBookingId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              type="submit"
              loading={rejectMutation.isPending}
            >
              Reject Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
