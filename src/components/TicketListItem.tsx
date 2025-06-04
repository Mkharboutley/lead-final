import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User, Car } from 'lucide-react';
import { Ticket, TicketStatus } from '../types/Ticket';
import StatusBadge from './StatusBadge';
import PriorityBadge, { Priority } from './PriorityBadge';
import StatusDropdown from './StatusDropdown';
import InlineAudioPreview from './InlineAudioPreview';

interface TicketListItemProps {
  ticket: Ticket;
  messageCount: number;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
  isSelected: boolean;
  hasUnreadMessages?: boolean;
  latestAudioUrl?: string;
}

const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  messageCount,
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  isSelected,
  hasUnreadMessages = false,
  latestAudioUrl
}) => {
  const calculatePriority = (ticket: Ticket): Priority => {
    const now = new Date();
    const createdAt = ticket.created_at.toDate();
    const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    if (ticket.status === 'requested' && ageInHours > 2) return 'urgent';
    if (ticket.status === 'assigned' && ageInHours > 4) return 'high';
    if (ticket.status === 'running' && ageInHours > 1) return 'medium';
    return 'low';
  };

  const handleOpenVoiceChat = () => {
    onTicketSelect(ticket);
  };

  return (
    <Card 
      className={`ticket-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500 shadow-2xl' : ''
      }`}
      onClick={() => onTicketSelect(ticket)}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">#{ticket.ticket_number}</span>
            <PriorityBadge priority={calculatePriority(ticket)} size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <div onClick={(e) => e.stopPropagation()}>
              <StatusDropdown
                ticket={ticket}
                onStatusUpdate={onStatusUpdate}
                onAssignWorker={onAssignWorker}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="flex items-center gap-2 mb-3 bg-white/5 rounded-lg p-2">
          <Car className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-200">{ticket.car_model} ({ticket.plate_number})</span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {ticket.created_at.toDate().toLocaleString()}
          </div>
          
          <InlineAudioPreview
            messageCount={messageCount}
            hasUnread={hasUnreadMessages}
            onOpenVoiceChat={handleOpenVoiceChat}
            latestAudioUrl={latestAudioUrl}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketListItem;