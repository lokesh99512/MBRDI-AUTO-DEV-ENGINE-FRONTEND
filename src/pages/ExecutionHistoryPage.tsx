 import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 import { Loader2, Bot, User, Home, GitBranch, CheckCircle2, XCircle, Clock, Radio } from 'lucide-react';

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
   startStreaming,
   addStreamMessage,
   stopStreaming,
   updateExecutionStatus,
} from '@/features/executions/executionSlice';
 import { executionStreamService } from '@/services/executionStreamService';
 import { StreamMessage } from '@/types/execution';

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
     streamingMessages,
     isStreaming,
     streamingExecutionId,
  } = useAppSelector((state) => state.executions);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const initialLoadDone = useRef(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Reverse executions for chat display (oldest first, newest at bottom)
  const reversedExecutions = [...executions].reverse();
   
   // Find any RUNNING execution to connect SSE
   const runningExecution = useMemo(() => {
     return executions.find(e => e.status === 'RUNNING');
   }, [executions]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (projectId) {
      setIsInitialLoading(true);
      dispatch(fetchExecutionsRequest({ projectId }));
    }
    return () => {
      dispatch(resetExecutions());
       executionStreamService.disconnect();
    };
  }, [dispatch, projectId]);

  /* ================= HANDLE INITIAL LOAD COMPLETE ================= */
  useEffect(() => {
    if (!loading && isInitialLoading) {
      setIsInitialLoading(false);
      // Scroll to bottom after initial load
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
        initialLoadDone.current = true;
      }, 100);
    }
  }, [loading, isInitialLoading]);

 /* ================= SSE STREAMING FOR RUNNING EXECUTION ================= */
  useEffect(() => {
   // Only connect if there's a running execution and we're not already streaming it
   if (!runningExecution || isInitialLoading) return;
   
   // Already streaming this execution
   if (executionStreamService.isConnected(runningExecution.id)) return;
   
   console.log('[SSE] Found RUNNING execution, connecting:', runningExecution.id);
   dispatch(startStreaming({ executionId: runningExecution.id }));
   
   executionStreamService.connect(runningExecution.id, {
     onOpen: () => {
       console.log('[SSE] Stream opened for execution:', runningExecution.id);
     },
     onMessage: (message: string) => {
       const streamMsg: StreamMessage = {
         id: `${runningExecution.id}-${Date.now()}`,
         executionId: runningExecution.id,
         message,
         timestamp: new Date().toISOString(),
       };
       dispatch(addStreamMessage(streamMsg));
       
       // Auto scroll to bottom when new message arrives
       setTimeout(() => {
         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
       }, 50);
     },
     onComplete: () => {
       console.log('[SSE] Execution completed:', runningExecution.id);
       dispatch(updateExecutionStatus({ 
         executionId: runningExecution.id, 
         status: 'COMPLETED',
         llmResponseSummary: 'Execution completed successfully.'
       }));
       dispatch(stopStreaming());
     },
     onError: (errorMsg: string) => {
       console.error('[SSE] Stream error:', errorMsg);
       dispatch(updateExecutionStatus({ 
         executionId: runningExecution.id, 
         status: 'FAILED' 
       }));
       dispatch(stopStreaming());
     },
   });
   
   return () => {
     // Don't disconnect on every re-render, only on unmount
   };
 }, [dispatch, runningExecution, isInitialLoading]);
 
 // Cleanup SSE on unmount
 useEffect(() => {
   return () => {
     executionStreamService.disconnect();
   };
 }, []);

  /* ================= AUTO SCROLL ON NEW MESSAGE ================= */
  useEffect(() => {
    if (creating && initialLoadDone.current) {
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
    if (projectId) {
      setIsInitialLoading(true);
      dispatch(fetchExecutionsRequest({ projectId }));
    }
  };

  const handlePromptSubmit = (prompt: string) => {
    if (projectId) {
      dispatch(createExecutionRequest({ projectId, data: { projectId: Number(projectId), prompt } }));
      // Scroll to bottom when submitting
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const hasMorePages = currentPage + 1 < totalPages;

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    if (status === 'FAILED') return <XCircle className="h-3.5 w-3.5 text-destructive" />;
 if (status === 'RUNNING') return <Loader2 className="h-3.5 w-3.5 text-accent-foreground animate-spin" />;
    return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted/20">
      
      {/* HEADER */}
      <header className="flex-shrink-0 h-14 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center px-4 gap-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2 hover:bg-primary/10"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex-1 flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">AutoDev Chat</span>
            <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
              Project #{projectId} • {totalElements} executions
            </span>
          </div>
        </div>

        {error && (
           <Button size="sm" variant="outline" onClick={handleRetry} className="gap-2">
             Retry
           </Button>
        )}
         
         {isStreaming && (
           <div className="flex items-center gap-2 text-xs text-primary">
             <Radio className="h-3 w-3 animate-pulse" />
             <span className="hidden sm:inline">Live</span>
           </div>
         )}
      </header>

      {/* ERROR ALERT */}
      {error && !isInitialLoading && (
        <div className="flex-shrink-0 px-4 pt-3">
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* CHAT MESSAGES AREA */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          
          {/* LOAD MORE TRIGGER (at top) */}
          {hasMorePages && (
            <div ref={loadMoreTriggerRef} className="text-center py-3">
              {loadingMore ? (
                <div className="inline-flex items-center gap-2 text-muted-foreground text-xs bg-muted/50 px-4 py-2 rounded-full">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading older messages...
                </div>
              ) : (
                <span className="text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
                  Scroll up for more
                </span>
              )}
            </div>
          )}

          {/* INITIAL LOADING STATE */}
          {isInitialLoading && (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  </div>
                </div>
                <span className="text-sm font-medium">Loading chat history...</span>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isInitialLoading && executions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                Type a prompt below to start generating code. AutoDev will process your request and show the results here.
              </p>
            </div>
          )}

          {/* CHAT MESSAGES */}
          {!isInitialLoading && reversedExecutions.map((execution) => (
            <div key={execution.id} className="space-y-4 animate-in fade-in-0 duration-300">
              
              {/* USER MESSAGE */}
              <div className="flex justify-end">
                <div className="flex items-end gap-3 max-w-[85%]">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{execution.prompt}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">
                      {format(new Date(execution.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary shadow-sm flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* AI RESPONSE */}
              <div className="flex justify-start">
                <div className="flex items-end gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-card border shadow-sm flex items-center justify-center">
                    <Bot className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     {execution.status !== 'RUNNING' && (
                       <div
                         className={`px-4 py-3 rounded-2xl rounded-bl-md shadow-sm ${
                           execution.status === 'FAILED'
                             ? 'bg-destructive/10 border border-destructive/20'
                             : 'bg-card border'
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
                     )}
                     {execution.status === 'RUNNING' && streamingMessages.length === 0 && (
                       <div className="px-4 py-3 rounded-2xl rounded-bl-md shadow-sm bg-card border">
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>Processing your request...</span>
                         </div>
                       </div>
                     )}
                     {execution.status !== 'RUNNING' && (
                       <div className="flex items-center gap-2 px-1">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(execution.status)}
                      <span className={`text-[10px] font-medium ${
                           execution.status === 'COMPLETED' ? 'text-primary' : 'text-destructive'
                        }`}>
                          {execution.status}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-[10px]">•</span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        <span className="font-mono">{execution.executionBranch}</span>
                      </div>
                    </div>
                     )}
                  </div>
                </div>
              </div>

               {/* SSE Streaming Messages for RUNNING execution */}
               {execution.status === 'RUNNING' && streamingExecutionId === execution.id && streamingMessages.length > 0 && (
                 <div className="flex justify-start">
                   <div className="flex items-start gap-3 max-w-[85%]">
                     <div className="w-9 flex-shrink-0" /> {/* Spacer for alignment */}
                     <div className="flex flex-col gap-2 w-full">
                       {streamingMessages.map((msg) => (
                         <div
                           key={msg.id}
                           className="px-3 py-2 rounded-lg bg-accent/50 border text-sm text-foreground animate-in fade-in-0 slide-in-from-left-2 duration-200"
                         >
                           {msg.message}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               )}
               
            </div>
          ))}

          {/* CREATING INDICATOR */}
          {creating && (
            <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="flex items-end gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-card border shadow-sm flex items-center justify-center">
                  <Bot className="h-4 w-4 text-foreground" />
                </div>
                <div className="bg-card border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} className="h-1" />
        </div>
      </div>

      {/* CHAT INPUT (FIXED AT BOTTOM) */}
      <div className="flex-shrink-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <PromptInputSection onSubmit={handlePromptSubmit} isSubmitting={creating} />
        </div>
      </div>

    </div>
  );
};

export default ExecutionHistoryPage;
