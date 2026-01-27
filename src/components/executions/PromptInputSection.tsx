import { useState } from 'react';
import { Send, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

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
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Enter Your Prompt</h3>
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            className="gap-2 opacity-50"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        
        <Textarea
          placeholder="Describe what you want to generate... (e.g., 'Generate login API with JWT authentication')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px] resize-none mb-3 text-sm"
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd> to submit
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Execute Prompt
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptInputSection;
