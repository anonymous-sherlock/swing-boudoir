import React from 'react';
import { Check, ChevronLeft, ChevronRight, MoveLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  scenes: string[];
  currentScene: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  scenes, 
  currentScene, 
  onNext, 
  onPrevious, 
  canGoNext, 
  canGoPrevious 
}) => {
  return (
    <div className="progress-indicator w-[85%]">
      {/* Progress Steps */}
      {scenes.map((scene, index) => (
        <React.Fragment key={index}>
          <div className={`progress-step ${index === currentScene ? 'active' : index < currentScene ? 'completed' : ''}`}>
            <div className="progress-dot">
              {index < currentScene && (
                <Check className="w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" />
              )}
            </div>
            <span className="hidden md:inline">{scene}</span>
            <span className="md:hidden">{index + 1}</span>
          </div>
          {index < scenes.length - 1 && (
            <div className={`progress-line ${index < currentScene ? 'completed' : index === currentScene ? 'active' : ''}`} />
          )}
        </React.Fragment>
      ))}

      {/* Navigation Arrows - Both on the right */}
      <div className="nav-arrows-container">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          size="icon"
          variant="ghost"
          className={cn(
            "nav-arrow-custom",
            !canGoPrevious && "nav-arrow-disabled"
          )}
          title={!canGoPrevious ? "You're at the first step" : "Go to previous step"}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          size="icon"
          variant="ghost"
          className={cn(
            "nav-arrow-custom",
            !canGoNext && "nav-arrow-disabled"
          )}
          title={!canGoNext ? "Please complete all required fields to continue" : "Go to next step"}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProgressIndicator;