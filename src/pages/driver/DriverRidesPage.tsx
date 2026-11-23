import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMyRides } from '../../hooks/useRides';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { Clock, PlusCircle, Car } from 'lucide-react';

export const DriverRidesPage: React.FC = () => {
  const { data: rides = [], isLoading, refetch } = useMyRides();

  useEffect(() => {
    document.title = 'My Published Rides | Wenyfour';
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Published Rides</h1>
          <p className="text-sm text-slate-500">Scheduled offers and trip occurrences</p>
        </div>
        <Link to="/driver/create-ride">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Offer Another Ride
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader message="Loading your published rides..." />
      ) : rides.length === 0 ? (
        <EmptyState
          title="No Published Rides"
          description="You haven’t posted any ride offers yet. Post a ride to start receiving bookings."
          actionTitle="Offer a Ride"
          onAction={() => (window.location.href = '/driver/create-ride')}
        />
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <Card key={ride.id} className="p-5 hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-900">
                      {ride.origin_city} → {ride.destination_city}
                    </span>
                    <Badge
                      label={ride.is_active ? 'Active' : 'Inactive'}
                      variant={ride.is_active ? 'success' : 'neutral'}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-brand-600" />
                    <span>Departs: {ride.pickup_time ? ride.pickup_time.slice(0, 5) : '08:00'}</span>
                    <span>•</span>
                    <span>Meeting: {ride.pickup_location}</span>
                  </div>

                  {ride.car && (
                    <p className="text-xs text-slate-500">
                      Vehicle: {ride.car.make} {ride.car.model} ({ride.car.color})
                    </p>
                  )}

                  {ride.occurrences && ride.occurrences.length > 0 && (
                    <div className="text-xs text-brand-700 font-semibold pt-1">
                      Scheduled: {ride.occurrences.map((o) => o.date).join(', ')}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-brand-600">
                    ₦{Number(ride.price_per_seat).toLocaleString()}
                  </span>
                  <p className="text-xs text-slate-400">per passenger seat</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
