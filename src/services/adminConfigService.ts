
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

// Helper function to handle permission errors gracefully
const handlePermissionError = (error: any, operation: string) => {
  if (error.code === 'permission-denied') {
    console.warn(`Permission denied for ${operation}. Using fallback data.`);
    return null;
  }
  throw error;
};

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
  } catch (error: any) {
    console.error('Error adding driver:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to add drivers. Please contact your administrator.');
    }
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
  } catch (error: any) {
    console.error('Error getting drivers:', error);
    const fallback = handlePermissionError(error, 'getting drivers');
    if (fallback === null) {
      // Return empty array as fallback for permission errors
      return [];
    }
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
  } catch (error: any) {
    console.error('Error updating driver availability:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to update driver availability. Please contact your administrator.');
    }
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
  } catch (error: any) {
    console.error('Error removing driver:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to remove drivers. Please contact your administrator.');
    }
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
      
      // Try to save default config, but don't fail if permission denied
      try {
        await setDoc(configRef, defaultConfig);
      } catch (saveError: any) {
        if (saveError.code === 'permission-denied') {
          console.warn('Cannot save default ETA config due to permissions. Using local default.');
        } else {
          throw saveError;
        }
      }
      
      return defaultConfig;
    }
  } catch (error: any) {
    console.error('Error getting ETA config:', error);
    const fallback = handlePermissionError(error, 'getting ETA config');
    if (fallback === null) {
      // Return default config as fallback for permission errors
      const user = requireAuth();
      return {
        defaultDeliveryTimeMinutes: 10,
        preAlertMarginMinutes: 3,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid
      };
    }
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
  } catch (error: any) {
    console.error('Error updating ETA config:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to update ETA configuration. Please contact your administrator.');
    }
    throw error;
  }
};

// Real-time subscription for ETA config changes
export const subscribeToETAConfig = (callback: (config: ETAConfig) => void) => {
  try {
    const db = getFirestore();
    const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
    
    return onSnapshot(
      configRef, 
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as ETAConfig);
        }
      },
      (error: any) => {
        console.warn('ETA config subscription error:', error);
        if (error.code === 'permission-denied') {
          console.warn('Permission denied for ETA config subscription. Falling back to default.');
          // Provide fallback data
          callback({
            defaultDeliveryTimeMinutes: 10,
            preAlertMarginMinutes: 3,
            updatedAt: Timestamp.now(),
            updatedBy: 'system'
          });
        }
      }
    );
  } catch (error) {
    console.error('Error setting up ETA config subscription:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};

// Real-time subscription for drivers changes
export const subscribeToDrivers = (callback: (drivers: Driver[]) => void) => {
  try {
    const db = getFirestore();
    const driversRef = collection(db, DRIVERS_COLLECTION);
    
    return onSnapshot(
      driversRef, 
      (querySnapshot) => {
        const drivers: Driver[] = [];
        querySnapshot.forEach((doc) => {
          drivers.push({
            id: doc.id,
            ...doc.data()
          } as Driver);
        });
        callback(drivers);
      },
      (error: any) => {
        console.warn('Drivers subscription error:', error);
        if (error.code === 'permission-denied') {
          console.warn('Permission denied for drivers subscription. Falling back to empty list.');
          // Provide fallback data
          callback([]);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up drivers subscription:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};
