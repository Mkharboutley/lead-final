
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Car, User, Calendar, Bell, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceChatModule from '../components/VoiceChatModule';
import CountdownTimer from '../components/CountdownTimer';
import { useTicketStatus } from '../hooks/useTicketStatus';
import { useVoiceNotifications } from '../hooks/useVoiceNotifications';

const ClientTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // For demo purposes, using the route param as ticketId
  // In a real app, you'd fetch the ticket data based on the ID
  const ticketId = id || 'demo-ticket';
  const ticketNumber = parseInt(id || '1', 10);
  
  // Subscribe to ticket status changes
  const { ticket, isLoading: isLoadingTicket } = useTicketStatus(ticketId);
  
  // Set up voice notifications
  const { 
    hasNewMessages, 
    clearNotifications 
  } = useVoiceNotifications({
    ticketId,
    userRole: 'client',
    enableSound: true,
    enableToast: true
  });
  
  // Clear notifications when the component is focused
  useEffect(() => {
    const handleFocus = () => {
      if (hasNewMessages) {
        clearNotifications();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [hasNewMessages, clearNotifications]);
  
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll be notified when there are new messages."
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleTimerComplete = () => {
    toast({
      title: "Worker Should Have Arrived!",
      description: "Your car should be ready for pickup now.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ticket #{ticketNumber}</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">Client Ticket View</p>
          {ticket && (
            <Badge variant={
              ticket.status === 'completed' ? 'default' : 
              ticket.status === 'cancelled' ? 'destructive' : 
              ticket.status === 'assigned' ? 'secondary' : 'outline'
            }>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Notification Permission Request */}
        {('Notification' in window) && Notification.permission !== 'granted' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <p className="text-blue-700 text-sm">
                  Enable notifications to receive alerts when admin responds
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestNotificationPermission}
                className="bg-white hover:bg-blue-50"
              >
                Enable
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Countdown Timer - Show when worker is assigned */}
        {ticket && ticket.status === 'assigned' && ticket.eta_minutes && ticket.assigned_at && (
          <CountdownTimer
            etaMinutes={ticket.eta_minutes}
            assignedAt={ticket.assigned_at.toDate()}
            onComplete={handleTimerComplete}
          />
        )}
        
        {/* Voice Chat Module */}
        <VoiceChatModule
          ticketId={ticketId}
          ticketNumber={ticketNumber}
          userRole="client"
        />
        
        {/* Ticket Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Ticket Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticket ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Guest:</span> 
                    <span>{ticket.guest_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Vehicle:</span>
                    <span>{ticket.car_model}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium ml-6">Plate:</span>
                    <span>{ticket.plate_number}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Created:</span>
                    <span>{ticket.created_at.toDate().toLocaleString()}</span>
                  </div>
                  
                  {ticket.status === 'assigned' && ticket.eta_minutes && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Original ETA:</span>
                      <span>{ticket.eta_minutes} minutes</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Status:</span>
                    <Badge variant="outline">
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : isLoadingTicket ? (
              <p className="text-gray-500">Loading ticket information...</p>
            ) : (
              <p className="text-gray-600">
                This is the client view of ticket #{ticketNumber}. 
                Use the voice messaging feature above to communicate with support.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientTicket;
