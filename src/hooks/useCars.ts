import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carsApi } from '../api/cars';
import { CarCreateInput, CarUpdateInput } from '../types/cars';

export const useMyCars = () => {
  return useQuery({
    queryKey: ['cars', 'my-cars'],
    queryFn: () => carsApi.getMyCars(),
  });
};

export const useAddCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CarCreateInput) => carsApi.addCar(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'my-cars'] });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, input }: { carId: number; input: CarUpdateInput }) =>
      carsApi.updateCar(carId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'my-cars'] });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: number) => carsApi.deleteCar(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'my-cars'] });
    },
  });
};

export const useUploadCarPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, file }: { carId: number; file: File }) =>
      carsApi.uploadCarPhoto(carId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'my-cars'] });
    },
  });
};
