export type UserRole = 'passenger' | 'driver' | 'admin' | 'superadmin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired';
export type Gender = 'male' | 'female' | 'other';
export type Chattiness = "I'm a chatterbox" | 'Talkative depending on mood' | 'I prefer quiet rides' | 'Strictly quiet';
export type Music = 'All kinds of music' | 'Afrobeats & Pop' | 'Christian / Gospel' | 'Podcasts / News' | 'Silence';
export type Smoking = 'No smoking allowed' | 'Smoking allowed' | 'Vaping allowed';
export type Pets = 'Pets allowed' | 'Pets allowed in carrier' | 'No pets allowed';

export interface UserBase {
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  gender?: Gender | null;
  date_of_birth?: string | null;
  address?: string | null;
  blood_group?: string | null;
  health_conditions?: string | null;
  emergency_contact?: string | null;
  next_of_kin_name?: string | null;
  next_of_kin_relationship?: string | null;
  nin?: string | null;
}

export interface UserOut extends UserBase {
  id: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  is_suspended: boolean;
  is_driver: boolean;
  can_offer_rides: boolean;
  nin_verified: boolean;
  nin_verification_status: VerificationStatus;
  photo_url?: string | null;
  profile_complete: boolean;
  access_token?: string | null;
  token_type?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverPreferencesResponse {
  id: string;
  user_id: string;
  car_make?: string | null;
  car_model?: string | null;
  car_year?: number | null;
  car_color?: string | null;
  plate_number?: string | null;
  about_me?: string | null;
  chattiness?: Chattiness | null;
  music?: Music | null;
  smoking?: Smoking | null;
  pets?: Pets | null;
  license_number?: string | null;
  license_expiry_date?: string | null;
  license_photo_url?: string | null;
  license_verification_status: VerificationStatus;
  license_verification_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileOut extends UserOut {
  about_me?: string | null;
  chattiness?: Chattiness | null;
  music_preference?: Music | null;
  smoking_preference?: Smoking | null;
  pets_preference?: Pets | null;
  driver_profile?: DriverPreferencesResponse | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  active_role: UserRole;
  roles: Array<{
    role: string;
    profile_complete: boolean;
    nin_verified: boolean;
  }>;
}

export interface UserRegisterInput {
  email?: string;
  phone_number?: string;
  password: string;
  role?: string;
}

export interface UserRegisterResponse {
  id: string;
  email?: string | null;
  phone_number?: string | null;
  role: string;
  access_token: string;
  token_type: string;
}

export interface VerifyOtpInput {
  phone_number: string;
  otp: string;
}

export interface ResendOtpInput {
  phone_number: string;
}

export interface ForgotPasswordInput {
  email?: string;
  phone_number?: string;
}

export interface ResetPasswordInput {
  token: string;
  new_password: string;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

export interface ProfileUpdateInput extends Partial<UserBase> {
  about_me?: string | null;
  photo_url?: string | null;
  chattiness?: Chattiness | null;
  music?: Music | null;
  smoking?: Smoking | null;
  pets?: Pets | null;
}
