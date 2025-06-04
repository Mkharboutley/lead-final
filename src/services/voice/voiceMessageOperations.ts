
import { ref, push, set, get, update, remove } from 'firebase/database';
import { getRealtimeDbInstance } from '../firebase';
import { VoiceMessage } from '../../types/VoiceMessage';

// Get Realtime Database instance
const getRealtimeDb = () => getRealtimeDbInstance();

// Voice message paths
const getVoiceMessagesPath = (ticketId: string) => `voice_messages/${ticketId}`;
const getVoiceMessagePath = (ticketId: string, messageId: string) => `voice_messages/${ticketId}/${messageId}`;

// Create a new voice message
export const createVoiceMessage = async (
  ticketId: string,
  voiceMessage: Omit<VoiceMessage, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, getVoiceMessagesPath(ticketId));
    
    const newMessageRef = push(messagesRef);
    const messageId = newMessageRef.key!;
    
    const messageData: VoiceMessage = {
      ...voiceMessage,
      id: messageId,
      timestamp: Date.now(),
    };
    
    await set(newMessageRef, messageData);
    
    console.log('Voice message created:', messageId, 'for ticket:', ticketId);
    return messageId;
  } catch (error) {
    console.error('Error creating voice message:', error);
    throw error;
  }
};

// Get all voice messages for a ticket
export const getVoiceMessages = async (ticketId: string): Promise<VoiceMessage[]> => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, getVoiceMessagesPath(ticketId));
    
    const snapshot = await get(messagesRef);
    const messages: VoiceMessage[] = [];
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach((messageId) => {
        const messageData = data[messageId];
        messages.push({
          ...messageData,
          id: messageId,
          timestamp: messageData.timestamp,
        });
      });
      
      // Sort by timestamp (newest first)
      messages.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    console.log(`Retrieved ${messages.length} voice messages for ticket:`, ticketId);
    return messages;
  } catch (error) {
    console.error('Error getting voice messages:', error);
    throw error;
  }
};

// Get a specific voice message
export const getVoiceMessage = async (ticketId: string, messageId: string): Promise<VoiceMessage | null> => {
  try {
    const db = getRealtimeDb();
    const messageRef = ref(db, getVoiceMessagePath(ticketId, messageId));
    
    const snapshot = await get(messageRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        ...data,
        id: messageId,
        timestamp: data.timestamp,
      };
    }
    
    console.log('Voice message not found:', messageId);
    return null;
  } catch (error) {
    console.error('Error getting voice message:', error);
    throw error;
  }
};

// Update voice message (e.g., mark as played)
export const updateVoiceMessage = async (
  ticketId: string,
  messageId: string,
  updates: Partial<VoiceMessage>
): Promise<void> => {
  try {
    const db = getRealtimeDb();
    const messageRef = ref(db, getVoiceMessagePath(ticketId, messageId));
    
    // Remove id and timestamp from updates to avoid overwriting
    const { id, timestamp, ...updateData } = updates;
    
    await update(messageRef, updateData);
    console.log('Voice message updated:', messageId);
  } catch (error) {
    console.error('Error updating voice message:', error);
    throw error;
  }
};

// Delete a voice message
export const deleteVoiceMessage = async (ticketId: string, messageId: string): Promise<void> => {
  try {
    const db = getRealtimeDb();
    const messageRef = ref(db, getVoiceMessagePath(ticketId, messageId));
    
    await remove(messageRef);
    console.log('Voice message deleted:', messageId);
  } catch (error) {
    console.error('Error deleting voice message:', error);
    throw error;
  }
};

// Delete all voice messages for a ticket
export const deleteAllVoiceMessages = async (ticketId: string): Promise<void> => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, getVoiceMessagesPath(ticketId));
    
    await remove(messagesRef);
    console.log('All voice messages deleted for ticket:', ticketId);
  } catch (error) {
    console.error('Error deleting all voice messages:', error);
    throw error;
  }
};
