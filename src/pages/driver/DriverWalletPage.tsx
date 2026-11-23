import React, { useState } from 'react';
import { useWalletBalance, useWalletTransactions, useRequestPayout, useGenerateStatement, useMyStatements } from '../../hooks/usePayments';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Loader } from '../../components/Loader';
import { Modal } from '../../components/Modal';
import { ErrorBanner } from '../../components/ErrorBanner';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, FileText, Download, 
  Building2, CheckCircle2, DollarSign, Calendar 
} from 'lucide-react';

export const DriverWalletPage: React.FC = () => {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useWalletTransactions();
  const { data: statements, isLoading: statementsLoading } = useMyStatements();

  const payoutMutation = useRequestPayout();
  const statementMutation = useGenerateStatement();

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);

  // Payout form state
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Statement form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await payoutMutation.mutateAsync({
        amount: Number(payoutAmount),
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
      });
      setPayoutModalOpen(false);
      setPayoutAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
    } catch {
      // Handled by error banner
    }
  };

  const handleGenerateStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await statementMutation.mutateAsync({
        start_date: startDate,
        end_date: endDate,
      });
      setStatementModalOpen(false);
      setStartDate('');
      setEndDate('');
    } catch {
      // Handled by error banner
    }
  };

  if (balanceLoading || txLoading) return <Loader fullScreen message="Loading wallet information..." />;

  const availableBalance = balance?.balance || 0;
  const pendingBalance = balance?.pending_balance || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Earnings & Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track ride revenues, withdraw earnings to your bank, and export financial statements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setStatementModalOpen(true)}>
            <FileText className="w-4 h-4 mr-2" /> Statement
          </Button>
          <Button variant="primary" onClick={() => setPayoutModalOpen(true)}>
            <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Available Balance</span>
            <Wallet className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">
              ₦{availableBalance.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-200">
            Available for immediate bank withdrawal
          </p>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Release</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              ₦{pendingBalance.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Escrow held until passengers complete active rides
          </p>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Currency & Status</span>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-gray-900">
              {balance?.currency || 'NGN (₦)'}
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payout account connected
          </p>
        </Card>
      </div>

      {/* Transaction History & Statements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Transaction History">
            {!transactions || transactions.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No transactions recorded yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{tx.description || tx.type}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
                      </span>
                      <span className="block text-xs text-gray-400 capitalize">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Exported Statements">
            {statementsLoading ? (
              <Loader message="Loading statements..." />
            ) : !statements || statements.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No account statements generated yet.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setStatementModalOpen(true)}>
                  Generate One
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {statements.map((stmt) => (
                  <div key={stmt.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {stmt.start_date} to {stmt.end_date}
                      </p>
                      <p className="text-[10px] text-gray-400">Status: {stmt.status}</p>
                    </div>
                    {stmt.file_url && (
                      <a
                        href={stmt.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Download Statement"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Payout Modal */}
      <Modal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Request Bank Withdrawal"
      >
        <form onSubmit={handleRequestPayout} className="space-y-4">
          {payoutMutation.error && (
            <ErrorBanner
              message={(payoutMutation.error as any)?.response?.data?.detail || 'Payout request failed.'}
            />
          )}

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
            Available for withdrawal: <span className="font-bold">₦{availableBalance.toLocaleString()}</span>
          </div>

          <Input
            label="Withdrawal Amount (₦)"
            type="number"
            min={100}
            max={availableBalance}
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            placeholder="e.g. 50000"
            required
          />

          <Input
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. Access Bank, Zenith Bank"
            required
          />

          <Input
            label="Account Number (10 digits)"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="0123456789"
            maxLength={10}
            required
          />

          <Input
            label="Account Holder Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="As registered with your bank"
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={payoutMutation.isPending}
              disabled={Number(payoutAmount) <= 0 || Number(payoutAmount) > availableBalance}
            >
              Submit Payout Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Generate Statement Modal */}
      <Modal
        isOpen={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
        title="Generate Financial Statement"
      >
        <form onSubmit={handleGenerateStatement} className="space-y-4">
          {statementMutation.error && (
            <ErrorBanner
              message={(statementMutation.error as any)?.response?.data?.detail || 'Failed to generate statement.'}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setStatementModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={statementMutation.isPending}
            >
              <Calendar className="w-4 h-4 mr-2" /> Generate Statement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
