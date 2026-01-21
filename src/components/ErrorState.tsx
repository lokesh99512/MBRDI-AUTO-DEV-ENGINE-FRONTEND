import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = "Something went wrong!",
  message = "Unable to reach Decision Management.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex h-full items-center justify-center bg-error">
      <div className="text-center">
        <h1 className="mb-2 text-xl font-semibold text-error-foreground">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <Button onClick={onRetry} className="px-8">
          Try again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
