import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface TourTriggerProps {
  onStartTour: () => void;
}

export const TourTrigger: React.FC<TourTriggerProps> = ({ onStartTour }) => {
  return (
    <Button
      onClick={onStartTour}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Sparkles className="w-4 h-4" />
      Take Tour
    </Button>
  );
};
