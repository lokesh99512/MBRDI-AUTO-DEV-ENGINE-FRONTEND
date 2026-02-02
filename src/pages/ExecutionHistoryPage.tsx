import { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, RefreshCw, Loader2 } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import PromptInputSection from '@/components/executions/PromptInputSection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchExecutionsRequest,
  fetchMoreExecutionsRequest,
  createExecutionRequest,
  resetExecutions,
} from '@/features/executions/executionSlice';

const POLLING_INTERVAL = 5000; // 5 seconds

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
  } = useAppSelector((state) => state.executions);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (projectId) dispatch(fetchExecutionsRequest({ projectId }));
    return () => {
      dispatch(resetExecutions());
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [dispatch, projectId]);

  /* ================= POLLING EVERY 5 SECONDS ================= */
  useEffect(() => {
    if (!projectId) return;

    pollingRef.current = setInterval(() => {
      dispatch(fetchExecutionsRequest({ projectId }));
    }, POLLING_INTERVAL);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [dispatch, projectId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [executions, creating]);

  /* ================= INFINITE SCROLL ================= */
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
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  /* ================= ACTIONS ================= */
  const handleRetry = () => {
    if (projectId) dispatch(fetchExecutionsRequest({ projectId }));
  };

  const handlePromptSubmit = (prompt: string) => {
    if (projectId) {
      dispatch(createExecutionRequest({ projectId, data: { projectId: Number(projectId), prompt } }));
    }
  };

  const hasMorePages = currentPage + 1 < totalPages;

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-4xl">

          {/* HEADER */}
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

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Execution Chat</h1>
                <p className="text-muted-foreground text-sm">
                  Project ID: <code>{projectId}</code>
                  {totalElements > 0 && <span className="ml-2">• {totalElements} messages</span>}
                </p>
              </div>
            </div>
          </div>

          {/* PROMPT INPUT */}
          <div className="mb-4">
            <PromptInputSection onSubmit={handlePromptSubmit} isSubmitting={creating} />
          </div>

          {/* ERROR */}
          {error && !loading && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="flex justify-between items-center">
                <span><strong>Error:</strong> {error}</span>
                <Button size="sm" variant="destructive" onClick={handleRetry}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* LOADING INITIAL */}
          {loading && <div className="text-center py-10">Loading chat history...</div>}

          {/* EMPTY STATE */}
          {!loading && executions.length === 0 && (
            <div className="text-center py-16 bg-card rounded-lg border">
              No execution history yet. Start by sending a prompt 🚀
            </div>
          )}

          {/* CHAT WINDOW */}
          {!loading && executions.length > 0 && (
            <div className="bg-card border rounded-lg h-[65vh] overflow-y-auto p-4 space-y-6">

              {executions.map((execution) => (
                <div key={execution.id} className="flex flex-col gap-2">

                  {/* USER MESSAGE */}
                  <div className="flex justify-end">
                    <div className="max-w-[75%] bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow text-sm whitespace-pre-wrap">
                      {execution.prompt}
                    </div>
                  </div>

                  {/* SYSTEM MESSAGE */}
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl rounded-bl-md shadow text-sm whitespace-pre-wrap border
                        ${
                          execution.status === 'FAILED'
                            ? 'bg-destructive/10 border-destructive text-destructive'
                            : execution.status === 'COMPLETED'
                            ? 'bg-muted'
                            : 'bg-muted animate-pulse text-muted-foreground'
                        }`}
                    >
                      {execution.status === 'COMPLETED' && execution.llmResponseSummary}
                      {execution.status === 'FAILED' && execution.errorMessage}
                    </div>
                  </div>

                </div>
              ))}

              {/* Creating New Execution Bubble */}
              {creating && (
                <div className="flex justify-start">
                  <div className="max-w-[60%] bg-muted px-4 py-3 rounded-2xl rounded-bl-md animate-pulse text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Thinking...
                  </div>
                </div>
              )}

              {/* LOAD MORE TRIGGER */}
              <div ref={loadMoreTriggerRef} className="text-center text-xs text-muted-foreground py-2">
                {loadingMore && "Loading older messages..."}
                {!loadingMore && !hasMorePages && "No more history"}
              </div>

              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExecutionHistoryPage;
