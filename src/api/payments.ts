import { apiClient } from './client';
import {
  PaymentInitializeInput,
  PaymentInitializeOut,
  PaymentVerifyInput,
  PaymentOut,
  WalletOut,
  TransactionOut,
  RefundCreateInput,
  RefundOut,
  PayoutCreateInput,
  PayoutOut,
  StatementGenerateInput,
  StatementOut,
} from '../types/payments';

export const paymentsApi = {
  // POST /payments/initialize
  initializePayment: async (input: PaymentInitializeInput): Promise<PaymentInitializeOut> => {
    const response = await apiClient.post<PaymentInitializeOut>('/payments/initialize', input);
    return response.data;
  },

  // POST /payments/verify
  verifyPayment: async (input: PaymentVerifyInput): Promise<PaymentOut> => {
    const response = await apiClient.post<PaymentOut>('/payments/verify', input);
    return response.data;
  },

  // GET /payments/my-payments
  getMyPayments: async (statusFilter?: string): Promise<PaymentOut[]> => {
    const response = await apiClient.get<PaymentOut[]>('/payments/my-payments', {
      params: statusFilter ? { status_filter: statusFilter } : undefined,
    });
    return response.data;
  },

  // GET /payments/wallet/me
  getMyWallet: async (): Promise<WalletOut> => {
    const response = await apiClient.get<WalletOut>('/payments/wallet/me');
    return response.data;
  },

  // GET /payments/transactions/me
  getMyTransactions: async (params?: {
    date_from?: string;
    date_to?: string;
    transaction_type?: string;
  }): Promise<TransactionOut[]> => {
    const response = await apiClient.get<TransactionOut[]>('/payments/transactions/me', {
      params,
    });
    return response.data;
  },

  // POST /payments/statements/generate
  generateStatement: async (input: StatementGenerateInput): Promise<StatementOut> => {
    const response = await apiClient.post<StatementOut>('/payments/statements/generate', input);
    return response.data;
  },

  // GET /payments/statements/me
  getMyStatements: async (): Promise<StatementOut[]> => {
    const response = await apiClient.get<StatementOut[]>('/payments/statements/me');
    return response.data;
  },

  // POST /payments/refunds
  requestRefund: async (input: RefundCreateInput): Promise<RefundOut> => {
    const response = await apiClient.post<RefundOut>('/payments/refunds', input);
    return response.data;
  },

  // GET /payments/refunds/me
  getMyRefunds: async (): Promise<RefundOut[]> => {
    const response = await apiClient.get<RefundOut[]>('/payments/refunds/me');
    return response.data;
  },

  // POST /payments/payouts
  requestPayout: async (input: PayoutCreateInput): Promise<PayoutOut> => {
    const response = await apiClient.post<PayoutOut>('/payments/payouts', input);
    return response.data;
  },

  // GET /payments/payouts/me
  getMyPayouts: async (): Promise<PayoutOut[]> => {
    const response = await apiClient.get<PayoutOut[]>('/payments/payouts/me');
    return response.data;
  },

  // GET /payments/{payment_id}
  getPaymentById: async (paymentId: number): Promise<PaymentOut> => {
    const response = await apiClient.get<PaymentOut>(`/payments/${paymentId}`);
    return response.data;
  },
};
