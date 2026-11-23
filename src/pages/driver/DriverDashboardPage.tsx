import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useMyWallet } from '../../hooks/usePayments';
import { useDriverPendingBookings } from '../../hooks/useBookings';
import { useMyRides } from '../../hooks/useRides';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  PlusCircle,
  Car,
  ClipboardList,
  Wallet,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { user, switchRole } = useAuthStore();
  const { data: wallet } = useMyWallet();
  const { data: pendingBookings = [] } = useDriverPendingBookings();
  const { data: myRides = [] } = useMyRides();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Driver Dashboard | Wenyfour';
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Driver Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.full_name || 'Driver'}
          </h1>
        </div>
        <Link to="/driver/create-ride">
          <Button size="md" className="font-bold">
            <PlusCircle className="mr-2 h-4 w-4" /> Offer a Ride
          </Button>
        </Link>
      </div>

      {/* Driver License Banner if unverified */}
      {!user?.can_offer_rides && (
        <Card className="p-5 border-amber-300 bg-amber-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Driver License Verification Required</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Your driver's license must be approved by the admin team before passenger rides can be
                published.
              </p>
            </div>
          </div>
          <Link to="/verification">
            <Button size="sm" variant="outline" className="border-amber-400 text-amber-800 bg-white">
              Verify License
            </Button>
          </Link>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 text-white space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Earnings for Payout
          </span>
          <p className="text-3xl font-black text-white">
            ₦{Number(wallet?.available_balance_naira || 0).toLocaleString()}
          </p>
          <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
            <span>Pending: ₦{Number(wallet?.pending_balance_naira || 0).toLocaleString()}</span>
            <Link to="/driver/wallet" className="text-brand-400 hover:underline">
              Payouts ›
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Requests
          </span>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-slate-900">{pendingBookings.length}</p>
            {pendingBookings.length > 0 && <Badge label="Needs Review" variant="warning" />}
          </div>
          <div className="pt-2 text-xs text-slate-500">
            <Link to="/driver/bookings" className="text-brand-600 font-semibold hover:underline">
              Review requests ›
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Published Trips
          </span>
          <p className="text-3xl font-black text-slate-900">{myRides.length}</p>
          <div className="pt-2 text-xs text-slate-500">
            <Link to="/driver/rides" className="text-brand-600 font-semibold hover:underline">
              View offers ›
            </Link>
          </div>
        </Card>
      </div>

      {/* Pending Requests Alert Box */}
      {pendingBookings.length > 0 && (
        <Card className="p-6 border-brand-200 bg-brand-50/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {pendingBookings.length} Passenger Request{pendingBookings.length > 1 ? 's' : ''} Awaiting
                Confirmation
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Confirm seats to secure passengers and release fares upon completion.
              </p>
            </div>
            <Link to="/driver/bookings">
              <Button size="sm" className="font-bold">
                Open Requests
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/driver/create-ride" className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
                <PlusCircle className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Offer New Ride</h4>
              <p className="text-xs text-slate-500 mt-1">Publish an intercity route with custom stopovers</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 mt-4 flex items-center gap-1">
              Create offer <ArrowRight className="h-3 w-3" />
            </span>
          </Card>
        </Link>

        <Link to="/driver/cars" className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <Car className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">My Vehicles</h4>
              <p className="text-xs text-slate-500 mt-1">Register cars, specs, A/C, and upload vehicle photos</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 mt-4 flex items-center gap-1">
              Manage cars <ArrowRight className="h-3 w-3" />
            </span>
          </Card>
        </Link>

        <Link to="/driver/wallet" className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Wallet className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Earnings & Payouts</h4>
              <p className="text-xs text-slate-500 mt-1">Request transfers to Nigerian banks & download statements</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 mt-4 flex items-center gap-1">
              View wallet <ArrowRight className="h-3 w-3" />
            </span>
          </Card>
        </Link>

        <Link to="/driver/reviews" className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Passenger Ratings</h4>
              <p className="text-xs text-slate-500 mt-1">Check co-rider feedback and your average score</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 mt-4 flex items-center gap-1">
              View reviews <ArrowRight className="h-3 w-3" />
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
};
