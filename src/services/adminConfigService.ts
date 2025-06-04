
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import { requireAuth } from './authUtils';
import { Driver, ETAConfig } from '../types/AdminConfig';

const ADMIN_CONFIG_COLLECTION = 'admin_config';
const DRIVERS_COLLECTION = 'drivers';
const ETA_CONFIG_DOC = 'eta_settings';

const getFirestore = () => getFirestoreInstance();

// Driver Management
export const addDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driversRef = collection(db, DRIVERS_COLLECTION);
    
    const newDriver = {
      ...driverData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(driversRef, newDriver);
    console.log('Driver added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding driver:', error);
    throw error;
  }
};

export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driversRef = collection(db, DRIVERS_COLLECTION);
    
    const querySnapshot = await getDocs(driversRef);
    const drivers: Driver[] = [];
    
    querySnapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      } as Driver);
    });
    
    console.log('Retrieved drivers:', drivers.length);
    return drivers;
  } catch (error) {
    console.error('Error getting drivers:', error);
    throw error;
  }
};

export const updateDriverAvailability = async (driverId: string, isActive: boolean): Promise<void> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
    
    await updateDoc(driverRef, {
      isActive,
      updatedAt: Timestamp.now()
    });
    
    console.log('Driver availability updated:', driverId, isActive);
  } catch (error) {
    console.error('Error updating driver availability:', error);
    throw error;
  }
};

export const removeDriver = async (driverId: string): Promise<void> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
    
    await deleteDoc(driverRef);
    console.log('Driver removed:', driverId);
  } catch (error) {
    console.error('Error removing driver:', error);
    throw error;
  }
};

// ETA Configuration
export const getETAConfig = async (): Promise<ETAConfig> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
    
    const docSnap = await getDoc(configRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as ETAConfig;
    } else {
      // Return default config if none exists
      const defaultConfig: ETAConfig = {
        defaultDeliveryTimeMinutes: 10,
        preAlertMarginMinutes: 3,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid
      };
      
      // Save default config
      await setDoc(configRef, defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.error('Error getting ETA config:', error);
    throw error;
  }
};

export const updateETAConfig = async (config: Omit<ETAConfig, 'updatedAt' | 'updatedBy'>): Promise<void> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
    
    const updateData: ETAConfig = {
      ...config,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid
    };
    
    await setDoc(configRef, updateData);
    console.log('ETA config updated:', updateData);
  } catch (error) {
    console.error('Error updating ETA config:', error);
    throw error;
  }
};

// Real-time subscription for ETA config changes
export const subscribeToETAConfig = (callback: (config: ETAConfig) => void) => {
  const db = getFirestore();
  const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
  
  return onSnapshot(configRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as ETAConfig);
    }
  });
};

// Real-time subscription for drivers changes
export const subscribeToDrivers = (callback: (drivers: Driver[]) => void) => {
  const db = getFirestore();
  const driversRef = collection(db, DRIVERS_COLLECTION);
  
  return onSnapshot(driversRef, (querySnapshot) => {
    const drivers: Driver[] = [];
    querySnapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      } as Driver);
    });
    callback(drivers);
  });
};
