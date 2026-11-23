import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message?: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 p-4 mb-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800 animate-in fade-in"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900 focus:outline-none"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 p-0.5 rounded-md hover:bg-red-100 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
