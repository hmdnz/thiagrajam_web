import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchRides } from '../../hooks/useRides';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { Search, MapPin, Calendar, Users, Clock, ShieldCheck } from 'lucide-react';

export const SearchRidesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [fromLocation, setFromLocation] = useState(searchParams.get('from') || '');
  const [toLocation, setToLocation] = useState(searchParams.get('to') || '');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || todayStr);
  const [passengers, setPassengers] = useState(searchParams.get('passengers') || '1');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useSearchRides({
    from_location: fromLocation.trim() || undefined,
    to_location: toLocation.trim() || undefined,
    departure_date: departureDate.trim(),
    passengers: parseInt(passengers, 10) || 1,
    page,
    limit: 15,
  });

  useEffect(() => {
    document.title = 'Search Available Rides | Wenyfour';
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({
      from: fromLocation,
      to: toLocation,
      date: departureDate,
      passengers,
    });
    refetch();
  };

  const rides = data?.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Available Rides</h1>
        <p className="text-sm text-slate-500">
          Search verified drivers travelling across Nigerian cities
        </p>
      </div>

      {/* Filter / Search Form */}
      <Card className="p-4 sm:p-6 bg-white border border-slate-200">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <Input
            label="Leaving From"
            placeholder="Origin City or landmark"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
          />

          <Input
            label="Going To"
            placeholder="Destination City or dropoff"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />

          <Input
            label="Date"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />

          <div className="flex gap-2">
            <div className="w-24">
              <Input
                label="Seats"
                type="number"
                min="1"
                max="8"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Button type="submit" size="md" className="w-full font-bold">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <ErrorBanner message={error ? getErrorMessage(error) : null} onRetry={refetch} />

      {/* Search Results */}
      {isLoading ? (
        <Loader message="Searching available rides..." />
      ) : rides.length === 0 ? (
        <EmptyState
          title="No Rides Found"
          description="Try adjusting your pickup/dropoff points or selecting a different travel date."
          actionTitle="Reset Search"
          onAction={() => {
            setFromLocation('');
            setToLocation('');
            setDepartureDate(todayStr);
            refetch();
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-700">
              {data?.total || rides.length} {rides.length === 1 ? 'ride' : 'rides'} found for{' '}
              {departureDate}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rides.map((ride) => (
              <Card
                key={`${ride.id}-${ride.searched_date}`}
                className="p-5 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/rides/${ride.id}?date=${ride.searched_date}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Journey Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-600" />
                      <span className="text-lg font-bold text-slate-900">
                        {ride.pickup_time ? ride.pickup_time.slice(0, 5) : '08:00'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {ride.searched_date}
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-1 border-l-2 border-brand-200 ml-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-600 -ml-[5px]" />
                        <span className="text-sm font-semibold text-slate-900">
                          {ride.origin_city}
                        </span>
                        <span className="text-xs text-slate-500">({ride.pickup_location})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-600 -ml-[5px]" />
                        <span className="text-sm font-semibold text-slate-900">
                          {ride.destination_city}
                        </span>
                        <span className="text-xs text-slate-500">({ride.dropoff_location})</span>
                      </div>
                    </div>

                    {ride.car && (
                      <p className="text-xs text-slate-500 pt-1">
                        Vehicle: {ride.car.make} {ride.car.model} ({ride.car.color})
                      </p>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                    <div>
                      <p className="text-2xl font-black text-brand-600 text-right">
                        ₦{Number(ride.price_per_seat).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400 text-right">per passenger seat</p>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <Badge
                        label={`${ride.seats_remaining_for_date} seats left`}
                        variant={ride.seats_remaining_for_date > 0 ? 'success' : 'danger'}
                      />
                      <Button size="sm" className="font-semibold">
                        View Trip
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-500 font-medium px-2">
                Page {page} of {data.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.total_pages}
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
