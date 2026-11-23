import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments';
import {
  PaymentInitializeInput,
  PaymentVerifyInput,
  RefundCreateInput,
  PayoutCreateInput,
  StatementGenerateInput,
} from '../types/payments';

export const useMyWallet = () => {
  return useQuery({
    queryKey: ['payments', 'wallet'],
    queryFn: () => paymentsApi.getMyWallet(),
  });
};

export const useMyPayments = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['payments', 'my-payments', statusFilter],
    queryFn: () => paymentsApi.getMyPayments(statusFilter),
  });
};

export const useMyTransactions = (params?: {
  date_from?: string;
  date_to?: string;
  transaction_type?: string;
}) => {
  return useQuery({
    queryKey: ['payments', 'transactions', params],
    queryFn: () => paymentsApi.getMyTransactions(params),
  });
};

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: (input: PaymentInitializeInput) => paymentsApi.initializePayment(input),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PaymentVerifyInput) => paymentsApi.verifyPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RefundCreateInput) => paymentsApi.requestRefund(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'refunds'] });
    },
  });
};

export const useMyRefunds = () => {
  return useQuery({
    queryKey: ['payments', 'refunds'],
    queryFn: () => paymentsApi.getMyRefunds(),
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PayoutCreateInput) => paymentsApi.requestPayout(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'payouts'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'wallet'] });
    },
  });
};

export const useMyPayouts = () => {
  return useQuery({
    queryKey: ['payments', 'payouts'],
    queryFn: () => paymentsApi.getMyPayouts(),
  });
};

export const useGenerateStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StatementGenerateInput) => paymentsApi.generateStatement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'statements'] });
    },
  });
};

export const useMyStatements = () => {
  return useQuery({
    queryKey: ['payments', 'statements'],
    queryFn: () => paymentsApi.getMyStatements(),
  });
};
