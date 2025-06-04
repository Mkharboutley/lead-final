
import { updateTicketStatus } from '../services/firestore';
import { Ticket, TicketStatus } from '../types/Ticket';
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

  const getStatusActions = (ticket: Ticket) => {
    const actions: { status: TicketStatus; label: string; variant?: "default" | "destructive" | "outline" | "secondary" }[] = [];
    
    switch (ticket.status) {
      case 'running':
        actions.push({ status: 'requested', label: 'Mark Requested', variant: 'outline' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
      case 'requested':
        actions.push({ status: 'assigned', label: 'Assign Worker', variant: 'default' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
      case 'assigned':
        actions.push({ status: 'completed', label: 'Mark Complete', variant: 'default' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
    }
    
    return actions;
  };

  return {
    handleStatusUpdate,
    getStatusActions
  };
};
