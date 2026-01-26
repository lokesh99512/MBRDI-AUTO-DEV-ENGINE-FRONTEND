import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft, History, RefreshCw } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import ExecutionCard from '@/components/executions/ExecutionCard';
import ExecutionListSkeleton from '@/components/executions/ExecutionListSkeleton';
import ExecutionDetailPanel from '@/components/executions/ExecutionDetailPanel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchExecutionsRequest,
  fetchMoreExecutionsRequest,
  selectExecution,
  resetExecutions,
} from '@/features/executions/executionSlice';
import { Execution } from '@/types/execution';

const ExecutionHistoryPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const {
    executions,
    currentPage,
    totalPages,
    totalElements,
    loading,
    loadingMore,
    error,
    selectedExecution,
  } = useAppSelector((state) => state.executions);

  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial data
  useEffect(() => {
    if (projectId) {
      dispatch(fetchExecutionsRequest({ projectId }));
    }
    return () => {
      dispatch(resetExecutions());
    };
  }, [dispatch, projectId]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        !loadingMore &&
        !loading &&
        currentPage + 1 < totalPages &&
        projectId
      ) {
        dispatch(fetchMoreExecutionsRequest({ projectId, page: currentPage + 1 }));
      }
    },
    [dispatch, projectId, currentPage, totalPages, loading, loadingMore]
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleCardClick = (execution: Execution) => {
    dispatch(selectExecution(execution));
    setShowDetailPanel(true);
  };

  const handleClosePanel = () => {
    setShowDetailPanel(false);
    dispatch(selectExecution(null));
  };

  const handleRetry = () => {
    if (projectId) {
      dispatch(fetchExecutionsRequest({ projectId }));
    }
  };

  const hasMorePages = currentPage + 1 < totalPages;

  return (
    <MainLayout>
      <div className="min-vh-100 bg-light">
        <Container fluid className="py-4">
          {/* Header Section */}
          <div className="mb-4">
            <Button
              variant="outline-secondary"
              size="sm"
              className="mb-3"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={16} className="me-2" />
              Back to Projects
            </Button>

            <div className="d-flex align-items-center gap-3 mb-2">
              <History size={32} className="text-primary" />
              <div>
                <h1 className="h3 fw-bold mb-0">Project Execution History</h1>
                <p className="text-muted mb-0">
                  Project ID: <code className="bg-white px-2 py-1 rounded">{projectId}</code>
                  {totalElements > 0 && (
                    <span className="ms-2">• {totalElements} total executions</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && !loading && (
            <Alert variant="danger" className="d-flex align-items-center justify-content-between">
              <div>
                <strong>Error:</strong> {error}
              </div>
              <Button variant="danger" size="sm" onClick={handleRetry}>
                <RefreshCw size={14} className="me-1" />
                Retry
              </Button>
            </Alert>
          )}

          {/* Loading State */}
          {loading && <ExecutionListSkeleton count={4} />}

          {/* Empty State */}
          {!loading && !error && executions.length === 0 && (
            <div className="text-center py-5">
              <History size={64} className="text-muted mb-3" />
              <h4 className="text-muted">No execution history found</h4>
              <p className="text-muted">
                This project doesn't have any execution history yet.
              </p>
              <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          )}

          {/* Execution List */}
          {!loading && executions.length > 0 && (
            <div className="execution-list">
              {executions.map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  onClick={() => handleCardClick(execution)}
                />
              ))}

              {/* Load More Trigger */}
              <div ref={loadMoreTriggerRef} className="py-3">
                {loadingMore && (
                  <div className="text-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span className="text-muted">Loading more...</span>
                  </div>
                )}
                {!loadingMore && !hasMorePages && executions.length > 0 && (
                  <div className="text-center text-muted py-3">
                    <span>No more execution history</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Detail Side Panel */}
      <ExecutionDetailPanel
        execution={selectedExecution}
        show={showDetailPanel}
        onClose={handleClosePanel}
      />
    </MainLayout>
  );
};

export default ExecutionHistoryPage;
