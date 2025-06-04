
import { ref, push, set, get, onValue, off, update, remove, DatabaseReference } from 'firebase/database';
import { getRealtimeDbInstance } from './firebase';
import { VoiceMessage } from '../types/VoiceMessage';

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
      timestamp: new Date(),
    };
    
    await set(newMessageRef, {
      ...messageData,
      timestamp: messageData.timestamp.toISOString(), // Store as ISO string for Firebase
    });
    
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
          timestamp: new Date(messageData.timestamp), // Convert back to Date
        });
      });
      
      // Sort by timestamp (newest first)
      messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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
        timestamp: new Date(data.timestamp),
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

// Subscribe to voice messages for real-time updates
export const subscribeToVoiceMessages = (
  ticketId: string,
  callback: (messages: VoiceMessage[]) => void
): (() => void) => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, getVoiceMessagesPath(ticketId));
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages: VoiceMessage[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((messageId) => {
          const messageData = data[messageId];
          messages.push({
            ...messageData,
            id: messageId,
            timestamp: new Date(messageData.timestamp),
          });
        });
        
        // Sort by timestamp (newest first)
        messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }
      
      callback(messages);
    });
    
    console.log('Subscribed to voice messages for ticket:', ticketId);
    
    // Return unsubscribe function
    return () => {
      off(messagesRef, 'value', unsubscribe);
      console.log('Unsubscribed from voice messages for ticket:', ticketId);
    };
  } catch (error) {
    console.error('Error subscribing to voice messages:', error);
    throw error;
  }
};

// Subscribe to a specific voice message
export const subscribeToVoiceMessage = (
  ticketId: string,
  messageId: string,
  callback: (message: VoiceMessage | null) => void
): (() => void) => {
  try {
    const db = getRealtimeDb();
    const messageRef = ref(db, getVoiceMessagePath(ticketId, messageId));
    
    const unsubscribe = onValue(messageRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback({
          ...data,
          id: messageId,
          timestamp: new Date(data.timestamp),
        });
      } else {
        callback(null);
      }
    });
    
    console.log('Subscribed to voice message:', messageId);
    
    // Return unsubscribe function
    return () => {
      off(messageRef, 'value', unsubscribe);
      console.log('Unsubscribed from voice message:', messageId);
    };
  } catch (error) {
    console.error('Error subscribing to voice message:', error);
    throw error;
  }
};

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

// Send a general message (for compatibility with existing code)
export const sendMessage = async (ticketId: string, message: any): Promise<void> => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, `messages/${ticketId}`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      ...message,
      timestamp: new Date().toISOString(),
    });
    
    console.log('General message sent for ticket:', ticketId);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Subscribe to general messages (for compatibility with existing code)
export const subscribeToMessages = (ticketId: string, callback: (message: any) => void): (() => void) => {
  try {
    const db = getRealtimeDb();
    const messagesRef = ref(db, `messages/${ticketId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback(data);
      }
    });
    
    console.log('Subscribed to general messages for ticket:', ticketId);
    
    return () => {
      off(messagesRef, 'value', unsubscribe);
      console.log('Unsubscribed from general messages for ticket:', ticketId);
    };
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    throw error;
  }
};

// Initialize realtime messaging (for compatibility with existing code)
export const initializeRealtimeMessaging = (): void => {
  console.log('Realtime messaging initialized');
  // Additional initialization logic can be added here if needed
};
