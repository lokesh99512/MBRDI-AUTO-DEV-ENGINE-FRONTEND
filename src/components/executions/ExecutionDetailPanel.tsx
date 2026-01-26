import { GitBranch, GitCommit, User, Calendar, ExternalLink, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Execution, ExecutionStatus } from '@/types/execution';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExecutionDetailPanelProps {
  execution: Execution | null;
  show: boolean;
  onClose: () => void;
}

const statusConfig: Record<ExecutionStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string; label: string; icon: React.ReactNode }> = {
  SUCCESS: { variant: 'default', className: 'bg-green-500 hover:bg-green-500/80', label: 'Success', icon: <CheckCircle className="h-4 w-4" /> },
  FAILED: { variant: 'destructive', className: '', label: 'Failed', icon: <AlertCircle className="h-4 w-4" /> },
  RUNNING: { variant: 'secondary', className: 'bg-amber-500 text-white hover:bg-amber-500/80', label: 'Running', icon: <Loader className="h-4 w-4 animate-spin" /> },
};

const ExecutionDetailPanel = ({ execution, show, onClose }: ExecutionDetailPanelProps) => {
  if (!execution) return null;

  const statusStyle = statusConfig[execution.status] || statusConfig.RUNNING;
  const formattedCreated = format(new Date(execution.createdAt), 'PPpp');
  const formattedUpdated = format(new Date(execution.updatedAt), 'PPpp');

  return (
    <Sheet open={show} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Execution Details</SheetTitle>
            <Badge variant={statusStyle.variant} className={cn('gap-1.5', statusStyle.className)}>
              {statusStyle.icon}
              {statusStyle.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Execution ID: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">#{execution.id}</code>
          </p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Branch Information */}
            <div>
              <h6 className="text-sm font-medium text-foreground mb-3">Branch Information</h6>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Execution:</span>
                  <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{execution.executionBranch}</code>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Base:</span>
                  <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{execution.baseBranch}</code>
                </div>
              </div>
            </div>

            <Separator />

            {/* Prompt */}
            <div>
              <h6 className="text-sm font-medium text-foreground mb-3">Prompt</h6>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{execution.prompt}</p>
              </div>
            </div>

            <Separator />

            {/* LLM Response Summary */}
            {execution.llmResponseSummary && (
              <>
                <div>
                  <h6 className="text-sm font-medium text-foreground mb-3">LLM Response Summary</h6>
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{execution.llmResponseSummary}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Error Message */}
            {execution.status === 'FAILED' && execution.errorMessage && (
              <>
                <div>
                  <h6 className="text-sm font-medium text-destructive mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Error Message
                  </h6>
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive whitespace-pre-wrap">{execution.errorMessage}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Metadata */}
            <div>
              <h6 className="text-sm font-medium text-foreground mb-3">Metadata</h6>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="text-foreground">{execution.userId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground">{formattedCreated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-foreground">{formattedUpdated}</span>
                </div>
                {execution.gitRepoUrl && (
                  <a
                    href={execution.gitRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ExecutionDetailPanel;
