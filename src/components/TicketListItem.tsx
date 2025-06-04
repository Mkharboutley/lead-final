
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, User, Car } from 'lucide-react';
import { Ticket, TicketStatus } from '../types/Ticket';
import StatusBadge from './StatusBadge';

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
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onTicketSelect(ticket)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Ticket #{ticket.ticket_number}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={ticket.status} />
              {messageCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {messageCount} messages
                </Badge>
              )}
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
