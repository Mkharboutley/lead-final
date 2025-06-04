
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
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'assigned':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
