
import { useState, useEffect } from 'react';
import { getTickets } from '../services/firestore';
import { getVoiceMessageCount } from '../services/realtime';
import { Ticket } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTicketData = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTickets = async () => {
    try {
      const ticketData = await getTickets();
      setTickets(ticketData);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessageCounts = async () => {
    const counts: Record<string, number> = {};
    for (const ticket of tickets) {
      try {
        const count = await getVoiceMessageCount(ticket.id);
        counts[ticket.id] = count;
      } catch (error) {
        console.error(`Error loading message count for ticket ${ticket.id}:`, error);
        counts[ticket.id] = 0;
      }
    }
    setMessageCounts(counts);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      loadMessageCounts();
    }
  }, [tickets]);

  return {
    tickets,
    messageCounts,
    isLoading,
    reloadTickets: loadTickets
  };
};
