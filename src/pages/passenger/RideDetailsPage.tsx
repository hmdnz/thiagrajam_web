import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useRideDetails } from '../../hooks/useRides';
import { useUserRating } from '../../hooks/useReviews';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { RatingStars } from '../../components/RatingStars';
import { Loader } from '../../components/Loader';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Car,
  Wifi,
  Wind,
  Zap,
  Cigarette,
  Dog,
  ArrowLeft,
} from 'lucide-react';

export const RideDetailsPage: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const navigate = useNavigate();

  const idNum = parseInt(rideId || '0', 10);
  const { data: ride, isLoading, error, refetch } = useRideDetails(idNum);
  const { data: driverRating } = useUserRating(ride?.driver_id || '');

  useEffect(() => {
    document.title = ride
      ? `${ride.origin_city} to ${ride.destination_city} | Wenyfour`
      : 'Trip Details | Wenyfour';
  }, [ride]);

  if (isLoading) {
    return <Loader fullScreen message="Loading trip details..." />;
  }

  if (error || !ride) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <ErrorBanner message={error ? getErrorMessage(error) : 'Ride not found'} onRetry={refetch} />
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          ← Go Back
        </Button>
      </div>
    );
  }

  const travelDate = dateParam || (ride.occurrences?.[0]?.date as string) || '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to search
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {travelDate}
                </span>
                <h1 className="text-2xl font-black text-slate-900">
                  {ride.origin_city} → {ride.destination_city}
                </h1>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-brand-600">
                  ₦{Number(ride.price_per_seat).toLocaleString()}
                </span>
                <p className="text-xs text-slate-400">per seat</p>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="py-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                  <div className="w-0.5 h-16 bg-slate-200 my-1" />
                  <div className="h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {ride.pickup_time.slice(0, 5)}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {ride.origin_city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ride.pickup_location}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {ride.destination_city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ride.dropoff_location}</p>
                  </div>
                </div>
              </div>

              {/* Stopovers */}
              {ride.stopovers && ride.stopovers.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    En Route Stopovers
                  </h4>
                  <div className="space-y-1.5">
                    {ride.stopovers.map((s, idx) => (
                      <div key={s.id || idx} className="flex justify-between text-xs text-slate-700">
                        <span>
                          {idx + 1}. {s.city_name || s.location}
                        </span>
                        {s.price_from_origin ? (
                          <span className="font-semibold text-brand-600">
                            ₦{Number(s.price_from_origin).toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Vehicle Info */}
          {ride.car && (
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Vehicle Specifications
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {ride.car.make} {ride.car.model} ({ride.car.year})
                  </h4>
                  <p className="text-xs text-slate-500">Color: {ride.car.color}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Car className="h-5 w-5" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {ride.car.has_air_conditioning && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                    <Wind className="h-3.5 w-3.5" /> Air Conditioning
                  </span>
                )}
                {ride.car.has_wifi && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                    <Wifi className="h-3.5 w-3.5" /> Free WiFi
                  </span>
                )}
                {ride.car.has_power_outlets && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                    <Zap className="h-3.5 w-3.5" /> Charging Outlets
                  </span>
                )}
                {ride.car.smoking_allowed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    <Cigarette className="h-3.5 w-3.5" /> Smoking OK
                  </span>
                )}
                {ride.car.pets_allowed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    <Dog className="h-3.5 w-3.5" /> Pets OK
                  </span>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Booking & Driver Card (1 col) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5 border-brand-200">
            <div>
              <span className="text-xs font-semibold text-slate-500">Fare per seat</span>
              <p className="text-3xl font-black text-brand-600">
                ₦{Number(ride.price_per_seat).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Seats capacity: {ride.max_passengers} passengers
              </p>
            </div>

            <Button
              size="lg"
              className="w-full font-bold"
              onClick={() =>
                navigate(
                  `/rides/${ride.id}/book?date=${encodeURIComponent(
                    travelDate
                  )}&seats=${ride.max_passengers}`
                )
              }
            >
              Book this Trip
            </Button>
            <p className="text-center text-xs text-slate-400">
              Instant reservation and secure online checkout
            </p>
          </Card>

          {/* Driver Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Driver Profile
            </h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                {ride.driver?.full_name ? ride.driver.full_name[0] : 'D'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {ride.driver?.full_name || 'Verified Driver'}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <RatingStars rating={driverRating?.average_rating || 5} size="sm" showText />
                  <span className="text-xs text-slate-400">
                    ({driverRating?.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Identity & Driver License Verified</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
