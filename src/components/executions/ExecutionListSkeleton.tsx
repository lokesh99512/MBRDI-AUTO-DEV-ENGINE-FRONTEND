import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ExecutionListSkeletonProps {
  count?: number;
}

const ExecutionListSkeleton = ({ count = 3 }: ExecutionListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="bg-card">
          <CardContent className="p-5">
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Branch Info */}
            <div className="mb-4">
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Prompt */}
            <div className="mb-4">
              <Skeleton className="h-3 w-12 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>

            {/* LLM Response */}
            <div className="mb-4">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Meta Info */}
            <div className="flex gap-4 pt-4 border-t">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExecutionListSkeleton;
