import MainLayout from "@/components/layout/MainLayout";
import ErrorState from "@/components/ErrorState";

const Index = () => {
  const handleRetry = () => {
    console.log("Retrying...");
    // Add retry logic here
  };

  return (
    <MainLayout>
      <ErrorState onRetry={handleRetry} />
    </MainLayout>
  );
};

export default Index;
