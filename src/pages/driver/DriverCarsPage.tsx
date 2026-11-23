import React, { useState } from 'react';
import { useMyCars, useAddCar, useDeleteCar } from '../../hooks/useCars';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { ErrorBanner } from '../../components/ErrorBanner';
import { Modal } from '../../components/Modal';
import { Car as CarIcon, Plus, Trash2, Wind, Wifi, ShieldCheck, CheckCircle } from 'lucide-react';

export const DriverCarsPage: React.FC = () => {
  const { data: cars, isLoading, error } = useMyCars();
  const addCarMutation = useAddCar();
  const deleteCarMutation = useDeleteCar();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [totalSeats, setTotalSeats] = useState<number>(4);
  const [hasAc, setHasAc] = useState(true);
  const [hasWifi, setHasWifi] = useState(false);

  const resetForm = () => {
    setMake('');
    setModel('');
    setYear(new Date().getFullYear());
    setColor('');
    setLicensePlate('');
    setTotalSeats(4);
    setHasAc(true);
    setHasWifi(false);
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCarMutation.mutateAsync({
        make,
        model,
        year: Number(year),
        color,
        license_plate: licensePlate.toUpperCase().trim(),
        total_seats: Number(totalSeats),
        has_ac: hasAc,
        has_wifi: hasWifi,
      });
      resetForm();
      setAddModalOpen(false);
    } catch {
      // Handled by mutation error state
    }
  };

  const handleDelete = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteCarMutation.mutateAsync(carId);
      } catch {
        // Handled by mutation
      }
    }
  };

  if (isLoading) return <Loader fullScreen message="Loading registered vehicles..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register and manage vehicles approved for ridesharing.
          </p>
        </div>
        <Button variant="primary" onClick={() => setAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      {error && <ErrorBanner message="Failed to load your vehicles. Please refresh." />}

      {cars && cars.length === 0 ? (
        <EmptyState
          title="No Vehicles Registered"
          description="You haven't added any vehicles yet. Add your vehicle to start publishing trips."
          actionText="Add Vehicle"
          onAction={() => setAddModalOpen(true)}
          icon={<CarIcon className="w-12 h-12 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars?.map((car) => (
            <Card key={car.id} className="relative group overflow-hidden border border-gray-200 hover:border-emerald-500 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-xs text-gray-500">{car.year} • {car.color}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(car.id)}
                  disabled={deleteCarMutation.isPending}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Plate Number</span>
                  <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                    {car.license_plate}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Capacity</span>
                  <span className="font-semibold text-gray-800">{car.total_seats} passenger seats</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-2">
                {car.has_ac && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                    <Wind className="w-3 h-3" /> A/C
                  </span>
                )}
                {car.has_wifi && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                    <Wifi className="w-3 h-3" /> Wi-Fi
                  </span>
                )}
                {car.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Car Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Vehicle"
      >
        <form onSubmit={handleAddCar} className="space-y-4">
          {addCarMutation.error && (
            <ErrorBanner
              message={(addCarMutation.error as any)?.response?.data?.detail || 'Failed to add vehicle.'}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Make (e.g. Toyota)"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Toyota"
              required
            />
            <Input
              label="Model (e.g. Corolla)"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Corolla"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Year"
              type="number"
              min={1990}
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
            />
            <Input
              label="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Silver"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Plate Number"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="ABJ-123-XY"
              required
            />
            <Input
              label="Total Passenger Seats"
              type="number"
              min={1}
              max={15}
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-gray-700 block">Vehicle Features</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAc}
                  onChange={(e) => setHasAc(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700">Air Conditioning (A/C)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWifi}
                  onChange={(e) => setHasWifi(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700">On-board Wi-Fi</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={addCarMutation.isPending}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Save Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
