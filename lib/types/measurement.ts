import { Timestamp } from 'firebase/firestore';

export interface MeasurementImage {
  caption: string;
  url: string;
}

export interface Measurement {
  id?: string;
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  description: string;
  images: MeasurementImage[];
  normalValue: string;
  searchTerms: string[];
  title: string;
  references?: string[];
}

export type MeasurementFormData = Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>;

export interface MeasurementImageUpload extends MeasurementImage {
  file?: File;
} 