
import { updateVoiceMessage, getVoiceMessages } from './voiceMessageOperations';

// Mark voice message as played
export const markVoiceMessageAsPlayed = async (ticketId: string, messageId: string): Promise<void> => {
  return updateVoiceMessage(ticketId, messageId, { isPlaying: false });
};

// Set voice message playing status
export const setVoiceMessagePlayingStatus = async (
  ticketId: string,
  messageId: string,
  isPlaying: boolean
): Promise<void> => {
  return updateVoiceMessage(ticketId, messageId, { isPlaying });
};

// Get voice message count for a ticket
export const getVoiceMessageCount = async (ticketId: string): Promise<number> => {
  try {
    const messages = await getVoiceMessages(ticketId);
    return messages.length;
  } catch (error) {
    console.error('Error getting voice message count:', error);
    return 0;
  }
};
