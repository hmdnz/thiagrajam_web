import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePublishRide } from '../../hooks/useRides';
import { useMyCars } from '../../hooks/useCars';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { StopoverIn } from '../../types/rides';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export const CreateRidePage: React.FC = () => {
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const { data: cars = [], isLoading: loadingCars } = useMyCars();
  const publishMutation = usePublishRide();
  const navigate = useNavigate();

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState('08:00:00');
  const [pricePerSeat, setPricePerSeat] = useState('5000');
  const [maxPassengers, setMaxPassengers] = useState('4');
  const [maxBackSeatPassengers, setMaxBackSeatPassengers] = useState('2');
  const [instantBooking, setInstantBooking] = useState(false);

  // Stopovers
  const [stopovers, setStopovers] = useState<StopoverIn[]>([]);
  const [newStopCity, setNewStopCity] = useState('');
  const [newStopPrice, setNewStopPrice] = useState('2500');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Offer a Ride | Wenyfour';
  }, []);

  useEffect(() => {
    if (cars.length > 0 && selectedCarId === null) {
      setSelectedCarId(cars[0].id);
    }
  }, [cars, selectedCarId]);

  const addStopover = () => {
    if (!newStopCity.trim()) return;
    setStopovers((prev) => [
      ...prev,
      {
        city_name: newStopCity.trim(),
        location: newStopCity.trim(),
        order: prev.length + 1,
        price_from_origin: parseFloat(newStopPrice) || 0,
      },
    ]);
    setNewStopCity('');
    setNewStopPrice('');
  };

  const removeStopover = (idx: number) => {
    setStopovers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId) {
      setErrorMessage('Please select or add a vehicle first.');
      return;
    }
    if (!originCity.trim() || !destinationCity.trim()) {
      setErrorMessage('Please specify both origin and destination cities.');
      return;
    }
    const passengersCount = parseInt(maxPassengers, 10);
    if (isNaN(passengersCount) || passengersCount < 4) {
      setErrorMessage('max_passengers must be at least 4.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await publishMutation.mutateAsync({
        car_id: selectedCarId,
        origin_city: originCity.trim(),
        destination_city: destinationCity.trim(),
        pickup_location: pickupLocation.trim(),
        dropoff_location: dropoffLocation.trim(),
        dates: [date.trim()],
        start_date: date.trim(),
        pickup_time: time.trim(),
        max_passengers: passengersCount,
        max_back_seat_passengers: parseInt(maxBackSeatPassengers, 10) || undefined,
        price_per_seat: parseFloat(pricePerSeat) || 1000,
        instant_booking: instantBooking,
        stopovers: stopovers.length > 0 ? stopovers : undefined,
      });

      setSuccessMessage('Ride published successfully!');
      setTimeout(() => navigate('/driver/rides'), 1500);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Offer a New Ride</h1>
        <p className="text-sm text-slate-500">
          Post empty seats on your journey to share travel costs
        </p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Selection */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900">Select Vehicle</h3>
            <Link
              to="/driver/cars"
              className="text-xs font-semibold text-brand-600 hover:text-brand-500"
            >
              + Add New Car
            </Link>
          </div>

          {cars.length === 0 ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-slate-500">You have no registered vehicles.</p>
              <Link to="/driver/cars">
                <Button size="sm">Register Vehicle Now</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cars.map((car) => (
                <button
                  type="button"
                  key={car.id}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCarId === car.id
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-1 ring-brand-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-sm font-bold">
                    {car.make} {car.model} ({car.year})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Plate: {car.plate_number || 'N/A'} • {car.color}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Route Details */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Journey Origin & Destination
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Origin City"
              placeholder="e.g. Lagos"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              required
            />
            <Input
              label="Destination City"
              placeholder="e.g. Ibadan"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Pickup Meeting Point"
              placeholder="e.g. Ojota Bus Stop / Mobil Station"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
            <Input
              label="Dropoff Point"
              placeholder="e.g. Iwo Road Roundabout"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Stopovers */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            En Route Stopovers (Optional)
          </h3>

          {stopovers.length > 0 && (
            <div className="space-y-2">
              {stopovers.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  <span>
                    {idx + 1}. {stop.city_name} (₦{stop.price_from_origin})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStopover(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <Input
                label="Stopover City"
                placeholder="e.g. Sagamu"
                value={newStopCity}
                onChange={(e) => setNewStopCity(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Price from Origin ₦"
                type="number"
                placeholder="2500"
                value={newStopPrice}
                onChange={(e) => setNewStopPrice(e.target.value)}
              />
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addStopover}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Stopover
          </Button>
        </Card>

        {/* Schedule & Pricing */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Date, Time & Seats
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Departure Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Pickup Time"
              type="text"
              placeholder="08:00:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price Per Seat (₦)"
              type="number"
              placeholder="5000"
              value={pricePerSeat}
              onChange={(e) => setPricePerSeat(e.target.value)}
              required
            />
            <Input
              label="Available Seats (min 4)"
              type="number"
              min="4"
              max="8"
              value={maxPassengers}
              onChange={(e) => setMaxPassengers(e.target.value)}
              required
            />
            <Input
              label="Max Backseat Passengers"
              type="number"
              min="1"
              max="3"
              value={maxBackSeatPassengers}
              onChange={(e) => setMaxBackSeatPassengers(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="instantBooking"
              checked={instantBooking}
              onChange={(e) => setInstantBooking(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="instantBooking" className="text-sm font-medium text-slate-700">
              Enable Instant Booking (approve passengers automatically without manual confirmation)
            </label>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="lg" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={publishMutation.isPending}
            className="font-bold px-8"
          >
            Publish Ride Offer
          </Button>
        </div>
      </form>
    </div>
  );
};
