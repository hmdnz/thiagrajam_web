import React, { useState, useEffect } from 'react';
import {
  useMyWallet,
  useMyTransactions,
  useMyRefunds,
  useRequestRefund,
} from '../../hooks/usePayments';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { Wallet, ArrowDownRight, ArrowUpRight, RotateCcw } from 'lucide-react';

export const PassengerWalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'refunds'>('transactions');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: wallet, isLoading: loadingWallet, refetch: refetchWallet } = useMyWallet();
  const { data: transactions = [], isLoading: loadingTx, refetch: refetchTx } = useMyTransactions();
  const { data: refunds = [], isLoading: loadingRefunds, refetch: refetchRefunds } = useMyRefunds();

  const refundMutation = useRequestRefund();

  useEffect(() => {
    document.title = 'Passenger Wallet & Refunds | Wenyfour';
  }, []);

  const handleRefresh = () => {
    refetchWallet();
    refetchTx();
    refetchRefunds();
  };

  const handleCreateRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId.trim()) {
      setErrorMessage('Please specify the Payment ID.');
      return;
    }
    if (!refundReason.trim()) {
      setErrorMessage('Please provide a reason for the refund request.');
      return;
    }

    setErrorMessage(null);
    try {
      await refundMutation.mutateAsync({
        payment_id: parseInt(paymentId, 10),
        reason: refundReason.trim(),
      });

      setSuccessMessage('Refund request submitted to administrative review.');
      setShowRefundModal(false);
      setPaymentId('');
      setRefundReason('');
      handleRefresh();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const isLoading = loadingWallet || (activeTab === 'transactions' ? loadingTx : loadingRefunds);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wallet & Payments</h1>
          <p className="text-sm text-slate-500">View transactions and manage trip refunds</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setErrorMessage(null);
            setSuccessMessage(null);
            setShowRefundModal(true);
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Request Refund
        </Button>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* Balance Card */}
      <Card className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Available Wallet Balance
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
          <p className="text-4xl sm:text-5xl font-black text-white">
            ₦{Number(wallet?.available_balance_naira || 0).toLocaleString()}
          </p>
          <div className="text-right">
            <span className="text-xs text-slate-400">Pending: </span>
            <span className="text-sm font-bold text-slate-200">
              ₦{Number(wallet?.pending_balance_naira || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'transactions'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Transaction History ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'refunds'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Refund Requests ({refunds.length})
        </button>
      </div>

      {isLoading ? (
        <Loader message="Loading financial records..." />
      ) : activeTab === 'transactions' ? (
        transactions.length === 0 ? (
          <EmptyState
            title="No Transactions"
            description="Your booking payments and refunds will appear here."
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.direction === 'inflow'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tx.direction === 'inflow' ? (
                      <ArrowDownRight className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {tx.description || (tx.direction === 'inflow' ? 'Credit' : 'Payment')}
                    </h4>
                    <p className="text-xs text-slate-400">{tx.transaction_date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-base font-bold ${
                      tx.direction === 'inflow' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.direction === 'inflow' ? '+' : '-'}₦
                    {Number(tx.amount_naira).toLocaleString()}
                  </span>
                  {tx.provider_ref && (
                    <p className="text-[10px] text-slate-400 font-mono">Ref: {tx.provider_ref}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )
      ) : refunds.length === 0 ? (
        <EmptyState
          title="No Refund Requests"
          description="If you had an issue with a cancelled trip, you can file a refund request."
          actionTitle="Request Refund"
          onAction={() => setShowRefundModal(true)}
        />
      ) : (
        <div className="space-y-3">
          {refunds.map((ref) => (
            <Card key={ref.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Refund #{ref.refund_ref}</h4>
                  <p className="text-xs text-slate-500">Reason: {ref.reason}</p>
                </div>
                <Badge
                  label={ref.status}
                  variant={
                    ref.status === 'processed' || ref.status === 'approved'
                      ? 'success'
                      : ref.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900">
                  ₦{Number(ref.amount_naira).toLocaleString()}
                </span>
                {ref.admin_note && (
                  <span className="text-slate-500 italic">Admin: {ref.admin_note}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Request Payment Refund"
      >
        <form onSubmit={handleCreateRefund} className="space-y-4">
          <Input
            label="Payment ID"
            type="number"
            placeholder="e.g. 104"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Refund
            </label>
            <textarea
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Describe why you are requesting a refund for this trip..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setShowRefundModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="md" loading={refundMutation.isPending} className="font-bold">
              Submit Refund
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
