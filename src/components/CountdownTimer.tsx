
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownTimerProps {
  etaMinutes: number;
  assignedAt: Date;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  etaMinutes, 
  assignedAt, 
  onComplete 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const assigned = assignedAt.getTime();
      const etaTime = assigned + (etaMinutes * 60 * 1000);
      const remaining = Math.max(0, etaTime - now);
      
      return Math.floor(remaining / 1000); // Convert to seconds
    };

    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    };

    // Initial calculation
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [etaMinutes, assignedAt, isComplete, onComplete]);

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
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Worker Should Have Arrived!</h3>
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
          <Clock className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-800">Worker En Route</h3>
            <p className="text-sm text-blue-600">
              Estimated arrival time
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900">
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
          
          <div className="text-xs text-blue-500 text-center">
            Worker assigned at {assignedAt.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
