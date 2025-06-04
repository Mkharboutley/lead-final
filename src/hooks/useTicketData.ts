
import { useState, useEffect } from 'react';
import { getTickets } from '../services/firestore';
import { subscribeToVoiceMessages } from '../services/realtime';
import { Ticket } from '../types/Ticket';
import { VoiceMessage } from '../types/VoiceMessage';
import { useToast } from '@/hooks/use-toast';

export const useTicketData = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [latestAudioUrls, setLatestAudioUrls] = useState<Record<string, string>>({});
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

  // Subscribe to voice messages for all tickets
  useEffect(() => {
    if (tickets.length === 0) return;

    const unsubscribeFunctions: (() => void)[] = [];

    tickets.forEach((ticket) => {
      const unsubscribe = subscribeToVoiceMessages(ticket.id, (messages: VoiceMessage[]) => {
        // Update message counts
        setMessageCounts(prev => ({
          ...prev,
          [ticket.id]: messages.length
        }));

        // Calculate unread messages (for demo, we'll consider recent messages as unread)
        const recentMessages = messages.filter(msg => 
          Date.now() - msg.timestamp < 5 * 60 * 1000 // Last 5 minutes
        );
        setUnreadCounts(prev => ({
          ...prev,
          [ticket.id]: recentMessages.length
        }));

        // Get latest audio URL if available
        if (messages.length > 0) {
          setLatestAudioUrls(prev => ({
            ...prev,
            [ticket.id]: messages[0].storage_path
          }));
        }
      });

      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [tickets]);

  useEffect(() => {
    loadTickets();
  }, []);

  return {
    tickets,
    messageCounts,
    unreadCounts,
    latestAudioUrls,
    isLoading,
    reloadTickets: loadTickets
  };
};
