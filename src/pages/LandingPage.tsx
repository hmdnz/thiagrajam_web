import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, MapPin, Calendar, Users, Star, Car, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState('1');

  useEffect(() => {
    document.title = 'Wenyfour | Smart Car-Sharing in Nigeria';
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromLocation) params.append('from', fromLocation);
    if (toLocation) params.append('to', toLocation);
    if (date) params.append('date', date);
    if (passengers) params.append('passengers', passengers);
    navigate(`/rides?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-slate-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            🚗 Verified Intercity Carpool & Rides
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Travel Smart. Share the Journey across Nigeria.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Connect with verified drivers travelling your way. Book comfortable seats at affordable rates
            or offer your empty seats to offset trip fuel costs.
          </p>

          {/* Search Box Card */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 text-left mb-1">
                  Leaving From
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                  <MapPin className="h-4 w-4 text-brand-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Lagos"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="w-full text-sm bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 text-left mb-1">
                  Going To
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Ibadan"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="w-full text-sm bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 text-left mb-1">
                  Travel Date
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm bg-transparent focus:outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <Button type="submit" size="lg" className="w-full font-bold">
                  <Search className="mr-2 h-4 w-4" /> Search Rides
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits / Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Why Travel with Wenyfour?</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Experience reliable, comfortable intercity transit with built-in safety mechanisms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">NIN & License Verification</h3>
            <p className="text-sm text-slate-600">
              Every driver and passenger is verified with Government NIN and driver's license checks before
              sharing trips.
            </p>
          </Card>

          <Card className="text-center p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Affordable & Comfortable</h3>
            <p className="text-sm text-slate-600">
              Save up to 40% compared to traditional buses, enjoy AC and direct dropoffs at your desired
              landmarks.
            </p>
          </Card>

          <Card className="text-center p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Community Ratings</h3>
            <p className="text-sm text-slate-600">
              Transparent 1-to-5 star ratings and genuine passenger reviews ensure trusted, courteous
              co-travellers.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA For Drivers */}
      <section className="bg-brand-50 border-y border-brand-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Driving Somewhere Soon?
            </span>
            <h2 className="text-3xl font-black text-slate-900">Publish your ride and cover fuel costs</h2>
            <p className="text-slate-600 max-w-lg">
              Heading to Abuja, Ibadan, Benin, or Port Harcourt? Post your empty seats in minutes and get
              paid directly into your Nigerian bank account.
            </p>
          </div>
          <Link to="/register?role=driver">
            <Button size="lg" className="whitespace-nowrap font-bold">
              Become a Driver <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
