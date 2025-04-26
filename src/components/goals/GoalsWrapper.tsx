'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import GoalsList from './GoalsList';
import { Goal } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function GoalsWrapper() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/goals');
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchGoals();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">Please sign in to view your goals</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner title="Goals" subtitle="Loading your goals..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Your Goals
          </h2>
          <Link
            href="/goals/new"
            className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Add New Goal
          </Link>
        </div>

        <GoalsList goals={goals} />
      </div>
    </div>
  );
} 