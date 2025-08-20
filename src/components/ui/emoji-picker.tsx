import * as React from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import EmojiPickerReact, { EmojiStyle, SuggestionMode } from 'emoji-picker-react';

interface EmojiPickerProps {
  value?: string;
  onEmojiSelect: (emoji: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmojiPicker({ value, onEmojiSelect, className, size = 'md' }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(sizeClasses[size], "p-0", className)}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="apple-emoji-font">
          <EmojiPickerReact
            onEmojiClick={handleEmojiSelect}
            autoFocusSearch={false}
            searchPlaceHolder="Search emojis..."
            width={350}
            height={400}
            skinTonesDisabled
            searchDisabled={false}
            emojiStyle={EmojiStyle.APPLE}
            lazyLoadEmojis={true}
            suggestedEmojisMode={SuggestionMode.RECENT}
            allowExpandReactions={false}
            previewConfig={{
              showPreview: false
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
