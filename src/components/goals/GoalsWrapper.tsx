'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import GoalsList from './GoalsList';
import { Goal } from '@/types/prisma';

interface GoalsWrapperProps {
  goals: Goal[];
}

export default function GoalsWrapper({ goals }: GoalsWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner title="Goals" subtitle="Loading your goals..." />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Goals
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
          Track and manage your fitness goals
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Your Goals
          </h2>
          <a
            href="/goals/new"
            className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Add New Goal
          </a>
        </div>

        <GoalsList goals={goals} />
      </div>
    </div>
  );
} 