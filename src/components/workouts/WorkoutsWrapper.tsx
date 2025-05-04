'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface WorkoutsWrapperProps {
  children: React.ReactNode;
}

export default function WorkoutsWrapper({ children }: WorkoutsWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time for the charts and components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Set up an interval to refresh the data every 30 seconds
    const refreshInterval = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(refreshInterval);
    };
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner title="Workouts" subtitle="Loading your workout data..." />;
  }

  return <>{children}</>;
} 