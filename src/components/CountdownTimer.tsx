
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { updateTicketStatus } from '../services/firestore';
import { useToast } from '@/hooks/use-toast';

interface CountdownTimerProps {
  etaMinutes: number;
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
  const { toast } = useToast();

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const assigned = assignedAt.getTime();
      const etaTime = assigned + (etaMinutes * 60 * 1000);
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
  }, [etaMinutes, assignedAt, isComplete, onComplete, ticketId, hasAutoUpgraded, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = etaMinutes * 60;
    const elapsed = totalSeconds - timeRemaining;
    return Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
  };

  if (isComplete) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-green-800">Your valet has arrived!</h3>
              <p className="text-sm text-green-600">
                Your car should be ready for pickup now.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-blue-800">Valet En Route</h3>
            <p className="text-sm text-blue-600">
              Your car will arrive in
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-blue-600">
              {Math.floor(timeRemaining / 60)} minutes remaining
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="text-xs text-blue-500 text-center break-words">
            Valet assigned at {assignedAt.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
