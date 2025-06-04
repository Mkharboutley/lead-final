
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { updateTicketStatus } from '../services/firestore';
import { subscribeToETAConfig } from '../services/adminConfigService';
import { ETAConfig } from '../types/AdminConfig';
import { useToast } from '@/hooks/use-toast';

interface CountdownTimerProps {
  etaMinutes?: number; // Made optional, will use config if not provided
  assignedAt: Date;
  ticketId?: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  etaMinutes, 
  assignedAt, 
  ticketId,
  onComplete 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasAutoUpgraded, setHasAutoUpgraded] = useState(false);
  const [etaConfig, setETAConfig] = useState<ETAConfig | null>(null);
  const { toast } = useToast();

  // Subscribe to ETA configuration changes
  useEffect(() => {
    const unsubscribe = subscribeToETAConfig((config) => {
      setETAConfig(config);
    });

    return () => unsubscribe();
  }, []);

  // Get effective ETA minutes from props or config
  const effectiveETAMinutes = etaMinutes || etaConfig?.defaultDeliveryTimeMinutes || 10;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const assigned = assignedAt.getTime();
      const etaTime = assigned + (effectiveETAMinutes * 60 * 1000);
      const remaining = Math.max(0, etaTime - now);
      
      return Math.floor(remaining / 1000); // Convert to seconds
    };

    const updateTimer = async () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
        
        // Optional auto-upgrade to completed status
        if (ticketId && !hasAutoUpgraded) {
          try {
            await updateTicketStatus(ticketId, 'completed');
            setHasAutoUpgraded(true);
            toast({
              title: "Ticket Auto-Completed",
              description: "Your ticket has been automatically marked as completed.",
            });
          } catch (error) {
            console.error('Error auto-upgrading ticket status:', error);
          }
        }
      }
    };

    // Check if ETA is already in the past
    const initialRemaining = calculateTimeRemaining();
    if (initialRemaining <= 0) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Initial calculation
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [effectiveETAMinutes, assignedAt, isComplete, onComplete, ticketId, hasAutoUpgraded, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = effectiveETAMinutes * 60;
    const elapsed = totalSeconds - timeRemaining;
    return Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
  };

  if (isComplete) {
    return (
      <div className="p-6 bg-green-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-green-800">Your valet has arrived!</h3>
            <p className="text-sm text-green-700">
              Your car should be ready for pickup now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-blue-500/10 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-blue-800">Valet En Route</h3>
          <p className="text-sm text-blue-700">
            Your car will arrive in
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-blue-900 mb-1">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-blue-700">
            {Math.floor(timeRemaining / 60)} minutes remaining
          </div>
        </div>
        
        {/* Progress bar with glassmorphism */}
        <div className="w-full bg-white/30 backdrop-blur-sm rounded-full h-3 border border-white/40">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        
        <div className="text-xs text-blue-600 text-center break-words bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
          Valet assigned at {assignedAt.toLocaleTimeString()}
          {etaConfig && (
            <div className="mt-1">
              ETA: {effectiveETAMinutes} min (configurable)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
