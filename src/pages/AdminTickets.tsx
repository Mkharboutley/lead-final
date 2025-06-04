
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VoiceChatModule from '../components/voice/VoiceChatModule';
import TicketTabs from '../components/TicketTabs';
import { useTickets } from '../hooks/useTickets';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const AdminTicketsPage: React.FC = () => {
  const { tickets, isLoading, error } = useTickets();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/create-ticket')}><PlusCircle className="h-4 w-4 mr-2"/>Create New Ticket</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {tickets && tickets.length > 0 ? (
                <TicketTabs tickets={tickets} />
              ) : (
                <div>No tickets found.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Voice Chat Module */}
        <div>
          <VoiceChatModule ticketId="test-ticket-1" ticketNumber={123} userRole="admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
