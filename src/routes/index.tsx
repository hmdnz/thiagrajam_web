import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Public pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { VerifyOtpPage } from '../pages/auth/VerifyOtpPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// Shared protected pages
import { ProfilePage } from '../pages/shared/ProfilePage';
import { EditProfilePage } from '../pages/shared/EditProfilePage';
import { ChangePasswordPage } from '../pages/shared/ChangePasswordPage';
import { DriverVerificationPage } from '../pages/shared/DriverVerificationPage';
import { NotificationsPage } from '../pages/shared/NotificationsPage';
import { UnauthorizedPage } from '../pages/shared/UnauthorizedPage';
import { NotFoundPage } from '../pages/shared/NotFoundPage';

// Passenger pages
import { SearchRidesPage } from '../pages/passenger/SearchRidesPage';
import { RideDetailsPage } from '../pages/passenger/RideDetailsPage';
import { BookRidePage } from '../pages/passenger/BookRidePage';
import { PaymentPage } from '../pages/passenger/PaymentPage';
import { PaymentCallbackPage } from '../pages/passenger/PaymentCallbackPage';
import { MyBookingsPage } from '../pages/passenger/MyBookingsPage';
import { OngoingTripPage } from '../pages/passenger/OngoingTripPage';
import { RateTripPage } from '../pages/passenger/RateTripPage';
import { MyReviewsPage } from '../pages/passenger/MyReviewsPage';
import { PassengerWalletPage } from '../pages/passenger/PassengerWalletPage';

// Driver pages
import { DriverDashboardPage } from '../pages/driver/DriverDashboardPage';
import { CreateRidePage } from '../pages/driver/CreateRidePage';
import { DriverRidesPage } from '../pages/driver/DriverRidesPage';
import { DriverBookingsPage } from '../pages/driver/DriverBookingsPage';
import { DriverTripExecutionPage } from '../pages/driver/DriverTripExecutionPage';
import { DriverCarsPage } from '../pages/driver/DriverCarsPage';
import { DriverWalletPage } from '../pages/driver/DriverWalletPage';
import { DriverReviewsPage } from '../pages/driver/DriverReviewsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes wrapped in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected App Routes wrapped in AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Shared Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/change-password" element={<ChangePasswordPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/driver/verify" element={<DriverVerificationPage />} />

        {/* Passenger Routes */}
        <Route path="/rides" element={<SearchRidesPage />} />
        <Route path="/rides/:id" element={<RideDetailsPage />} />
        <Route path="/rides/:id/book" element={<BookRidePage />} />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/payment/callback" element={<PaymentCallbackPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/bookings/:id" element={<OngoingTripPage />} />
        <Route path="/bookings/:id/rate" element={<RateTripPage />} />
        <Route path="/reviews" element={<MyReviewsPage />} />
        <Route path="/wallet" element={<PassengerWalletPage />} />

        {/* Driver Routes (Role-guarded: driver) */}
        <Route
          path="/driver"
          element={<Navigate to="/driver/dashboard" replace />}
        />
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/rides/new"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <CreateRidePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/rides"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverRidesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/bookings"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/trips/:id"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverTripExecutionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/cars"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverCarsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/wallet"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverWalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/reviews"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverReviewsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Error / Status Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
