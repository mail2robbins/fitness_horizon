'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface MealsWrapperProps {
  children: React.ReactNode;
}

export default function MealsWrapper({ children }: MealsWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the charts and components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner title="Meals" subtitle="Loading your meal data..." />;
  }

  return <>{children}</>;
} 