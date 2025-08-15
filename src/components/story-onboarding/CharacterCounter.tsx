import React from 'react';

interface CharacterCounterProps {
  current: number;
  min?: number;
  max: number;
  className?: string;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({ current, min, max, className = '' }) => {
  const getStatus = () => {
    if (min && current < min) {
      return { color: 'text-red-50', bg: 'bg-red-500/20 backdrop-blur-xl', text: `${min - current} more needed` };
    }
    if (current > max * 0.9) {
      return { color: 'text-orange-500', bg: 'bg-gray-500/20 backdrop-blur-xl', text: `${max - current} left` };
    }
    return { color: 'text-gray-500', bg: 'bg-gray-500/20 backdrop-blur-xl', text: `${current}/${max}` };
  };

  const status = getStatus();

  return (
    <div className={`${status.bg} px-2 py-1 rounded text-xs font-medium ${status.color} ${className}`}>
      {status.text}
    </div>
  );
};

export default CharacterCounter;