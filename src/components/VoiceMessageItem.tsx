
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VoiceMessage } from '../types/VoiceMessage';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { getRelativeTime } from '../utils/time';
import { downloadVoiceFile } from '../services/storage';

interface VoiceMessageItemProps {
  message: VoiceMessage;
  isOwnMessage: boolean;
}

const VoiceMessageItem: React.FC<VoiceMessageItemProps> = ({ 
  message, 
  isOwnMessage 
}) => {
  const { 
    isPlaying, 
    isLoading, 
    currentTime, 
    duration, 
    play, 
    pause, 
    load 
  } = useAudioPlayer();

  const handlePlayPause = async () => {
    try {
      if (!isLoading && !isPlaying) {
        // Load audio if not already loaded
        const audioUrl = await downloadVoiceFile(message.storage_path);
        await load(audioUrl);
        play();
      } else if (isPlaying) {
        pause();
      }
    } catch (error) {
      console.error('Error playing voice message:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const messageTime = new Date(message.timestamp);

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <Card className={`max-w-xs p-3 ${
        isOwnMessage 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlayPause}
            variant={isOwnMessage ? "secondary" : "default"}
            size="icon"
            className="rounded-full h-8 w-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <Volume2 className="h-4 w-4 animate-pulse" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`text-xs ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.sender === 'admin' ? 'Admin' : 'Client'}
              </div>
              <div className={`text-xs ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {getRelativeTime(messageTime)}
              </div>
            </div>
            
            {/* Simple progress bar */}
            <div className={`w-full h-1 rounded-full ${
              isOwnMessage ? 'bg-blue-300' : 'bg-gray-300'
            }`}>
              <div 
                className={`h-full rounded-full transition-all duration-100 ${
                  isOwnMessage ? 'bg-white' : 'bg-blue-500'
                }`}
                style={{ 
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                }}
              />
            </div>
            
            {duration > 0 && (
              <div className={`text-xs mt-1 ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VoiceMessageItem;
