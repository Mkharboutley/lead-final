
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
      title: "Your valet has arrived!",
      description: "Your car should be ready for pickup now.",
    });
  };

  // Determine if we should show the countdown timer
  const shouldShowTimer = ticket && 
    ticket.status === 'assigned' && 
    ticket.eta_minutes && 
    ticket.eta_minutes > 0 && 
    ticket.assigned_at;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header with glassmorphism effect */}
        <div className="mb-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-6 shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Ticket #{ticketNumber}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
            <p className="text-gray-700">Client Ticket View</p>
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
        
        <div className="grid gap-4 sm:gap-6">
          {/* Notification Permission Request with glassmorphism */}
          {('Notification' in window) && Notification.permission !== 'granted' && (
            <div className="rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-200/30 p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-blue-800 text-sm font-medium">
                    Enable notifications to receive alerts when admin responds
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestNotificationPermission}
                  className="bg-white/80 hover:bg-white/90 backdrop-blur-sm border-white/40 flex-shrink-0"
                >
                  Enable
                </Button>
              </div>
            </div>
          )}
          
          {/* Countdown Timer - Show only when appropriate */}
          {shouldShowTimer && (
            <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden">
              <CountdownTimer
                etaMinutes={ticket.eta_minutes}
                assignedAt={ticket.assigned_at.toDate()}
                ticketId={ticketId}
                onComplete={handleTimerComplete}
              />
            </div>
          )}
          
          {/* Voice Chat Module with glassmorphism wrapper */}
          <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden">
            <VoiceChatModule
              ticketId={ticketId}
              ticketNumber={ticketNumber}
              userRole="client"
            />
          </div>
          
          {/* Ticket Information with glassmorphism */}
          <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                <Car className="h-5 w-5 flex-shrink-0" />
                Ticket Information
              </div>
              <div className="space-y-4">
                {ticket ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Guest:</span> 
                        <span className="break-words text-gray-800">{ticket.guest_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Vehicle:</span>
                        <span className="break-words text-gray-800">{ticket.car_model}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium ml-6 text-gray-700">Plate:</span>
                        <span className="break-words text-gray-800">{ticket.plate_number}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Created:</span>
                        <span className="break-words text-xs sm:text-sm text-gray-800">{ticket.created_at.toDate().toLocaleString()}</span>
                      </div>
                      
                      {ticket.status === 'assigned' && ticket.eta_minutes && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="font-medium text-gray-700">Original ETA:</span>
                          <span className="text-gray-800">{ticket.eta_minutes} minutes</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Status:</span>
                        <Badge variant="outline">
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : isLoadingTicket ? (
                  <div className="rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 p-4">
                    <p className="text-gray-600">Loading ticket information...</p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 p-4">
                    <p className="text-gray-700">
                      This is the client view of ticket #{ticketNumber}. 
                      Use the voice messaging feature above to communicate with support.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTicket;
