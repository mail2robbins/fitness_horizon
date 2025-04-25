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
    <div className={`bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'} flex flex-col items-center justify-center`}>
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 dark:border-gray-700"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 dark:border-indigo-400"></div>
      </div>
      {title && (
        <h2 className="mt-4 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
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