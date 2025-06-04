
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketListItem from './TicketListItem';

interface TicketListProps {
  tickets: Ticket[];
  messageCounts: Record<string, number>;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  selectedTicketId?: string;
  getStatusActions: (ticket: Ticket) => { status: TicketStatus; label: string; variant?: "default" | "destructive" | "outline" | "secondary" }[];
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  messageCounts,
  onTicketSelect,
  onStatusUpdate,
  selectedTicketId,
  getStatusActions
}) => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets found
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              messageCount={messageCounts[ticket.id] || 0}
              onTicketSelect={onTicketSelect}
              onStatusUpdate={onStatusUpdate}
              isSelected={selectedTicketId === ticket.id}
              getStatusActions={getStatusActions}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default TicketList;
