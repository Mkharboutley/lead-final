
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, MessageCircle } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface InlineAudioPreviewProps {
  messageCount: number;
  hasUnread?: boolean;
  onOpenVoiceChat: () => void;
  latestAudioUrl?: string;
}

const InlineAudioPreview: React.FC<InlineAudioPreviewProps> = ({
  messageCount,
  hasUnread = false,
  onOpenVoiceChat,
  latestAudioUrl
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying, isLoading, play, pause, load } = useAudioPlayer();

  const handlePlayPreview = async () => {
    if (!latestAudioUrl) return;
    
    if (!isPlaying) {
      await load(latestAudioUrl);
      play();
    } else {
      pause();
    }
  };

  if (messageCount === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MessageCircle className="h-4 w-4" />
        <span>No voice messages</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge 
          variant={hasUnread ? "default" : "outline"} 
          className={`flex items-center gap-1 ${hasUnread ? 'animate-pulse' : ''}`}
        >
          {hasUnread ? (
            <Volume2 className="h-3 w-3" />
          ) : (
            <MessageCircle className="h-3 w-3" />
          )}
          {messageCount} message{messageCount !== 1 ? 's' : ''}
        </Badge>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Hide' : 'Preview'}
        </Button>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Latest Message</span>
            {latestAudioUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPreview}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenVoiceChat}
            className="w-full"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Open Voice Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default InlineAudioPreview;
