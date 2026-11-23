# Wenyfour (Winnie4) Web Frontend

Responsive, high-performance web client for **Wenyfour** (intercity car-sharing platform in Nigeria), built with React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, and Zustand.

Fully integrated with the FastAPI backend at `c:\Users\USER\Downloads\thiagrajam` (branch `payment-2a`), maintaining 100% feature parity with the Expo React Native mobile client.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your backend:
```env
VITE_API_URL=http://localhost:8000
```

> **Note on CORS:** Ensure the backend `main.py` CORS middleware allows origin `http://localhost:5173`.

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Directory Structure

```
thiagrajam_web/
├── public/
├── src/
│   ├── api/             # Typed API clients for each backend domain
│   │   ├── client.ts    # Central Axios instance with token interceptor
│   │   ├── auth.ts      # Auth & OTP verification
│   │   ├── users.ts     # User profiles & driver verification
│   │   ├── rides.ts     # Ride creation, search, & details
│   │   ├── bookings.ts  # Booking lifecycle (request, confirm, start, complete, cancel)
│   │   ├── payments.ts  # Squad/Paystack initialization, verification, & payouts
│   │   ├── reviews.ts   # Ratings & feedback
│   │   └── cars.ts      # Vehicle registration & management
│   ├── components/      # Reusable UI component library
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── RatingStars.tsx
│   │   ├── Badge.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/           # TanStack Query custom hooks
│   │   ├── useAuth.ts
│   │   ├── useRides.ts
│   │   ├── useBookings.ts
│   │   ├── usePayments.ts
│   │   ├── useReviews.ts
│   │   └── useCars.ts
│   ├── layouts/
│   │   ├── AppLayout.tsx   # Authenticated shell (Navbar, Sidebar, Content)
│   │   └── AuthLayout.tsx  # Unauthenticated shell (Header, Centered card)
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── auth/           # Login, Register, VerifyOtp, Forgot/ResetPassword
│   │   ├── passenger/      # Search, Details, Booking, Payment, Tracking, Ratings
│   │   ├── driver/         # Dashboard, Create Ride, Manage Bookings, Execution, Cars, Wallet, Reviews
│   │   └── shared/         # Profile, Notifications, Driver Verification, 404, Unauthorized
│   ├── routes/             # Central route definition with role guards
│   ├── store/              # Zustand global authentication & role store
│   ├── types/              # Domain TypeScript interfaces mirroring backend schemas
│   ├── App.tsx             # Root component with Providers
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind directives & theme styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠 Feature & Endpoint Coverage

| Domain | Backend Route | Web Screen / Feature |
|---|---|---|
| **Auth** | `POST /auth/login` | `LoginPage.tsx` (OAuth2 form submission) |
| **Auth** | `POST /users` | `RegisterPage.tsx` (Role selection: passenger/driver) |
| **Auth** | `POST /verify-otp` | `VerifyOtpPage.tsx` (SMS OTP verification) |
| **Auth** | `POST /resend-otp` | `VerifyOtpPage.tsx` (Resend code) |
| **Auth** | `POST /auth/forgot-password` | `ForgotPasswordPage.tsx` |
| **Auth** | `POST /auth/reset-password` | `ResetPasswordPage.tsx` |
| **User** | `GET /users/me` | `ProfilePage.tsx` |
| **User** | `PUT /users/me` | `EditProfilePage.tsx` |
| **User** | `POST /users/change-password` | `ChangePasswordPage.tsx` |
| **User** | `POST /users/driver-verification` | `DriverVerificationPage.tsx` (License upload) |
| **Rides** | `GET /rides/` | `SearchRidesPage.tsx` (Origin, destination, date, seats) |
| **Rides** | `GET /rides/{id}` | `RideDetailsPage.tsx` (Driver profile, amenities, route) |
| **Rides** | `POST /rides/` | `CreateRidePage.tsx` (Stops, pricing, seats, car) |
| **Rides** | `GET /rides/my-rides` | `DriverRidesPage.tsx` (Driver published rides) |
| **Rides** | `DELETE /rides/{id}` | `DriverRidesPage.tsx` (Cancel ride) |
| **Bookings**| `POST /bookings/` | `BookRidePage.tsx` (Seat selection, instant/request) |
| **Bookings**| `GET /bookings/my-bookings` | `MyBookingsPage.tsx` (Passenger bookings filterable by status) |
| **Bookings**| `GET /bookings/{id}` | `OngoingTripPage.tsx` & `DriverTripExecutionPage.tsx` |
| **Bookings**| `POST /bookings/{id}/confirm` | `DriverBookingsPage.tsx` (Driver accepts booking) |
| **Bookings**| `POST /bookings/{id}/start-trip` | `DriverTripExecutionPage.tsx` (Start journey) |
| **Bookings**| `POST /bookings/{id}/complete-trip` | `DriverTripExecutionPage.tsx` (Complete & release escrow) |
| **Bookings**| `POST /bookings/{id}/cancel` | `MyBookingsPage.tsx` & `DriverTripExecutionPage.tsx` |
| **Payments**| `POST /payments/initialize` | `PaymentPage.tsx` (Squad & Paystack gateway checkout) |
| **Payments**| `POST /payments/verify` | `PaymentCallbackPage.tsx` (Verify transaction reference) |
| **Payments**| `GET /payments/wallet/balance` | `PassengerWalletPage.tsx` & `DriverWalletPage.tsx` |
| **Payments**| `GET /payments/wallet/transactions` | `PassengerWalletPage.tsx` & `DriverWalletPage.tsx` |
| **Payments**| `POST /payments/wallet/payout` | `DriverWalletPage.tsx` (Withdraw to Nigerian bank account) |
| **Payments**| `POST /payments/wallet/statement` | `DriverWalletPage.tsx` (Date-range export) |
| **Reviews** | `POST /reviews/` | `RateTripPage.tsx` (1-5 stars, comments, safety tags) |
| **Reviews** | `GET /reviews/my-reviews` | `MyReviewsPage.tsx` (Reviews written by user) |
| **Reviews** | `GET /reviews/received` | `DriverReviewsPage.tsx` (Reviews received from passengers) |
| **Reviews** | `GET /reviews/driver/{id}/summary`| `DriverReviewsPage.tsx` (Driver rating breakdown) |
| **Cars** | `GET /cars/my-cars` | `DriverCarsPage.tsx` (List registered cars) |
| **Cars** | `POST /cars/` | `DriverCarsPage.tsx` (Add car with A/C, Wi-Fi, plate) |
| **Cars** | `DELETE /cars/{id}` | `DriverCarsPage.tsx` (Remove car) |
