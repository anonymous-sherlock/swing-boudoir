import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  lastVoteAt: string;
  onAvailabilityChange: (canVote: boolean) => void;
}

// Utility function to calculate time remaining for next vote
const getTimeRemainingForNextVote = (lastVoteAt: string): { canVote: boolean; timeRemaining: string } => {
  const lastVote = new Date(lastVoteAt);
  const now = new Date();
  const timeDiff = now.getTime() - lastVote.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff >= 24) {
    return { canVote: true, timeRemaining: "" };
  }

  const remainingHours = 24 - hoursDiff;
  const hours = Math.floor(remainingHours);
  const minutes = Math.floor((remainingHours - hours) * 60);
  const seconds = Math.floor(((remainingHours - hours) * 60 - minutes) * 60);

  let timeRemaining = "";
  if (hours > 0) {
    timeRemaining = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    timeRemaining = `${minutes}m ${seconds}s`;
  } else {
    timeRemaining = `${seconds}s`;
  }

  return { canVote: false, timeRemaining };
};

const CountdownTimer = ({ lastVoteAt, onAvailabilityChange }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [canVote, setCanVote] = useState(false);

  useEffect(() => {
    // Initial check
    const checkAvailability = () => {
      const { canVote: available, timeRemaining: remaining } = getTimeRemainingForNextVote(lastVoteAt);
      setCanVote(available);
      setTimeRemaining(remaining);
      onAvailabilityChange(available);
    };

    checkAvailability();

    // Set up interval for countdown
    const interval = setInterval(() => {
      const { canVote: available, timeRemaining: remaining } = getTimeRemainingForNextVote(lastVoteAt);
      setCanVote(available);
      setTimeRemaining(remaining);
      onAvailabilityChange(available);
      
      // Clear interval when vote becomes available
      if (available) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastVoteAt, onAvailabilityChange]);

  if (canVote) {
    return null; // Don't render anything when vote is available
  }

  return (
    <div className="flex items-center space-x-1 mt-1">
      <Clock className="w-3 h-3 text-gray-500" />
      <p className="text-gray-500 text-sm">Next vote in {timeRemaining}</p>
    </div>
  );
};

export default CountdownTimer;
