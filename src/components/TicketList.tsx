import React from 'react';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketListItem from './TicketListItem';

interface TicketListProps {
  tickets: Ticket[];
  messageCounts?: Record<string, number>;
  unreadCounts?: Record<string, number>;
  latestAudioUrls?: Record<string, string>;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
  selectedTicketId?: string;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  messageCounts = {},
  unreadCounts = {},
  latestAudioUrls = {},
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  selectedTicketId
}) => {
  // Sort tickets: requested first, then by creation date (newest first)
  const sortedTickets = [...tickets].sort((a, b) => {
    // First priority: requested tickets go to the top
    if (a.status === 'requested' && b.status !== 'requested') return -1;
    if (b.status === 'requested' && a.status !== 'requested') return 1;
    
    // Second priority: sort by creation date (newest first)
    return b.created_at.toMillis() - a.created_at.toMillis();
  });

  return (
    <div className="ticket-list">
      <div className="space-y-3">
        {sortedTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets found
          </div>
        ) : (
          sortedTickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              messageCount={messageCounts[ticket.id] || 0}
              onTicketSelect={onTicketSelect}
              onStatusUpdate={onStatusUpdate}
              onAssignWorker={onAssignWorker}
              isSelected={selectedTicketId === ticket.id}
              hasUnreadMessages={unreadCounts[ticket.id] > 0}
              latestAudioUrl={latestAudioUrls[ticket.id]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;