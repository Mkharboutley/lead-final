import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, Phone } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import VoiceChatModule from '../components/voice/VoiceChatModule';
import { useTicketData } from '../hooks/useTicketData';
import CountdownTimer from '../components/CountdownTimer';

const ClientTicket: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { ticket, isLoading, error } = useTicketData(ticketId || '');
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Error fetching ticket:", error);
    }
  }, [error]);

  if (isLoading || !ticket) {
    return <div>Loading ticket details...</div>;
  }

  const handleOpenVoiceChat = () => {
    setIsVoiceChatOpen(true);
  };

  const handleCloseVoiceChat = () => {
    setIsVoiceChatOpen(false);
  };

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Ticket #{ticket.ticketNumber}
            </CardTitle>
            <StatusBadge status={ticket.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  Created:{' '}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Location: {ticket.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Client: {ticket.clientName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>Phone: {ticket.clientPhoneNumber}</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p>{ticket.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Assigned Worker
                </h3>
                {ticket.assigned_worker ? (
                  <p>{ticket.assigned_worker}</p>
                ) : (
                  <p>Not assigned</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold">ETA</h3>
                {ticket.eta_minutes ? (
                  <CountdownTimer minutes={ticket.eta_minutes} />
                ) : (
                  <p>ETA not set</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Priority</h3>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Voice Messages
                  <Badge variant="secondary">{ticket.voice_message_count}</Badge>
                </h3>
                <Button onClick={handleOpenVoiceChat}>
                  Open Voice Chat
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isVoiceChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle>Voice Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <VoiceChatModule
                ticketId={ticketId}
                ticketNumber={ticket.ticketNumber}
                userRole="client"
              />
              <Button onClick={handleCloseVoiceChat} className="mt-4">
                Close Voice Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientTicket;
