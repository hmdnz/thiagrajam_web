import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUpdateProfile } from '../../hooks/useAuth';
import { usersApi } from '../../api/users';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { Chattiness, Music, Smoking, Pets, Gender } from '../../types/auth';
import { Upload } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const updateMutation = useUpdateProfile();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [nin, setNin] = useState(user?.nin || '');
  const [aboutMe, setAboutMe] = useState(user?.about_me || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergency_contact || '');
  const [nextOfKinName, setNextOfKinName] = useState(user?.next_of_kin_name || '');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState(
    user?.next_of_kin_relationship || ''
  );
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || '');
  const [gender, setGender] = useState<Gender | ''>(user?.gender || '');
  const [chattiness, setChattiness] = useState<Chattiness | ''>(user?.chattiness || '');
  const [music, setMusic] = useState<Music | ''>(user?.music_preference || '');
  const [smoking, setSmoking] = useState<Smoking | ''>(user?.smoking_preference || '');
  const [pets, setPets] = useState<Pets | ''>(user?.pets_preference || '');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Edit Profile | Wenyfour';
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setUploadingPhoto(true);
    setErrorMessage(null);
    try {
      const updated = await usersApi.uploadProfilePhoto(file);
      updateUser(updated);
      setSuccessMessage('Profile photo updated successfully!');
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await updateMutation.mutateAsync({
        full_name: fullName.trim() || undefined,
        address: address.trim() || undefined,
        nin: nin.trim() || undefined,
        about_me: aboutMe.trim() || undefined,
        emergency_contact: emergencyContact.trim() || undefined,
        next_of_kin_name: nextOfKinName.trim() || undefined,
        next_of_kin_relationship: nextOfKinRelationship.trim() || undefined,
        blood_group: (bloodGroup.trim() as any) || undefined,
        gender: (gender as Gender) || undefined,
        chattiness: (chattiness as Chattiness) || undefined,
        music: (music as Music) || undefined,
        smoking: (smoking as Smoking) || undefined,
        pets: (pets as Pets) || undefined,
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile & Preferences</h1>
          <p className="text-sm text-slate-500">Update your public details and co-riding habits</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* Profile Photo Upload Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.full_name || 'User'}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-500"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-2xl">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
          )}

          <div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm">
                <Upload className="h-4 w-4" />
                {uploadingPhoto ? 'Uploading...' : 'Upload New Photo'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
            <p className="mt-1.5 text-xs text-slate-500">PNG, JPG, or WEBP up to 5MB.</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
            />

            <Input
              label="National Identification Number (NIN)"
              type="text"
              value={nin}
              onChange={(e) => setNin(e.target.value)}
              placeholder="11-digit NIN"
              maxLength={11}
            />
          </div>

          <Input
            label="Residential / Office Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 15 Marina St, Lagos Island"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">About Me (Bio)</label>
            <textarea
              rows={3}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Tell fellow passengers or drivers a little about yourself..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </Card>

        {/* Safety & Medical */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Safety & Emergency Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Emergency Contact Phone"
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="e.g. 08098765432"
            />

            <Input
              label="Blood Group"
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="e.g. O+, A+, B-"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Next of Kin Name"
              type="text"
              value={nextOfKinName}
              onChange={(e) => setNextOfKinName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />

            <Input
              label="Next of Kin Relationship"
              type="text"
              value={nextOfKinRelationship}
              onChange={(e) => setNextOfKinRelationship(e.target.value)}
              placeholder="e.g. Spouse / Sibling"
            />
          </div>
        </Card>

        {/* Co-riding Preferences */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Ride Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Chattiness"
              type="text"
              value={chattiness}
              onChange={(e) => setChattiness(e.target.value as any)}
              placeholder="e.g. Talkative depending on mood / Quiet rides"
            />

            <Input
              label="Music Preference"
              type="text"
              value={music}
              onChange={(e) => setMusic(e.target.value as any)}
              placeholder="e.g. Afrobeats & Pop / Podcasts / Silence"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Smoking Policy"
              type="text"
              value={smoking}
              onChange={(e) => setSmoking(e.target.value as any)}
              placeholder="e.g. No smoking allowed"
            />

            <Input
              label="Pet Policy"
              type="text"
              value={pets}
              onChange={(e) => setPets(e.target.value as any)}
              placeholder="e.g. Pets in carrier / No pets"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" size="lg" loading={updateMutation.isPending} className="font-bold">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
