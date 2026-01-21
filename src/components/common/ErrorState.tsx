import { Button } from 'react-bootstrap';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong!',
  message = 'Unable to reach the server. Please try again.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <div 
      className="d-flex align-items-center justify-content-center h-100"
      style={{ 
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        minHeight: '400px'
      }}
    >
      <div className="text-center">
        <i className="bi bi-exclamation-circle text-danger fs-1 mb-3 d-block"></i>
        <h4 className="text-danger mb-2">{title}</h4>
        <p className="text-muted mb-4">{message}</p>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
