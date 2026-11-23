import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  User,
  ShieldCheck,
  Key,
  Star,
  ArrowRightLeft,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Profile | Wenyfour';
  }, []);

  const handleRoleToggle = () => {
    const nextRole = activeRole === 'passenger' ? 'driver' : 'passenger';
    switchRole(nextRole);
    navigate(nextRole === 'driver' ? '/driver' : '/rides');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account & Profile</h1>
          <p className="text-sm text-slate-500">Manage your credentials, safety ID, and ride preferences</p>
        </div>
        <Link to="/profile/edit">
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.full_name || 'User'}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-100"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-3xl">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.full_name || 'Wenyfour User'}</h2>
              <div className="flex justify-center sm:justify-start gap-1.5">
                <Badge
                  label={activeRole === 'driver' ? 'Driver Mode' : 'Passenger Mode'}
                  variant="primary"
                />
                <Badge
                  label={`NIN: ${user?.nin_verification_status || 'unverified'}`}
                  variant={user?.nin_verified ? 'success' : 'warning'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 pt-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{user?.phone_number || 'No phone provided'}</span>
              </div>
              {user?.address && (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{user.address}</span>
                </div>
              )}
              {user?.date_of_birth && (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Born: {user.date_of_birth}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Role Switching Card */}
      <Card className="bg-brand-50/60 border-brand-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-brand-900">
            Currently in {activeRole === 'passenger' ? 'Passenger' : 'Driver'} Mode
          </h3>
          <p className="text-sm text-brand-700 mt-0.5">
            {activeRole === 'passenger'
              ? 'Switch to driver mode to post trips, manage your vehicle, and earn.'
              : 'Switch to passenger mode to search and book rides across Nigeria.'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRoleToggle} className="whitespace-nowrap">
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Switch to {activeRole === 'passenger' ? 'Driver' : 'Passenger'}
        </Button>
      </Card>

      {/* Quick Navigation Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/verification" className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">National ID & Driver License</h4>
                <p className="text-xs text-slate-500">Government compliance and verification checks</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </Card>
        </Link>

        <Link to="/change-password" className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Change Password</h4>
                <p className="text-xs text-slate-500">Update security and access credentials</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </Card>
        </Link>

        <Link to={activeRole === 'driver' ? '/driver/reviews' : '/reviews'} className="block">
          <Card className="p-5 hover:border-brand-300 transition-colors cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ratings & Reviews</h4>
                <p className="text-xs text-slate-500">View trust metrics and trip feedback</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </Card>
        </Link>

        <Card
          onClick={() => {
            if (confirm('Are you sure you want to sign out?')) {
              logout();
              navigate('/login');
            }
          }}
          className="p-5 hover:border-red-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-600">Sign Out</h4>
              <p className="text-xs text-slate-500">End your current web session</p>
            </div>
          </div>
          <span className="text-slate-400">›</span>
        </Card>
      </div>
    </div>
  );
};
