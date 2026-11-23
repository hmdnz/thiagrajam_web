import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'driver' ? 'driver' : 'passenger';

  const [role, setRole] = useState<'passenger' | 'driver'>(initialRole);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerMutation = useRegister();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account | Wenyfour';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phoneNumber.trim()) {
      setErrorMessage('Please provide an email or a phone number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage(null);
    try {
      await registerMutation.mutateAsync({
        email: email.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        password,
        role,
      });

      if (phoneNumber.trim()) {
        navigate(`/verify-otp?phone=${encodeURIComponent(phoneNumber.trim())}`);
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500">
            Sign in here
          </Link>
        </p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setRole('passenger')}
          className={`py-2 text-sm font-semibold rounded-lg transition-all ${
            role === 'passenger'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Passenger
        </button>
        <button
          type="button"
          onClick={() => setRole('driver')}
          className={`py-2 text-sm font-semibold rounded-lg transition-all ${
            role === 'driver'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Driver
        </button>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. 08012345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="tel"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          loading={registerMutation.isPending}
        >
          Register as {role === 'driver' ? 'Driver' : 'Passenger'}
        </Button>
      </form>
    </div>
  );
};
