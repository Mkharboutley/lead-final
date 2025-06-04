
export interface VoiceMessage {
  id: string;
  ticketId: string;
  senderId: string;
  audioUrl: string;
  duration: number;
  timestamp: Date;
  isPlaying?: boolean;
}
