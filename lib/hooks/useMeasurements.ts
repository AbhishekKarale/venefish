import useSWR from 'swr';
import { useMeasurementService } from './useMeasurementService';
import { Measurement } from '../types/measurement';

export function useMeasurements() {
  const measurementService = useMeasurementService();
  
  const { data, error, isLoading, mutate } = useSWR<Measurement[]>(
    'measurements',
    async () => {
      try {
        return await measurementService.getAll();
      } catch (error) {
        console.error('Failed to fetch measurements:', error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false, // Don't revalidate on window focus
      revalidateIfStale: false, // Don't revalidate if data is stale
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      keepPreviousData: true, // Keep showing previous data while fetching
    }
  );

  return {
    measurements: data || [],
    isLoading,
    isError: error,
    mutate,
  };
} 