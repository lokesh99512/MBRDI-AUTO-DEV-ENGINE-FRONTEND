import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, RefreshCw, Loader2 } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import ExecutionCard from '@/components/executions/ExecutionCard';
import ExecutionListSkeleton from '@/components/executions/ExecutionListSkeleton';
import ExecutionDetailPanel from '@/components/executions/ExecutionDetailPanel';
import PromptInputSection from '@/components/executions/PromptInputSection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchExecutionsRequest,
  fetchMoreExecutionsRequest,
  createExecutionRequest,
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
    creating,
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

  const handlePromptSubmit = (prompt: string) => {
    if (projectId) {
      dispatch(createExecutionRequest({ projectId, data: { prompt } }));
    }
  };

  const hasMorePages = currentPage + 1 < totalPages;

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Header Section */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Project Execution History</h1>
                <p className="text-muted-foreground text-sm">
                  Project ID: <code className="bg-muted px-2 py-0.5 rounded text-xs">{projectId}</code>
                  {totalElements > 0 && (
                    <span className="ml-2">• {totalElements} total executions</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Prompt Input Section */}
          <div className="mb-6">
            <PromptInputSection 
              onSubmit={handlePromptSubmit} 
              isSubmitting={creating} 
            />
          </div>

          {/* Error State */}
          {error && !loading && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="flex items-center justify-between">
                <span><strong>Error:</strong> {error}</span>
                <Button variant="destructive" size="sm" onClick={handleRetry}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && <ExecutionListSkeleton count={4} />}

          {/* Empty State */}
          {!loading && !error && executions.length === 0 && (
            <div className="text-center py-16 bg-card rounded-lg border">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <History className="h-12 w-12 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium text-muted-foreground mb-2">No execution history found</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Enter a prompt above to start your first execution.
              </p>
            </div>
          )}

          {/* Execution List */}
          {!loading && executions.length > 0 && (
            <div className="space-y-4">
              {executions.map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  onClick={() => handleCardClick(execution)}
                />
              ))}

              {/* Load More Trigger */}
              <div ref={loadMoreTriggerRef} className="py-4">
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                )}
                {!loadingMore && !hasMorePages && executions.length > 0 && (
                  <div className="text-center text-muted-foreground text-sm py-2">
                    No more execution history
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
