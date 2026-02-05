 import { API_CONFIG } from '@/config/api.config';
 
 export interface StreamCallbacks {
   onMessage: (message: string) => void;
   onError: (error: string) => void;
   onComplete: () => void;
   onOpen?: () => void;
 }
 
 class ExecutionStreamService {
   private eventSource: EventSource | null = null;
   private currentExecutionId: number | null = null;
 
   /**
    * Connect to SSE stream for a specific execution
    * GET /api/autodev/stream/{executionId}
    */
   connect(executionId: number, callbacks: StreamCallbacks): void {
     // Close existing connection if any
     this.disconnect();
 
     this.currentExecutionId = executionId;
     const token = localStorage.getItem('auth_token');
     const url = `${API_CONFIG.BASE_URL}/api/autodev/stream/${executionId}`;
 
     console.log('[SSE] Connecting to stream:', url);
 
     // Create EventSource with auth header via URL params (SSE doesn't support custom headers)
     // For auth, we'll need to pass token as query param or use cookies
     const urlWithAuth = token ? `${url}?token=${encodeURIComponent(token)}` : url;
     
     this.eventSource = new EventSource(urlWithAuth);
 
     this.eventSource.onopen = () => {
       console.log('[SSE] Connection opened for execution:', executionId);
       callbacks.onOpen?.();
     };
 
     this.eventSource.onmessage = (event) => {
       console.log('[SSE] Message received:', event.data);
       const message = event.data;
       
       // Check for completion signals
       if (message.includes('completed') || message.includes('Execution completed')) {
         callbacks.onMessage(message);
         callbacks.onComplete();
         this.disconnect();
       } else if (message.includes('failed') || message.includes('Error')) {
         callbacks.onMessage(message);
         callbacks.onError(message);
         this.disconnect();
       } else {
         callbacks.onMessage(message);
       }
     };
 
     this.eventSource.onerror = (error) => {
       console.error('[SSE] Connection error:', error);
       
       // Check if this is a normal close (readyState CLOSED = 2)
       if (this.eventSource?.readyState === EventSource.CLOSED) {
         console.log('[SSE] Stream closed normally');
         callbacks.onComplete();
       } else {
         callbacks.onError('Connection to stream lost');
       }
       
       this.disconnect();
     };
   }
 
   /**
    * Disconnect from current SSE stream
    */
   disconnect(): void {
     if (this.eventSource) {
       console.log('[SSE] Disconnecting from execution:', this.currentExecutionId);
       this.eventSource.close();
       this.eventSource = null;
       this.currentExecutionId = null;
     }
   }
 
   /**
    * Check if currently connected to a specific execution
    */
   isConnected(executionId?: number): boolean {
     if (!this.eventSource) return false;
     if (executionId !== undefined) {
       return this.currentExecutionId === executionId;
     }
     return this.eventSource.readyState === EventSource.OPEN;
   }
 
   /**
    * Get current execution ID being streamed
    */
   getCurrentExecutionId(): number | null {
     return this.currentExecutionId;
   }
 }
 
 // Export singleton instance
 export const executionStreamService = new ExecutionStreamService();
 export default executionStreamService;