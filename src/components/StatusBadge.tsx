
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '../types/Ticket';

interface StatusBadgeProps {
  status: TicketStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusVariant = (status: TicketStatus) => {
    switch (status) {
      case 'completed':
        return 'default'; // Green badge for completed
      case 'cancelled':
        return 'destructive'; // Red badge for cancelled
      case 'assigned':
        return 'secondary'; // Blue badge for assigned
      case 'requested':
        return 'outline'; // Outlined badge for requested
      case 'running':
        return 'outline'; // Outlined badge for running
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'assigned':
        return 'Assigned';
      case 'requested':
        return 'Requested';
      case 'running':
        return 'Running';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
};

export default StatusBadge;
