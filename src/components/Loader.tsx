import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message, fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-3" />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">{content}</div>;
  }

  return content;
};
