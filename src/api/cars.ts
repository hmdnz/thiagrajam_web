import { apiClient } from './client';
import { CarOut, CarCreateInput, CarUpdateInput } from '../types/cars';

export const carsApi = {
  // GET /cars/my-cars
  getMyCars: async (): Promise<CarOut[]> => {
    const response = await apiClient.get<CarOut[]>('/cars/my-cars');
    return response.data;
  },

  // POST /cars/ (Multipart Form Data)
  addCar: async (input: CarCreateInput): Promise<CarOut> => {
    const formData = new FormData();
    formData.append('make', input.make);
    formData.append('model', input.model);
    formData.append('year', String(input.year));
    formData.append('color', input.color);
    if (input.plate_number) formData.append('plate_number', input.plate_number);
    formData.append('is_tinted', String(Boolean(input.is_tinted)));
    formData.append('has_wifi', String(Boolean(input.has_wifi)));
    formData.append('has_air_conditioning', String(Boolean(input.has_air_conditioning)));
    formData.append('has_power_outlets', String(Boolean(input.has_power_outlets)));
    formData.append('smoking_allowed', String(Boolean(input.smoking_allowed)));
    formData.append('pets_allowed', String(Boolean(input.pets_allowed)));
    formData.append('wheelchair_accessible', String(Boolean(input.wheelchair_accessible)));
    formData.append('is_primary', 'true');

    if (input.file) {
      formData.append('file', input.file);
    }

    const response = await apiClient.post<CarOut>('/cars/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PATCH /cars/{car_id}
  updateCar: async (carId: number, input: CarUpdateInput): Promise<CarOut> => {
    const response = await apiClient.patch<CarOut>(`/cars/${carId}`, input);
    return response.data;
  },

  // DELETE /cars/{car_id}
  deleteCar: async (carId: number): Promise<void> => {
    await apiClient.delete(`/cars/${carId}`);
  },

  // POST /cars/{car_id}/photos
  uploadCarPhoto: async (carId: number, file: File): Promise<CarOut> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<CarOut>(`/cars/${carId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
