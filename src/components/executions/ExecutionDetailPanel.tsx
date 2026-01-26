import { Offcanvas, Badge } from 'react-bootstrap';
import { GitBranch, GitCommit, User, Calendar, ExternalLink, X } from 'lucide-react';
import { Execution, ExecutionStatus } from '@/types/execution';
import { format } from 'date-fns';

interface ExecutionDetailPanelProps {
  execution: Execution | null;
  show: boolean;
  onClose: () => void;
}

const statusConfig: Record<ExecutionStatus, { variant: string; className: string }> = {
  SUCCESS: { variant: 'success', className: 'bg-success' },
  FAILED: { variant: 'danger', className: 'bg-danger' },
  RUNNING: { variant: 'warning', className: 'bg-warning text-dark' },
};

const ExecutionDetailPanel = ({ execution, show, onClose }: ExecutionDetailPanelProps) => {
  if (!execution) return null;

  const statusStyle = statusConfig[execution.status] || statusConfig.RUNNING;
  const formattedDate = format(new Date(execution.createdAt), 'MMM dd, yyyy HH:mm:ss');
  const updatedDate = format(new Date(execution.updatedAt), 'MMM dd, yyyy HH:mm:ss');

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: '500px' }}>
      <Offcanvas.Header className="border-bottom">
        <Offcanvas.Title className="d-flex align-items-center gap-2">
          <span>Execution Details</span>
          <Badge className={statusStyle.className}>{execution.status}</Badge>
        </Offcanvas.Title>
        <button 
          type="button" 
          className="btn btn-sm btn-light" 
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Execution ID */}
        <div className="mb-4">
          <div className="small text-muted mb-1">Execution ID</div>
          <div className="fw-semibold">#{execution.id}</div>
        </div>

        {/* Branch Info */}
        <div className="mb-4 p-3 bg-light rounded">
          <div className="d-flex align-items-center gap-2 mb-2">
            <GitBranch size={16} className="text-primary" />
            <span className="fw-semibold">Branch Information</span>
          </div>
          <div className="small">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Execution Branch:</span>
              <code>{execution.executionBranch}</code>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Base Branch:</span>
              <code>{execution.baseBranch}</code>
            </div>
          </div>
        </div>

        {/* Full Prompt */}
        <div className="mb-4">
          <div className="small text-muted mb-2 fw-semibold">Full Prompt</div>
          <div className="p-3 bg-light rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>{execution.prompt}</p>
          </div>
        </div>

        {/* Full LLM Response */}
        {execution.llmResponseSummary && (
          <div className="mb-4">
            <div className="small text-muted mb-2 fw-semibold">LLM Response Summary</div>
            <div className="p-3 bg-primary bg-opacity-10 rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>{execution.llmResponseSummary}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {execution.status === 'FAILED' && execution.errorMessage && (
          <div className="mb-4">
            <div className="small text-danger mb-2 fw-semibold">Error Message</div>
            <div className="p-3 bg-danger bg-opacity-10 border border-danger rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <p className="mb-0 small text-danger" style={{ whiteSpace: 'pre-wrap' }}>{execution.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="border-top pt-3">
          <div className="small text-muted mb-2 fw-semibold">Metadata</div>
          <div className="d-flex flex-column gap-2 small">
            <div className="d-flex align-items-center gap-2">
              <User size={14} className="text-muted" />
              <span>User ID: {execution.userId}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Calendar size={14} className="text-muted" />
              <span>Created: {formattedDate}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Calendar size={14} className="text-muted" />
              <span>Updated: {updatedDate}</span>
            </div>
            {execution.gitRepoUrl && (
              <a 
                href={execution.gitRepoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2 text-primary text-decoration-none"
              >
                <ExternalLink size={14} />
                <span>View Repository</span>
              </a>
            )}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ExecutionDetailPanel;
