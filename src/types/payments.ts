export type PaymentProvider = 'squad' | 'paystack';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'reversed' | 'abandoned';
export type PaymentPurpose = 'booking_fare' | 'wallet_topup' | 'cancellation_fee';
export type TransactionType = 'credit' | 'debit';
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
export type PayoutStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
export type StatementStatus = 'generated' | 'failed';

export interface PaymentInitializeInput {
  booking_id: number;
  provider?: PaymentProvider;
  email: string;
  callback_url?: string;
}

export interface PaymentInitializeOut {
  payment_id: number;
  transaction_ref: string;
  amount_kobo: number;
  amount_naira: number | string;
  currency: string;
  provider: PaymentProvider;
  auth_url?: string | null;
  status: PaymentStatus;
}

export interface PaymentVerifyInput {
  transaction_ref: string;
}

export interface PaymentOut {
  id: number;
  user_id: string;
  booking_id?: number | null;
  purpose: PaymentPurpose;
  provider: PaymentProvider;
  transaction_ref: string;
  provider_ref?: string | null;
  amount_kobo: number;
  amount_naira: number | string;
  merchant_amount_kobo?: number | null;
  currency: string;
  status: PaymentStatus;
  raw_status?: string | null;
  failure_reason?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RefundCreateInput {
  payment_id: number;
  reason: string;
  is_partial?: boolean;
  amount_kobo?: number | null;
}

export interface RefundOut {
  id: number;
  payment_id: number;
  booking_id?: number | null;
  refund_ref: string;
  provider_refund_ref?: string | null;
  is_partial: boolean;
  amount_kobo: number;
  amount_naira: number | string;
  currency: string;
  reason: string;
  status: RefundStatus;
  raw_status?: string | null;
  admin_note?: string | null;
  processed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayoutCreateInput {
  amount_kobo: number;
  provider?: PaymentProvider;
  bank_code: string;
  account_number: string;
  account_name: string;
}

export interface PayoutOut {
  id: number;
  driver_id: string;
  payout_ref: string;
  provider_ref?: string | null;
  gross_amount_kobo: number;
  commission_kobo: number;
  tax_kobo: number;
  net_amount_kobo: number;
  currency: string;
  bank_code: string;
  bank_name?: string | null;
  account_number: string;
  account_name: string;
  status: string;
  failure_reason?: string | null;
  admin_note?: string | null;
  processed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionOut {
  id: number;
  user_id: string;
  payment_id?: number | null;
  booking_id?: number | null;
  payout_id?: number | null;
  refund_id?: number | null;
  transaction_type: TransactionType;
  direction: 'inflow' | 'outflow';
  amount_kobo: number;
  amount_naira: number | string;
  currency: string;
  description?: string | null;
  provider_ref?: string | null;
  transaction_date: string;
  created_at: string;
}

export interface WalletOut {
  id: number;
  user_id: string;
  available_balance_kobo: number;
  pending_balance_kobo: number;
  lifetime_credits_kobo: number;
  lifetime_debits_kobo: number;
  lifetime_commission_kobo: number;
  lifetime_tax_kobo: number;
  available_balance_naira: number | string;
  pending_balance_naira: number | string;
  lifetime_credits_naira: number | string;
  lifetime_debits_naira: number | string;
  lifetime_commission_naira: number | string;
  lifetime_tax_naira: number | string;
  currency: string;
  updated_at: string;
}

export interface StatementGenerateInput {
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
}

export interface StatementOut {
  id: number;
  user_id: string;
  period_start: string;
  period_end: string;
  opening_balance_kobo: number;
  closing_balance_kobo: number;
  total_credits_kobo: number;
  total_debits_kobo: number;
  total_commission_kobo: number;
  total_tax_kobo: number;
  opening_balance_naira: number | string;
  closing_balance_naira: number | string;
  total_credits_naira: number | string;
  total_debits_naira: number | string;
  total_commission_naira: number | string;
  total_tax_naira: number | string;
  currency: string;
  status: StatementStatus;
  generated_at: string;
  transactions: TransactionOut[];
}
