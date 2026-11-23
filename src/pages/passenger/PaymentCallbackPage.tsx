import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useVerifyPayment } from '../../hooks/usePayments';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { CheckCircle2, XCircle } from 'lucide-react';

export const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const messageParam = searchParams.get('message');
  const bookingIdParam = searchParams.get('bookingId');
  const refParam = searchParams.get('reference') || searchParams.get('transaction_ref');

  const [isVerifying, setIsVerifying] = useState(!!refParam && !statusParam);
  const [isSuccess, setIsSuccess] = useState(statusParam === 'success');
  const [displayMessage, setDisplayMessage] = useState(
    messageParam || (statusParam === 'success' ? 'Your booking has been paid and confirmed!' : '')
  );

  const verifyMutation = useVerifyPayment();

  useEffect(() => {
    document.title = 'Payment Status | Wenyfour';

    if (refParam && !statusParam) {
      verifyMutation
        .mutateAsync({ transaction_ref: refParam })
        .then((res) => {
          if (res.status === 'success') {
            setIsSuccess(true);
            setDisplayMessage('Your payment has been successfully verified.');
          } else {
            setIsSuccess(false);
            setDisplayMessage(res.failure_reason || 'Payment was not successful.');
          }
        })
        .catch((err) => {
          setIsSuccess(false);
          setDisplayMessage('Unable to verify payment reference.');
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [refParam, statusParam]);

  if (isVerifying) {
    return <Loader fullScreen message="Verifying your payment with the gateway..." />;
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="p-8 text-center space-y-4">
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <XCircle className="h-10 w-10" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {displayMessage ||
            (isSuccess
              ? 'Your seat reservation has been confirmed by the system.'
              : 'The transaction could not be completed. Please try again or choose another payment method.')}
        </p>

        {bookingIdParam && (
          <p className="text-xs text-slate-400 font-mono">Booking ID: #{bookingIdParam}</p>
        )}

        <div className="pt-4 flex flex-col gap-2">
          {isSuccess ? (
            <Link to="/bookings">
              <Button size="lg" className="w-full font-bold">
                View My Bookings
              </Button>
            </Link>
          ) : (
            <Link to="/rides">
              <Button size="lg" variant="outline" className="w-full font-bold">
                Find Another Ride
              </Button>
            </Link>
          )}

          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
