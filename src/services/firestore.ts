
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import { Ticket, TicketStatus } from '../types/Ticket';

const TICKETS_COLLECTION = 'tickets';

// Get Firestore instance
const getFirestore = () => getFirestoreInstance();

// Create a new ticket
export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at'>): Promise<string> => {
  try {
    const db = getFirestore();
    const ticketsRef = collection(db, TICKETS_COLLECTION);
    
    const newTicket = {
      ...ticketData,
      created_at: Timestamp.now(),
    };
    
    const docRef = await addDoc(ticketsRef, newTicket);
    console.log('Ticket created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Get all tickets
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const db = getFirestore();
    const ticketsRef = collection(db, TICKETS_COLLECTION);
    const q = query(ticketsRef, orderBy('created_at', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const tickets: Ticket[] = [];
    
    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      } as Ticket);
    });
    
    console.log('Retrieved tickets:', tickets.length);
    return tickets;
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const db = getFirestore();
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    const docSnap = await getDoc(ticketRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Ticket;
    } else {
      console.log('No ticket found with ID:', ticketId);
      return null;
    }
  } catch (error) {
    console.error('Error getting ticket by ID:', error);
    throw error;
  }
};

// Get tickets by status
export const getTicketsByStatus = async (status: TicketStatus): Promise<Ticket[]> => {
  try {
    const db = getFirestore();
    const ticketsRef = collection(db, TICKETS_COLLECTION);
    const q = query(
      ticketsRef, 
      where('status', '==', status),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const tickets: Ticket[] = [];
    
    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      } as Ticket);
    });
    
    console.log(`Retrieved ${tickets.length} tickets with status: ${status}`);
    return tickets;
  } catch (error) {
    console.error('Error getting tickets by status:', error);
    throw error;
  }
};

// Get tickets by visitor ID
export const getTicketsByVisitorId = async (visitorId: string): Promise<Ticket[]> => {
  try {
    const db = getFirestore();
    const ticketsRef = collection(db, TICKETS_COLLECTION);
    const q = query(
      ticketsRef, 
      where('visitor_id', '==', visitorId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const tickets: Ticket[] = [];
    
    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      } as Ticket);
    });
    
    console.log(`Retrieved ${tickets.length} tickets for visitor: ${visitorId}`);
    return tickets;
  } catch (error) {
    console.error('Error getting tickets by visitor ID:', error);
    throw error;
  }
};

// Update ticket
export const updateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<void> => {
  try {
    const db = getFirestore();
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    
    // Remove id from updates if present
    const { id, ...updateData } = updates;
    
    await updateDoc(ticketRef, updateData);
    console.log('Ticket updated:', ticketId);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Update ticket status
export const updateTicketStatus = async (
  ticketId: string, 
  status: TicketStatus, 
  additionalData?: Partial<Ticket>
): Promise<void> => {
  try {
    const db = getFirestore();
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    
    const updateData: Partial<Ticket> = {
      status,
      ...additionalData
    };
    
    // Set timestamp based on status
    switch (status) {
      case 'requested':
        updateData.requested_at = Timestamp.now();
        break;
      case 'assigned':
        updateData.assigned_at = Timestamp.now();
        break;
      case 'completed':
        updateData.completed_at = Timestamp.now();
        break;
      case 'cancelled':
        updateData.cancelled_at = Timestamp.now();
        break;
    }
    
    await updateDoc(ticketRef, updateData);
    console.log('Ticket status updated:', ticketId, status);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

// Delete ticket
export const deleteTicket = async (ticketId: string): Promise<void> => {
  try {
    const db = getFirestore();
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    
    await deleteDoc(ticketRef);
    console.log('Ticket deleted:', ticketId);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

// Get latest ticket number for generating new ones
export const getLatestTicketNumber = async (): Promise<number> => {
  try {
    const db = getFirestore();
    const ticketsRef = collection(db, TICKETS_COLLECTION);
    const q = query(ticketsRef, orderBy('ticket_number', 'desc'), limit(1));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return 0;
    }
    
    const latestTicket = querySnapshot.docs[0].data() as Ticket;
    return latestTicket.ticket_number;
  } catch (error) {
    console.error('Error getting latest ticket number:', error);
    throw error;
  }
};
