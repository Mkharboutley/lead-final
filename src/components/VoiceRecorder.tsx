
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { uploadVoiceFile } from '../services/storage';
import { createVoiceMessage } from '../services/realtime';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  ticketId: string;
  ticketNumber: number;
  sender: 'client' | 'admin';
  onMessageSent?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  ticketId, 
  ticketNumber, 
  sender, 
  onMessageSent 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = handleRecordingStop;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks to release microphone
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const handleRecordingStop = async () => {
    setIsUploading(true);
    
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      // Upload to Firebase Storage
      const { storagePath } = await uploadVoiceFile(
        audioBlob, 
        ticketNumber.toString(), 
        sender
      );
      
      // Save metadata to Realtime Database
      await createVoiceMessage(ticketId, {
        sender,
        storage_path: storagePath
      });
      
      console.log('Voice message uploaded successfully');
      toast({
        title: "Message Sent",
        description: "Your voice message has been sent successfully."
      });
      
      onMessageSent?.();
    } catch (error) {
      console.error('Error uploading voice message:', error);
      toast({
        title: "Upload Error", 
        description: "Failed to send voice message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          disabled={isUploading}
          variant="default"
          size="icon"
          className="rounded-full"
        >
          <Mic className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          variant="destructive"
          size="icon"
          className="rounded-full animate-pulse"
        >
          <Square className="h-4 w-4" />
        </Button>
      )}
      
      {isRecording && (
        <span className="text-sm text-red-500 animate-pulse">
          Recording...
        </span>
      )}
      
      {isUploading && (
        <span className="text-sm text-blue-500">
          Uploading...
        </span>
      )}
    </div>
  );
};

export default VoiceRecorder;
