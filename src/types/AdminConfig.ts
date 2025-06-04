
import { Timestamp } from 'firebase/firestore';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ETAConfig {
  defaultDeliveryTimeMinutes: number;
  preAlertMarginMinutes: number;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface AdminConfig {
  etaConfig: ETAConfig;
  drivers: Driver[];
}
