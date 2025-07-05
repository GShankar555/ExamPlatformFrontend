import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        if (newTime <= 300 && !isWarning) { // 5 minutes warning
          setIsWarning(true);
        }
        
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp, isWarning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerStyle = () => {
    if (timeLeft <= 60) return 'text-red-600 bg-red-50'; // Last minute
    if (timeLeft <= 300) return 'text-amber-600 bg-amber-50'; // Last 5 minutes
    return 'text-gray-700 bg-gray-50';
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-mono text-sm font-semibold ${getTimerStyle()}`}>
      {isWarning ? (
        <AlertTriangle className="h-4 w-4 animate-pulse" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;