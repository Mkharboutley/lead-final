
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketListItem from './TicketListItem';

interface TicketListProps {
  tickets: Ticket[];
  messageCounts: Record<string, number>;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
  selectedTicketId?: string;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  messageCounts,
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  selectedTicketId
}) => {
  // Simulate unread messages and latest audio URLs for demo
  const getTicketData = (ticketId: string) => ({
    hasUnreadMessages: Math.random() > 0.7,
    latestAudioUrl: Math.random() > 0.5 ? 'mock-audio-url' : undefined
  });

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets found
          </div>
        ) : (
          tickets.map((ticket) => {
            const ticketData = getTicketData(ticket.id);
            return (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                messageCount={messageCounts[ticket.id] || 0}
                onTicketSelect={onTicketSelect}
                onStatusUpdate={onStatusUpdate}
                onAssignWorker={onAssignWorker}
                isSelected={selectedTicketId === ticket.id}
                hasUnreadMessages={ticketData.hasUnreadMessages}
                latestAudioUrl={ticketData.latestAudioUrl}
              />
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

export default TicketList;
