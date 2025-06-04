import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  // Calculate priority based on ticket age and status
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
      className={`ticket-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white/10 backdrop-blur-lg border border-white/20 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-2xl' : ''
      }`}
      onClick={() => onTicketSelect(ticket)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
              Ticket #{ticket.ticket_number}
              <PriorityBadge priority={calculatePriority(ticket)} size="sm" />
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusBadge status={ticket.status} />
              {ticket.assigned_worker && (
                <span className="text-xs bg-blue-500/20 text-blue-800 px-2 py-1 rounded border border-blue-500/30 backdrop-blur-sm">
                  Assigned to: {ticket.assigned_worker}
                </span>
              )}
              {ticket.eta_minutes && (
                <span className="text-xs bg-green-500/20 text-green-800 px-2 py-1 rounded border border-green-500/30 backdrop-blur-sm">
                  ETA: {ticket.eta_minutes}min
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-white/20 backdrop-blur-sm px-2 py-1 rounded border border-white/30">
            <Clock className="h-4 w-4 inline mr-1" />
            {ticket.created_at.toDate().toLocaleString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm p-2 rounded border border-white/20">
            <Car className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-700">Vehicle:</span>
            <span className="text-gray-900">{ticket.car_model} ({ticket.plate_number})</span>
          </div>
          
          <InlineAudioPreview
            messageCount={messageCount}
            hasUnread={hasUnreadMessages}
            onOpenVoiceChat={handleOpenVoiceChat}
            latestAudioUrl={latestAudioUrl}
          />
        </div>

        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <StatusDropdown
            ticket={ticket}
            onStatusUpdate={onStatusUpdate}
            onAssignWorker={onAssignWorker}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketListItem;