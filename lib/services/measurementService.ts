import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  getDoc,
  Firestore
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from 'firebase/storage';
import { Measurement, MeasurementFormData, MeasurementImage, MeasurementImageUpload } from '../types/measurement';

const COLLECTION_NAME = 'measurements';

export class MeasurementService {
  constructor(
    private readonly db: Firestore,
    private readonly storage: FirebaseStorage
  ) {}

  async create(data: MeasurementFormData): Promise<string> {
    const measurementData: Omit<Measurement, 'id'> = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(this.db, COLLECTION_NAME), measurementData);
    return docRef.id;
  }

  async update(id: string, data: Partial<MeasurementFormData>): Promise<void> {
    const docRef = doc(this.db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTION_NAME, id);
    const measurementDoc = await getDoc(docRef);
    const measurement = measurementDoc.data() as Measurement;

    // Delete associated images from storage
    if (measurement.images) {
      await Promise.all(
        measurement.images.map(async (image) => {
          const imageRef = ref(this.storage, image.url);
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        })
      );
    }

    await deleteDoc(docRef);
  }

  async getAll(): Promise<Measurement[]> {
    const q = query(collection(this.db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Measurement[];
  }

  async getById(id: string): Promise<Measurement | null> {
    const docRef = doc(this.db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Measurement;
  }

  async uploadImage(file: File, measurementId: string): Promise<MeasurementImage> {
    const storageRef = ref(this.storage, `measurements/${measurementId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      caption: file.name, // Default caption, can be updated later
    };
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(this.storage, imageUrl);
    await deleteObject(imageRef);
  }
} 