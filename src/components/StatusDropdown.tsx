
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play, UserPlus, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Ticket, TicketStatus } from '../types/Ticket';

interface StatusDropdownProps {
  ticket: Ticket;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker: (ticket: Ticket) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  ticket,
  onStatusUpdate,
  onAssignWorker
}) => {
  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'running':
        return <Play className="h-4 w-4" />;
      case 'requested':
        return <UserPlus className="h-4 w-4" />;
      case 'assigned':
        return <Truck className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    
    // Prevent any status changes if already completed
    if (ticket.status === 'completed') {
      return [];
    }
    
    switch (ticket.status) {
      case 'running':
        // Only admin can change from running to requested
        actions.push(
          { status: 'requested' as TicketStatus, label: 'Mark as Requested', icon: <UserPlus className="h-4 w-4" /> }
        );
        break;
        
      case 'requested':
        // Can assign worker or mark as running (manual override)
        actions.push(
          { status: 'assigned' as TicketStatus, label: 'Assign Worker', icon: <Truck className="h-4 w-4" />, isAssign: true },
          { status: 'running' as TicketStatus, label: 'Override to Running', icon: <Play className="h-4 w-4" /> }
        );
        break;
        
      case 'assigned':
        // Can complete or override back to requested
        actions.push(
          { status: 'completed' as TicketStatus, label: 'Mark Complete', icon: <CheckCircle className="h-4 w-4" /> },
          { status: 'requested' as TicketStatus, label: 'Back to Requested', icon: <UserPlus className="h-4 w-4" /> }
        );
        break;
    }
    
    // Add cancel option for all active statuses (except completed)
    if (['running', 'requested', 'assigned'].includes(ticket.status)) {
      actions.push(
        { status: 'cancelled' as TicketStatus, label: 'Cancel Ticket', icon: <XCircle className="h-4 w-4" /> }
      );
    }
    
    return actions;
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="opacity-50">
        No Actions Available
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          Actions
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              if (action.isAssign) {
                onAssignWorker(ticket);
              } else {
                onStatusUpdate(ticket.id, action.status);
              }
            }}
            className="flex items-center gap-2"
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
