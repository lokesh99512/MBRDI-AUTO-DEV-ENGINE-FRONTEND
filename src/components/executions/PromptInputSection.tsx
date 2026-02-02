import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PromptInputSectionProps {
  onSubmit: (prompt: string) => void;
  isSubmitting: boolean;
}

const PromptInputSection = ({ onSubmit, isSubmitting }: PromptInputSectionProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim() && !isSubmitting) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <Textarea
          placeholder="Type your prompt here... (Press Enter to send)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[56px] max-h-[200px] resize-none pr-4 text-sm bg-background border-border focus-visible:ring-primary"
          disabled={isSubmitting}
          rows={1}
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isSubmitting}
        size="icon"
        className="h-[56px] w-[56px] rounded-xl flex-shrink-0"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default PromptInputSection;
