import { Card } from 'react-bootstrap';
import { Skeleton } from '@/components/ui/skeleton';

interface ExecutionListSkeletonProps {
  count?: number;
}

const ExecutionListSkeleton = ({ count = 3 }: ExecutionListSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="mb-3 border-0 shadow-sm">
          <Card.Body className="p-4">
            {/* Top Row */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Branch Info */}
            <div className="mb-3">
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Prompt */}
            <div className="mb-3">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>

            {/* LLM Response */}
            <div className="mb-3">
              <Skeleton className="h-12 w-full" />
            </div>

            {/* Meta Info */}
            <div className="d-flex gap-3 pt-3 border-top">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default ExecutionListSkeleton;
