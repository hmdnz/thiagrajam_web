import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Search,
  Ticket,
  Wallet,
  Car,
  PlusCircle,
  ClipboardList,
  Star,
  User,
  ShieldCheck,
  LayoutDashboard,
  Bell,
  ArrowRightLeft,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeRole, switchRole } = useAuthStore();

  const passengerLinks = [
    { name: 'Find Rides', to: '/rides', icon: Search },
    { name: 'My Bookings', to: '/bookings', icon: Ticket },
    { name: 'Wallet & Payments', to: '/wallet', icon: Wallet },
    { name: 'My Reviews', to: '/reviews', icon: Star },
    { name: 'Profile Settings', to: '/profile', icon: User },
    { name: 'Identity & NIN', to: '/verification', icon: ShieldCheck },
  ];

  const driverLinks = [
    { name: 'Driver Dashboard', to: '/driver', icon: LayoutDashboard },
    { name: 'Offer a Ride', to: '/driver/create-ride', icon: PlusCircle },
    { name: 'Published Rides', to: '/driver/rides', icon: Car },
    { name: 'Booking Requests', to: '/driver/bookings', icon: ClipboardList },
    { name: 'My Vehicles', to: '/driver/cars', icon: Car },
    { name: 'Earnings & Payouts', to: '/driver/wallet', icon: Wallet },
    { name: 'Passenger Feedback', to: '/driver/reviews', icon: Star },
    { name: 'License Verification', to: '/verification', icon: ShieldCheck },
  ];

  const links = activeRole === 'driver' ? driverLinks : passengerLinks;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            <div className="px-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeRole === 'driver' ? 'Driver Portal' : 'Passenger Area'}
              </span>
            </div>

            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={linkClass}
                    end={link.to === '/driver'}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                switchRole(activeRole === 'passenger' ? 'driver' : 'passenger');
                onClose();
              }}
              className="flex w-full items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span>Current Mode</span>
              <span className="inline-flex items-center gap-1 text-brand-600">
                {activeRole === 'driver' ? 'Driver 🚗' : 'Passenger 👤'}
                <ArrowRightLeft className="h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
