import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usersApi } from '../../api/users';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { ShieldCheck, FileCheck, Upload, AlertCircle } from 'lucide-react';

export const DriverVerificationPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  const [nin, setNin] = useState(user?.nin || '');
  const [licenseNumber, setLicenseNumber] = useState(user?.driver_profile?.license_number || '');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(
    user?.driver_profile?.license_expiry_date || ''
  );
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const [loadingNin, setLoadingNin] = useState(false);
  const [loadingLicense, setLoadingLicense] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'ID & License Verification | Wenyfour';
  }, []);

  const handleSaveNin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nin.trim() || nin.trim().length !== 11) {
      setErrorMessage('Please provide a valid 11-digit NIN.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingNin(true);
    try {
      const updated = await usersApi.updateMyProfile({ nin: nin.trim() });
      updateUser(updated);
      setSuccessMessage('NIN submitted successfully for verification!');
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoadingNin(false);
    }
  };

  const handleUploadLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseFile) {
      setErrorMessage('Please select a photo of your Driver’s License.');
      return;
    }
    if (!licenseNumber.trim()) {
      setErrorMessage('Please input your license number.');
      return;
    }
    if (!licenseExpiryDate.trim()) {
      setErrorMessage('Please input your license expiry date.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingLicense(true);
    try {
      const updated = await usersApi.uploadDriverLicense(
        licenseFile,
        licenseNumber.trim(),
        licenseExpiryDate.trim()
      );
      updateUser(updated);
      setSuccessMessage("Driver's License submitted for review!");
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoadingLicense(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Identity & Safety Verification</h1>
        <p className="text-sm text-slate-500">
          Required to publish rides and join verified community trips
        </p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* NIN Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">National Identification Number (NIN)</h2>
              <p className="text-xs text-slate-500">Required for both passengers and drivers</p>
            </div>
          </div>
          <Badge
            label={user?.nin_verified ? 'Verified' : user?.nin_verification_status || 'Unverified'}
            variant={user?.nin_verified ? 'success' : 'warning'}
          />
        </div>

        <form onSubmit={handleSaveNin} className="mt-4 space-y-4">
          <Input
            label="11-Digit National ID Number"
            type="text"
            placeholder="e.g. 12345678901"
            value={nin}
            onChange={(e) => setNin(e.target.value)}
            maxLength={11}
            disabled={user?.nin_verified}
          />

          {!user?.nin_verified && (
            <Button type="submit" size="md" loading={loadingNin} className="font-semibold">
              Save & Submit NIN
            </Button>
          )}
        </form>
      </Card>

      {/* Driver License Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Driver's License</h2>
              <p className="text-xs text-slate-500">Required before publishing and offering rides</p>
            </div>
          </div>
          <Badge
            label={
              user?.driver_profile?.license_verification_status ||
              (user?.can_offer_rides ? 'Verified' : 'Pending Upload')
            }
            variant={user?.can_offer_rides ? 'success' : 'warning'}
          />
        </div>

        <form onSubmit={handleUploadLicense} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="License Number"
              type="text"
              placeholder="e.g. ABC123456789"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              required
            />

            <Input
              label="Expiry Date"
              type="date"
              value={licenseExpiryDate}
              onChange={(e) => setLicenseExpiryDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload License Photo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-brand-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-10 w-10 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label className="relative cursor-pointer rounded-md font-semibold text-brand-600 hover:text-brand-500">
                    <span>{licenseFile ? licenseFile.name : 'Choose a file'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, or WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          <Button type="submit" size="md" loading={loadingLicense} className="font-semibold">
            Upload & Submit License
          </Button>
        </form>
      </Card>
    </div>
  );
};
