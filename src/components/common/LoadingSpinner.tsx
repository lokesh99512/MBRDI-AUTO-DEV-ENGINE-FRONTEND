import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | undefined;
  text?: string;
  fullPage?: boolean;
}

const LoadingSpinner = ({ size, text = 'Loading...', fullPage = false }: LoadingSpinnerProps) => {
  if (fullPage) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">{text}</span>
        </Spinner>
        <p className="mt-3 text-muted">{text}</p>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center p-4">
      <Spinner animation="border" variant="primary" size={size} role="status">
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && <span className="ms-2 text-muted">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
