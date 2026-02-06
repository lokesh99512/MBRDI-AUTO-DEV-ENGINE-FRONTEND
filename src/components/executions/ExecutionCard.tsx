 import { GitBranch, GitCommit, User, Calendar, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Execution, ExecutionStatus } from '@/types/execution';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExecutionCardProps {
  execution: Execution;
  onClick?: () => void;
}

const statusConfig: Record<ExecutionStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string; label: string; icon: React.ReactNode }> = {
  COMPLETED: { variant: 'default', className: 'bg-green-500 hover:bg-green-500/80', label: 'Completed', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  FAILED: { variant: 'destructive', className: '', label: 'Failed', icon: <XCircle className="h-3.5 w-3.5" /> },
  RUNNING: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  CREATED: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  CLONING_REPO: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  ANALYZING_CODE: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  CALLING_LLM: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  APPLYING_CHANGES: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  COMMITTING: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-500/80 text-white', label: 'Running', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
};

const ExecutionCard = ({ execution, onClick }: ExecutionCardProps) => {
  const statusStyle = statusConfig[execution.status] || statusConfig.COMPLETED;
  const formattedDate = format(new Date(execution.createdAt), 'MMM dd, yyyy HH:mm');
  const truncatedPrompt = execution.prompt.length > 120 
    ? `${execution.prompt.substring(0, 120)}...` 
    : execution.prompt;

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Top Row - Status Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{execution.executionBranch}</code>
          </div>
          <Badge variant={statusStyle.variant} className={cn('gap-1.5', statusStyle.className)}>
            {statusStyle.icon}
            {statusStyle.label}
          </Badge>
        </div>

        {/* Branch Info */}
        <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
          <GitCommit className="h-3.5 w-3.5" />
          <span>Base: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{execution.baseBranch}</code></span>
        </div>

        {/* Prompt Preview */}
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-1.5">Prompt</div>
          <p className="text-sm text-foreground leading-relaxed">{truncatedPrompt}</p>
        </div>

        {/* LLM Response Summary */}
        {execution.llmResponseSummary && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-xs font-medium text-muted-foreground mb-1">LLM Response</div>
            <p className="text-sm text-muted-foreground">{execution.llmResponseSummary}</p>
          </div>
        )}

        {/* Error Message */}
        {execution.status === 'FAILED' && execution.errorMessage && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-xs font-medium text-destructive mb-1">Error</div>
            <p className="text-sm text-destructive">{execution.errorMessage}</p>
          </div>
        )}

        {/* Meta Info Row */}
        <div className="flex flex-wrap gap-4 pt-4 border-t text-muted-foreground text-xs">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>User ID: {execution.userId}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          {execution.gitRepoUrl && (
            <a 
              href={execution.gitRepoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Repository</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutionCard;
