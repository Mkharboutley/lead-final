
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Clock, User, Car } from 'lucide-react';
import { getTickets, updateTicketStatus } from '../services/firestore';
import { getVoiceMessageCount } from '../services/realtime';
import { Ticket, TicketStatus } from '../types/Ticket';
import VoiceChatModule from '../components/VoiceChatModule';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '@/hooks/use-toast';

const AdminTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      loadMessageCounts();
    }
  }, [tickets]);

  const loadTickets = async () => {
    try {
      const ticketData = await getTickets();
      setTickets(ticketData);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessageCounts = async () => {
    const counts: Record<string, number> = {};
    for (const ticket of tickets) {
      try {
        const count = await getVoiceMessageCount(ticket.id);
        counts[ticket.id] = count;
      } catch (error) {
        console.error(`Error loading message count for ticket ${ticket.id}:`, error);
        counts[ticket.id] = 0;
      }
    }
    setMessageCounts(counts);
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      await loadTickets(); // Reload tickets to reflect changes
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  const getStatusActions = (ticket: Ticket) => {
    const actions: { status: TicketStatus; label: string; variant?: "default" | "destructive" | "outline" | "secondary" }[] = [];
    
    switch (ticket.status) {
      case 'running':
        actions.push({ status: 'requested', label: 'Mark Requested', variant: 'outline' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
      case 'requested':
        actions.push({ status: 'assigned', label: 'Assign Worker', variant: 'default' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
      case 'assigned':
        actions.push({ status: 'completed', label: 'Mark Complete', variant: 'default' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
    }
    
    return actions;
  };

  const filterTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter(ticket => ticket.status === status);
  };

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
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
              <TabsTrigger value="running">Running ({filterTicketsByStatus('running').length})</TabsTrigger>
              <TabsTrigger value="requested">Requested ({filterTicketsByStatus('requested').length})</TabsTrigger>
              <TabsTrigger value="assigned">Assigned ({filterTicketsByStatus('assigned').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filterTicketsByStatus('completed').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TicketList 
                tickets={tickets} 
                messageCounts={messageCounts}
                onTicketSelect={setSelectedTicket}
                onStatusUpdate={handleStatusUpdate}
                selectedTicketId={selectedTicket?.id}
              />
            </TabsContent>

            <TabsContent value="running">
              <TicketList 
                tickets={filterTicketsByStatus('running')} 
                messageCounts={messageCounts}
                onTicketSelect={setSelectedTicket}
                onStatusUpdate={handleStatusUpdate}
                selectedTicketId={selectedTicket?.id}
              />
            </TabsContent>

            <TabsContent value="requested">
              <TicketList 
                tickets={filterTicketsByStatus('requested')} 
                messageCounts={messageCounts}
                onTicketSelect={setSelectedTicket}
                onStatusUpdate={handleStatusUpdate}
                selectedTicketId={selectedTicket?.id}
              />
            </TabsContent>

            <TabsContent value="assigned">
              <TicketList 
                tickets={filterTicketsByStatus('assigned')} 
                messageCounts={messageCounts}
                onTicketSelect={setSelectedTicket}
                onStatusUpdate={handleStatusUpdate}
                selectedTicketId={selectedTicket?.id}
              />
            </TabsContent>

            <TabsContent value="completed">
              <TicketList 
                tickets={filterTicketsByStatus('completed')} 
                messageCounts={messageCounts}
                onTicketSelect={setSelectedTicket}
                onStatusUpdate={handleStatusUpdate}
                selectedTicketId={selectedTicket?.id}
              />
            </TabsContent>
          </Tabs>
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

interface TicketListProps {
  tickets: Ticket[];
  messageCounts: Record<string, number>;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => void;
  selectedTicketId?: string;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  messageCounts,
  onTicketSelect,
  onStatusUpdate,
  selectedTicketId
}) => {
  const getStatusActions = (ticket: Ticket) => {
    const actions: { status: TicketStatus; label: string; variant?: "default" | "destructive" | "outline" | "secondary" }[] = [];
    
    switch (ticket.status) {
      case 'running':
        actions.push({ status: 'requested', label: 'Mark Requested', variant: 'outline' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
      case 'requested':
        actions.push({ status: 'assigned', label: 'Assign Worker', variant: 'default' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
      case 'assigned':
        actions.push({ status: 'completed', label: 'Mark Complete', variant: 'default' });
        actions.push({ status: 'cancelled', label: 'Cancel', variant: 'destructive' });
        break;
    }
    
    return actions;
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets found
          </div>
        ) : (
          tickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTicketId === ticket.id ? 'ring-2 ring-blue-500' : ''
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
                      {messageCounts[ticket.id] > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {messageCounts[ticket.id]} messages
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
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default AdminTickets;
