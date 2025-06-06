
import { Timestamp } from 'firebase/firestore';

export interface Ticket {
  id: string;
  ticket_number: number;
  visitor_id: string;
  plate_number: string;
  car_model: string;
  vehicle_info: string;
  created_at: Timestamp;
  updated_at?: Timestamp;
  status: 'running' | 'requested' | 'assigned' | 'completed' | 'cancelled';
  requested_at: Timestamp | null;
  assigned_at: Timestamp | null;
  assigned_worker: string | null;
  cancelled_at: Timestamp | null;
  completed_at: Timestamp | null;
  eta_minutes: number | null;
  ticket_url: string;
  pre_alert_sent: boolean;
  client_token: string;
  
  // Additional fields that may exist in Firestore - made optional since we removed them from creation
  location?: string;
  description?: string;
  priority?: string;
  voice_message_count?: number;
}

export type TicketStatus = 'running' | 'requested' | 'assigned' | 'completed' | 'cancelled';
