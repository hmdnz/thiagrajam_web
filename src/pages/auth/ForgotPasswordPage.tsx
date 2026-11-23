import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';

export const ForgotPasswordPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const forgotMutation = useForgotPassword();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Forgot Password | Wenyfour';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address or phone number.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const isEmail = identifier.includes('@');
      const res = await forgotMutation.mutateAsync({
        email: isEmail ? identifier.trim() : undefined,
        phone_number: !isEmail ? identifier.trim() : undefined,
      });

      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your registered email or phone to receive reset instructions.
        </p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-3">
          <p className="text-sm font-medium">{successMessage}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reset-password')}
            className="w-full"
          >
            Enter Reset Token
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address or Phone"
          type="text"
          placeholder="name@example.com or 08012345678"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          loading={forgotMutation.isPending}
        >
          Send Instructions
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link to="/login" className="text-sm font-semibold text-brand-600 hover:text-brand-500">
          ← Return to sign in
        </Link>
      </div>
    </div>
  );
};
