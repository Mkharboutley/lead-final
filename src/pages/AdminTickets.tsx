
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import VoiceChatModule from '../components/VoiceChatModule';
import TicketTabs from '../components/TicketTabs';
import { Ticket } from '../types/Ticket';
import { useTicketData } from '../hooks/useTicketData';
import { useTicketActions } from '../hooks/useTicketActions';

const AdminTickets: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const { tickets, messageCounts, isLoading, reloadTickets } = useTicketData();
  const { handleStatusUpdate, getStatusActions } = useTicketActions(reloadTickets);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage tickets and voice communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Panel */}
        <div className="lg:col-span-2">
          <TicketTabs
            tickets={tickets}
            messageCounts={messageCounts}
            onTicketSelect={setSelectedTicket}
            onStatusUpdate={handleStatusUpdate}
            selectedTicketId={selectedTicket?.id}
            getStatusActions={getStatusActions}
          />
        </div>

        {/* Voice Chat Panel */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <VoiceChatModule
              ticketId={selectedTicket.id}
              ticketNumber={selectedTicket.ticket_number}
              userRole="admin"
            />
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent>
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view voice messages</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
