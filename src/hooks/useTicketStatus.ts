
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { Ticket } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTicketStatus = (ticketId: string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const firestore = getFirestoreInstance();
    const ticketRef = doc(firestore, 'tickets', ticketId);
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      ticketRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const ticketData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as Ticket;
          
          setTicket(ticketData);
          
          // If we already had a ticket and status changed, show notification
          if (ticket && ticket.status !== ticketData.status) {
            toast({
              title: "Ticket Status Updated",
              description: `Status changed to: ${ticketData.status}`
            });
          }
        } else {
          setTicket(null);
        }
        
        setIsLoading(false);
      },
      (err) => {
        console.error('Error getting ticket updates:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ticketId]);

  return {
    ticket,
    isLoading,
    error
  };
};
