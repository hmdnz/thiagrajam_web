import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInitializePayment, useVerifyPayment } from '../../hooks/usePayments';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { PaymentProvider } from '../../types/payments';
import { CreditCard, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingIdParam = searchParams.get('bookingId');
  const amountParam = searchParams.get('amount');
  const emailParam = searchParams.get('email') || '';

  const bookingId = parseInt(bookingIdParam || '0', 10);
  const amountNaira = parseFloat(amountParam || '0');

  const [provider, setProvider] = useState<PaymentProvider>('squad');
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initMutation = useInitializePayment();
  const verifyMutation = useVerifyPayment();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Secure Payment | Wenyfour';
  }, []);

  const handleInitialize = async () => {
    setErrorMessage(null);
    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      const res = await initMutation.mutateAsync({
        booking_id: bookingId,
        provider,
        email: emailParam,
        callback_url: callbackUrl,
      });

      setTransactionRef(res.transaction_ref);

      if (res.auth_url) {
        setAuthUrl(res.auth_url);
        // Automatically open payment portal in new tab or popup
        window.open(res.auth_url, '_blank', 'noopener,noreferrer');
      } else {
        // Direct sandbox verify
        handleVerify(res.transaction_ref);
      }
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const handleVerify = async (refOverride?: string) => {
    const ref = refOverride || transactionRef;
    if (!ref) {
      setErrorMessage('No transaction reference found.');
      return;
    }

    setErrorMessage(null);
    try {
      const result = await verifyMutation.mutateAsync({ transaction_ref: ref });
      if (result.status === 'success') {
        navigate(`/payment/callback?status=success&bookingId=${bookingId}`);
      } else {
        navigate(
          `/payment/callback?status=failed&message=${encodeURIComponent(
            result.failure_reason || 'Payment could not be verified'
          )}`
        );
      }
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Checkout</h1>
        <p className="text-sm text-slate-500">Complete payment to finalize your booking</p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {/* Booking Summary */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Payment Details
        </h3>
        <div className="flex justify-between items-center py-2 border-b border-slate-100">
          <span className="text-sm text-slate-600">Booking Reference:</span>
          <span className="text-sm font-bold text-slate-900">#{bookingId}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-100">
          <span className="text-sm text-slate-600">Payer Email:</span>
          <span className="text-sm font-medium text-slate-700">{emailParam}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-slate-900">Total Amount:</span>
          <span className="text-3xl font-black text-brand-600">
            ₦{amountNaira.toLocaleString()}
          </span>
        </div>
      </Card>

      {/* Gateway Selector */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Select Payment Gateway
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setProvider('squad')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              provider === 'squad'
                ? 'border-brand-600 bg-brand-50/50 text-brand-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <p className="text-sm font-bold">Squad by GTCO</p>
            <p className="text-xs text-slate-500 mt-0.5">Cards, USSD, Bank Transfer</p>
          </button>

          <button
            type="button"
            onClick={() => setProvider('paystack')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              provider === 'paystack'
                ? 'border-brand-600 bg-brand-50/50 text-brand-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <p className="text-sm font-bold">Paystack</p>
            <p className="text-xs text-slate-500 mt-0.5">Debit Card, Apple Pay</p>
          </button>
        </div>
      </Card>

      {/* Action / Portal Button */}
      {transactionRef ? (
        <Card className="p-6 space-y-4 border-brand-300 bg-brand-50/30">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Payment Reference Initialized</h4>
            <p className="text-xs font-mono text-slate-600 mt-1 bg-white p-2 rounded border border-slate-200">
              {transactionRef}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {authUrl && (
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="md" className="w-full font-bold">
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Payment Gateway
                </Button>
              </a>
            )}
            <Button
              size="md"
              onClick={() => handleVerify()}
              loading={verifyMutation.isPending}
              className="flex-1 font-bold"
            >
              Verify Payment Status
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          size="lg"
          onClick={handleInitialize}
          loading={initMutation.isPending}
          className="w-full font-bold py-3 text-base"
        >
          Proceed to Pay ₦{amountNaira.toLocaleString()}
        </Button>
      )}
    </div>
  );
};
