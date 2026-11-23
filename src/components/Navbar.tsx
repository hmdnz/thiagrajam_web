import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ArrowRightLeft,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, activeRole, switchRole, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleRoleToggle = () => {
    const nextRole = activeRole === 'passenger' ? 'driver' : 'passenger';
    switchRole(nextRole);
    navigate(nextRole === 'driver' ? '/driver' : '/rides');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-brand-600">
              Wenyfour
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-700">
              Car-Sharing
            </span>
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Passenger / Driver Mode Switcher */}
            <button
              onClick={handleRoleToggle}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Switch to {activeRole === 'passenger' ? 'Driver' : 'Passenger'}</span>
            </button>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 focus:outline-none"
                aria-expanded={userMenuOpen}
              >
                {user?.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.full_name || 'User'}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-500"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden md:inline-block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                  {user?.full_name || 'My Account'}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none divide-y divide-slate-100">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || user?.phone_number}</p>
                      <div className="mt-1.5 flex gap-1">
                        <Badge
                          label={activeRole === 'driver' ? 'Driver' : 'Passenger'}
                          variant="primary"
                        />
                        {user?.nin_verified && <Badge label="NIN" variant="success" />}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/verification"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                        Identity Verification
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/rides">
              <Button variant="ghost" size="sm">
                Search Rides
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
