import { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, RefreshCw, Loader2, Bot, User } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import PromptInputSection from '@/components/executions/PromptInputSection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { format } from 'date-fns';
import {
  fetchExecutionsRequest,
  fetchMoreExecutionsRequest,
  createExecutionRequest,
  resetExecutions,
} from '@/features/executions/executionSlice';

const POLLING_INTERVAL = 5000;

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

  // Reverse executions for chat display (oldest first, newest at bottom)
  const reversedExecutions = [...executions].reverse();

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

  /* ================= AUTO SCROLL TO BOTTOM ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [executions, creating]);

  /* ================= INFINITE SCROLL (load older) ================= */
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
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
        
        {/* HEADER */}
        <div className="flex-shrink-0 border-b bg-card px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AutoDev Chat</h1>
                  <p className="text-xs text-muted-foreground">
                    Project #{projectId} • {totalElements} executions
                  </p>
                </div>
              </div>
            </div>
            {error && (
              <Button size="sm" variant="outline" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>

        {/* ERROR ALERT */}
        {error && !loading && (
          <div className="flex-shrink-0 px-6 pt-4">
            <div className="max-w-4xl mx-auto">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* CHAT MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* LOAD MORE TRIGGER (at top) */}
            {hasMorePages && (
              <div ref={loadMoreTriggerRef} className="text-center py-4">
                {loadingMore ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading older messages...
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Load more
                  </Button>
                )}
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm">Loading chat history...</span>
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && executions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Bot className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No executions yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Start by typing a prompt below. AutoDev will generate code based on your instructions.
                </p>
              </div>
            )}

            {/* CHAT MESSAGES */}
            {!loading && reversedExecutions.map((execution) => (
              <div key={execution.id} className="space-y-3">
                
                {/* USER MESSAGE */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex flex-col items-end gap-1 max-w-[80%]">
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-md shadow-sm">
                      <p className="text-sm whitespace-pre-wrap">{execution.prompt}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">
                      {format(new Date(execution.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </div>

                {/* AI RESPONSE */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div
                      className={`px-4 py-3 rounded-2xl rounded-tl-md shadow-sm ${
                        execution.status === 'FAILED'
                          ? 'bg-destructive/10 border border-destructive/20 text-destructive'
                          : 'bg-card border'
                      }`}
                    >
                      {execution.status === 'COMPLETED' && (
                        <p className="text-sm whitespace-pre-wrap text-foreground">
                          {execution.llmResponseSummary || 'Execution completed successfully.'}
                        </p>
                      )}
                      {execution.status === 'FAILED' && (
                        <p className="text-sm whitespace-pre-wrap">
                          {execution.errorMessage || 'Execution failed.'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className={`text-[10px] font-medium ${
                        execution.status === 'COMPLETED' ? 'text-green-600' : 'text-destructive'
                      }`}>
                        {execution.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">
                        {execution.executionBranch}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}

            {/* CREATING INDICATOR */}
            {creating && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-card border px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Generating response...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* CHAT INPUT (FIXED AT BOTTOM) */}
        <div className="flex-shrink-0 border-t bg-card px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <PromptInputSection onSubmit={handlePromptSubmit} isSubmitting={creating} />
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ExecutionHistoryPage;
