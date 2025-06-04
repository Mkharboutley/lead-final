
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorageInstance } from './firebase';

// Voice file upload with custom metadata
export const uploadVoiceFile = async (
  blob: Blob, 
  ticketNumber: string, 
  sender: 'client' | 'admin' = 'client'
): Promise<{ storagePath: string; downloadUrl: string }> => {
  try {
    const storage = getStorageInstance();
    const timestamp = Date.now();
    const filename = `${timestamp}.webm`;
    const storagePath = `tickets/${ticketNumber}/${filename}`;
    const storageRef = ref(storage, storagePath);
    
    // Upload the blob with custom metadata
    const uploadResult = await uploadBytes(storageRef, blob, {
      customMetadata: {
        sender: sender,
        ticket_number: ticketNumber.toString(),
        timestamp: new Date().toISOString()
      }
    });
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    
    console.log('Voice file uploaded successfully:', storagePath);
    return {
      storagePath,
      downloadUrl
    };
  } catch (error) {
    console.error('Error uploading voice file:', error);
    throw error;
  }
};

// Voice file download
export const downloadVoiceFile = async (storagePath: string): Promise<string> => {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, storagePath);
    
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Voice file download URL retrieved:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Error getting voice file download URL:', error);
    throw error;
  }
};

// Delete voice file from storage
export const deleteVoiceFile = async (storagePath: string): Promise<void> => {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, storagePath);
    
    await deleteObject(storageRef);
    console.log('Voice file deleted successfully:', storagePath);
  } catch (error) {
    console.error('Error deleting voice file:', error);
    throw error;
  }
};

// Get voice file metadata
export const getVoiceFileMetadata = async (storagePath: string) => {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, storagePath);
    
    // Get metadata using getMetadata
    const { getMetadata } = await import('firebase/storage');
    const metadata = await getMetadata(storageRef);
    
    return {
      name: metadata.name,
      size: metadata.size,
      timeCreated: metadata.timeCreated,
      customMetadata: metadata.customMetadata
    };
  } catch (error) {
    console.error('Error getting voice file metadata:', error);
    throw error;
  }
};
