export interface CarPhotoOut {
  id: number;
  photo_url: string;
  created_at: string;
}

export interface CarOut {
  id: number;
  driver_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plate_number?: string | null;
  capacity: number;
  is_tinted: boolean;
  has_wifi: boolean;
  has_air_conditioning: boolean;
  has_power_outlets: boolean;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  wheelchair_accessible: boolean;
  created_at: string;
  photos: CarPhotoOut[];
}

export interface CarCreateInput {
  make: string;
  model: string;
  year: number;
  color: string;
  plate_number?: string;
  is_tinted?: boolean;
  has_wifi?: boolean;
  has_air_conditioning?: boolean;
  has_power_outlets?: boolean;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  wheelchair_accessible?: boolean;
  file?: File;
}

export interface CarUpdateInput {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  plate_number?: string;
  capacity?: number;
  is_tinted?: boolean;
  has_wifi?: boolean;
  has_air_conditioning?: boolean;
  has_power_outlets?: boolean;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  wheelchair_accessible?: boolean;
}
