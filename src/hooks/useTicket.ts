
import { useState, useEffect } from 'react';
import { getTickets } from '../services/firestore';
import { Ticket } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTicket = (ticketId: string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadTicket = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tickets = await getTickets();
      const foundTicket = tickets.find(t => t.id === ticketId);
      setTicket(foundTicket || null);
      
      if (!foundTicket) {
        const notFoundError = new Error('Ticket not found');
        setError(notFoundError);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load ticket');
      setError(error);
      console.error('Error loading ticket:', error);
      toast({
        title: "Error",
        description: "Failed to load ticket",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  return {
    ticket,
    isLoading,
    error,
    reloadTicket: loadTicket
  };
};
