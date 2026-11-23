import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Sign In | Wenyfour';
  }, []);

  const from = (location.state as any)?.from?.pathname || '/rides';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter your email or phone number and password.');
      return;
    }

    setErrorMessage(null);
    try {
      const { loginRes } = await loginMutation.mutateAsync({ identifier, password });
      const target = loginRes.active_role === 'driver' ? '/driver' : from;
      navigate(target, { replace: true });
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500">
            create a new account
          </Link>
        </p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email or Phone Number"
          type="text"
          placeholder="e.g. user@example.com or 08012345678"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-600 hover:text-brand-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          loading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};
