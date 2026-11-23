import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | Wenyfour';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <span className="text-6xl font-black text-brand-600">404</span>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or removed.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button size="md">Back to Home</Button>
        </Link>
        <Link to="/rides">
          <Button variant="outline" size="md">
            Find Rides
          </Button>
        </Link>
      </div>
    </div>
  );
};
