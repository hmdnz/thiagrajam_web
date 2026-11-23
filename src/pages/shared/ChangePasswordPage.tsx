import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '../../hooks/useAuth';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';

export const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changeMutation = useChangePassword();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Change Password | Wenyfour';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await changeMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccessMessage(res.message || 'Password changed successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
          <p className="text-sm text-slate-500">Ensure your account uses a long, unique password</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full font-bold"
              loading={changeMutation.isPending}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
