
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { VoiceMessage } from '../types/VoiceMessage';
import { subscribeToVoiceMessages } from '../services/realtime';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessageItem from './VoiceMessageItem';
import { initializeFirebase } from '../services/firebase';

interface VoiceChatModuleProps {
  ticketId: string;
  ticketNumber: number;
  userRole: 'client' | 'admin';
}

const VoiceChatModule: React.FC<VoiceChatModuleProps> = ({
  ticketId,
  ticketNumber,
  userRole
}) => {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    try {
      initializeFirebase();
    } catch (error) {
      console.log('Firebase already initialized or error:', error);
    }
  }, []);

  // Subscribe to voice messages
  useEffect(() => {
    console.log('Subscribing to voice messages for ticket:', ticketId);
    
    const unsubscribe = subscribeToVoiceMessages(ticketId, (newMessages) => {
      console.log('Received voice messages:', newMessages);
      setMessages(newMessages);
      setIsLoading(false);
    });

    return () => {
      console.log('Unsubscribing from voice messages');
      unsubscribe();
    };
  }, [ticketId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleMessageSent = () => {
    // Message will be automatically updated via real-time subscription
    console.log('Voice message sent');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Voice Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading voice messages...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Voice Messages
          {messages.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({messages.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No voice messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <VoiceMessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender === userRole}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Recording Area */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Record a voice message
            </span>
            <VoiceRecorder
              ticketId={ticketId}
              ticketNumber={ticketNumber}
              sender={userRole}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChatModule;
