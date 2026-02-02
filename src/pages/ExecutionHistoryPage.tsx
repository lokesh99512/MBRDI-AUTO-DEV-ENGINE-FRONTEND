import { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Loader2, Bot, User, Home } from 'lucide-react';

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

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const initialScrollDone = useRef(false);

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

  /* ================= SCROLL TO BOTTOM ON INITIAL LOAD ================= */
  useEffect(() => {
    if (!loading && executions.length > 0 && !initialScrollDone.current) {
      // Scroll to bottom instantly on initial load
      chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
      initialScrollDone.current = true;
    }
  }, [loading, executions]);

  /* ================= AUTO SCROLL ON NEW MESSAGE ================= */
  useEffect(() => {
    if (creating || (initialScrollDone.current && executions.length > 0)) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [creating]);

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
    <div className="flex flex-col h-screen bg-background">
      
      {/* MINIMAL HEADER - NO SIDEBAR */}
      <header className="flex-shrink-0 h-14 border-b bg-card flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex-1 flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">AutoDev Chat</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Project #{projectId} • {totalElements} executions
          </span>
        </div>

        {error && (
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </header>

      {/* ERROR ALERT */}
      {error && !loading && (
        <div className="flex-shrink-0 px-4 pt-3">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* CHAT MESSAGES AREA */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          
          {/* LOAD MORE TRIGGER (at top) */}
          {hasMorePages && (
            <div ref={loadMoreTriggerRef} className="text-center py-2">
              {loadingMore ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading older messages...
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Scroll up for more</span>
              )}
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Loading chat history...</span>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && executions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Bot className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Type a prompt below to start generating code. AutoDev will process your request and show the results here.
              </p>
            </div>
          )}

          {/* CHAT MESSAGES */}
          {!loading && reversedExecutions.map((execution) => (
            <div key={execution.id} className="space-y-4">
              
              {/* USER MESSAGE */}
              <div className="flex justify-end">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{execution.prompt}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(execution.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* AI RESPONSE */}
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
                        execution.status === 'FAILED'
                          ? 'bg-destructive/10 border border-destructive/30'
                          : 'bg-muted'
                      }`}
                    >
                      {execution.status === 'COMPLETED' && (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                          {execution.llmResponseSummary || 'Execution completed successfully.'}
                        </p>
                      )}
                      {execution.status === 'FAILED' && (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-destructive">
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
                      <span className="text-[10px] text-muted-foreground">
                        • {execution.executionBranch}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* CREATING INDICATOR */}
          {creating && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 text-foreground" />
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* CHAT INPUT (FIXED AT BOTTOM) */}
      <div className="flex-shrink-0 border-t bg-card/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <PromptInputSection onSubmit={handlePromptSubmit} isSubmitting={creating} />
        </div>
      </div>

    </div>
  );
};

export default ExecutionHistoryPage;
