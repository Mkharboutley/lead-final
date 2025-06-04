
import { updateTicketStatus } from '../services/firestore';
import { TicketStatus } from '../types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTicketActions = (reloadTickets: () => Promise<void>) => {
  const { toast } = useToast();

  const handleStatusUpdate = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      await reloadTickets();
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  return {
    handleStatusUpdate
  };
};
