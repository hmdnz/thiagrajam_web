import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyOtp, useResendOtp } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const phoneParam = searchParams.get('phone') || '';
  const [phoneNumber, setPhoneNumber] = useState(phoneParam);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Verify Phone OTP | Wenyfour';
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setErrorMessage(null);
    try {
      await verifyOtpMutation.mutateAsync({
        phone_number: phoneNumber,
        otp: otp.trim(),
      });
      navigate('/rides');
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await resendOtpMutation.mutateAsync({ phone_number: phoneNumber });
      setSuccessMessage(res.message || 'A fresh code has been sent.');
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Verify your phone</h2>
        <p className="mt-1 text-sm text-slate-500">
          We sent a verification SMS to{' '}
          <span className="font-semibold text-slate-900">{phoneNumber}</span>
        </p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        {!phoneParam && (
          <Input
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        )}

        <Input
          label="6-Digit Verification Code (OTP)"
          type="text"
          placeholder="e.g. 123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          autoFocus
          required
        />

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          loading={verifyOtpMutation.isPending}
        >
          Verify Phone
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-500">
          Didn't receive the SMS?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendOtpMutation.isPending}
            className="font-semibold text-brand-600 hover:text-brand-500 underline disabled:opacity-50"
          >
            {resendOtpMutation.isPending ? 'Resending...' : 'Resend code'}
          </button>
        </p>
      </div>
    </div>
  );
};
