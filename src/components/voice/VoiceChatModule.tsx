import React, { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VoiceMessage } from '../../types/VoiceMessage';
import { subscribeToVoiceMessages } from '../../services/realtime';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessageItem from './VoiceMessageItem';
import { initializeFirebase } from '../../services/firebase';

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
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

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
      
      // Check for new messages from other users
      if (newMessages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
        const recentMessages = newMessages.slice(0, newMessages.length - prevMessageCountRef.current);
        const hasNewFromOthers = recentMessages.some(msg => msg.sender !== userRole);
        
        if (hasNewFromOthers) {
          setHasNewMessages(true);
        }
      }
      
      setMessages(newMessages);
      prevMessageCountRef.current = newMessages.length;
      setIsLoading(false);
    });

    return () => {
      console.log('Unsubscribing from voice messages');
      unsubscribe();
    };
  }, [ticketId, userRole]);

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
    setHasNewMessages(false); // Clear new message indicator when user sends a message
  };

  const handleViewMessages = () => {
    setHasNewMessages(false);
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
            <Badge variant="outline" className="text-sm">
              {messages.length}
            </Badge>
          )}
          {hasNewMessages && (
            <Badge variant="default" className="animate-pulse flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              New
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4" onClick={handleViewMessages}>
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
