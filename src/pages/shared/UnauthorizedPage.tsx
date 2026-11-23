import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/Button';

export const UnauthorizedPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Access Denied | Wenyfour';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="h-16 w-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        You don’t have permission to access this area. If you are trying to access the Driver dashboard,
        make sure your Driver profile and verification are active.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/rides">
          <Button size="md">Go to Passenger Area</Button>
        </Link>
        <Link to="/verification">
          <Button variant="outline" size="md">
            Complete Verification
          </Button>
        </Link>
      </div>
    </div>
  );
};
