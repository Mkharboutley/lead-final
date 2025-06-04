
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, User, Car } from 'lucide-react';
import { Ticket, TicketStatus } from '../types/Ticket';
import StatusBadge from './StatusBadge';
import PriorityBadge, { Priority } from './PriorityBadge';
import VoiceMessageBadge from './VoiceMessageBadge';

interface TicketListItemProps {
  ticket: Ticket;
  messageCount: number;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  isSelected: boolean;
  getStatusActions: (ticket: Ticket) => { status: TicketStatus; label: string; variant?: "default" | "destructive" | "outline" | "secondary" }[];
}

const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  messageCount,
  onTicketSelect,
  onStatusUpdate,
  isSelected,
  getStatusActions
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

  // Simulate unread messages (in real app, this would come from props)
  const hasUnreadMessages = messageCount > 0 && Math.random() > 0.7;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onTicketSelect(ticket)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              Ticket #{ticket.ticket_number}
              <PriorityBadge priority={calculatePriority(ticket)} size="sm" />
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusBadge status={ticket.status} />
              <VoiceMessageBadge 
                messageCount={messageCount} 
                hasUnread={hasUnreadMessages}
                size="sm"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <Clock className="h-4 w-4 inline mr-1" />
            {ticket.created_at.toDate().toLocaleString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="font-medium">Guest:</span>
            <span>{ticket.guest_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4" />
            <span className="font-medium">Vehicle:</span>
            <span>{ticket.car_model} ({ticket.plate_number})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {getStatusActions(ticket).map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant}
              onClick={(e) => {
                e.stopPropagation();
                onStatusUpdate(ticket.id, action.status);
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketListItem;
