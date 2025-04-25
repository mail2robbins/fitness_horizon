'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface WorkoutsWrapperProps {
  children: React.ReactNode;
}

export default function WorkoutsWrapper({ children }: WorkoutsWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the charts and components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner title="Workouts" subtitle="Loading your workout data..." />;
  }

  return <>{children}</>;
} 