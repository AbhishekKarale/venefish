import { useFirestore, useStorage } from 'reactfire';
import { MeasurementService } from '../services/measurementService';
import { useMemo } from 'react';

export function useMeasurementService() {
  const firestore = useFirestore();
  const storage = useStorage();

  return useMemo(() => new MeasurementService(firestore, storage), [firestore, storage]);
} 