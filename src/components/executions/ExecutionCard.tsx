import { Card, Badge } from 'react-bootstrap';
import { GitBranch, GitCommit, User, Calendar, ExternalLink } from 'lucide-react';
import { Execution, ExecutionStatus } from '@/types/execution';
import { format } from 'date-fns';

interface ExecutionCardProps {
  execution: Execution;
  onClick?: () => void;
}

const statusConfig: Record<ExecutionStatus, { variant: string; className: string }> = {
  SUCCESS: { variant: 'success', className: 'bg-success' },
  FAILED: { variant: 'danger', className: 'bg-danger' },
  RUNNING: { variant: 'warning', className: 'bg-warning text-dark' },
};

const ExecutionCard = ({ execution, onClick }: ExecutionCardProps) => {
  const statusStyle = statusConfig[execution.status] || statusConfig.RUNNING;
  const formattedDate = format(new Date(execution.createdAt), 'MMM dd, yyyy HH:mm');
  const truncatedPrompt = execution.prompt.length > 120 
    ? `${execution.prompt.substring(0, 120)}...` 
    : execution.prompt;

  return (
    <Card 
      className="mb-3 border-0 shadow-sm hover-shadow transition-all"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Body className="p-4">
        {/* Top Row - Status Badge */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <GitBranch size={16} className="text-muted" />
            <code className="small bg-light px-2 py-1 rounded">{execution.executionBranch}</code>
          </div>
          <Badge className={statusStyle.className}>{execution.status}</Badge>
        </div>

        {/* Branch Info */}
        <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
          <GitCommit size={14} />
          <span>Base: <code className="bg-light px-1 rounded">{execution.baseBranch}</code></span>
        </div>

        {/* Prompt Preview */}
        <div className="mb-3">
          <div className="fw-semibold small text-muted mb-1">Prompt</div>
          <p className="mb-0 text-dark" style={{ lineHeight: 1.5 }}>{truncatedPrompt}</p>
        </div>

        {/* LLM Response Summary */}
        {execution.llmResponseSummary && (
          <div className="mb-3 p-3 bg-light rounded">
            <div className="fw-semibold small text-muted mb-1">LLM Response</div>
            <p className="mb-0 small text-secondary">{execution.llmResponseSummary}</p>
          </div>
        )}

        {/* Error Message */}
        {execution.status === 'FAILED' && execution.errorMessage && (
          <div className="mb-3 p-3 bg-danger bg-opacity-10 border border-danger rounded">
            <div className="fw-semibold small text-danger mb-1">Error</div>
            <p className="mb-0 small text-danger">{execution.errorMessage}</p>
          </div>
        )}

        {/* Meta Info Row */}
        <div className="d-flex flex-wrap gap-3 pt-3 border-top text-muted small">
          <div className="d-flex align-items-center gap-1">
            <User size={14} />
            <span>User ID: {execution.userId}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          {execution.gitRepoUrl && (
            <a 
              href={execution.gitRepoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="d-flex align-items-center gap-1 text-primary text-decoration-none"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              <span>Repository</span>
            </a>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExecutionCard;
