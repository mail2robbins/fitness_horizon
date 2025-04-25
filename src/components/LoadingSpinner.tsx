'use client';

import { FC } from 'react';

interface LoadingSpinnerProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  title = 'Loading', 
  subtitle = 'Please wait...',
  fullScreen = false 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      {title && (
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 