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
    
    // Prevent any status changes if already completed or cancelled
    if (ticket.status === 'completed' || ticket.status === 'cancelled') {
      return [];
    }
    
    switch (ticket.status) {
      case 'running':
        actions.push({
          status: 'requested' as TicketStatus,
          label: 'Mark as Requested',
          icon: <UserPlus className="h-4 w-4" />,
          variant: 'default' as const
        });
        break;
        
      case 'requested':
        actions.push(
          {
            status: 'assigned' as TicketStatus,
            label: 'Assign Worker',
            icon: <Truck className="h-4 w-4" />,
            isAssign: true,
            variant: 'default' as const
          },
          {
            status: 'running' as TicketStatus,
            label: 'Back to Running',
            icon: <Play className="h-4 w-4" />,
            variant: 'secondary' as const
          }
        );
        break;
        
      case 'assigned':
        actions.push(
          {
            status: 'completed' as TicketStatus,
            label: 'Mark Complete',
            icon: <CheckCircle className="h-4 w-4" />,
            variant: 'default' as const
          },
          {
            status: 'requested' as TicketStatus,
            label: 'Back to Requested',
            icon: <UserPlus className="h-4 w-4" />,
            variant: 'secondary' as const
          }
        );
        break;
    }
    
    // Add cancel option for all active statuses
    if (['running', 'requested', 'assigned'].includes(ticket.status)) {
      actions.push({
        status: 'cancelled' as TicketStatus,
        label: 'Cancel Ticket',
        icon: <XCircle className="h-4 w-4" />,
        variant: 'destructive' as const
      });
    }
    
    return actions;
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="glass-button h-8 px-2 py-1"
        >
          Actions
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="bg-black/40 backdrop-blur-xl border border-white/10"
      >
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
            className={`
              flex items-center gap-2 text-sm cursor-pointer
              ${action.variant === 'destructive' ? 'text-red-400 hover:text-red-300 hover:bg-red-950/50' : 
                action.variant === 'secondary' ? 'text-gray-300 hover:text-white hover:bg-white/5' :
                'text-white hover:bg-white/10'}
            `}
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