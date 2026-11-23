import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetMutation = useResetPassword();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Set New Password | Wenyfour';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMessage('Please provide the reset token.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await resetMutation.mutateAsync({
        token: token.trim(),
        new_password: newPassword,
      });

      setSuccessMessage(res.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Set new password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Paste the token from your email or SMS, then choose a secure password.
        </p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Reset Token"
          type="text"
          placeholder="Paste token here"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Min. 6 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          loading={resetMutation.isPending}
        >
          Update Password
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
