'use client';

import { Goal } from '@prisma/client';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

interface GoalsListProps {
  goals: Goal[];
}

export default function GoalsList({ goals }: GoalsListProps) {
  const { theme } = useTheme();

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getGoalStatus = (goal: Goal) => {
    const now = new Date();
    const endDate = new Date(goal.endDate);
    const startDate = new Date(goal.startDate);

    if (goal.completed) return 'Completed';
    if (now > endDate) return 'Expired';
    if (now < startDate) return 'Upcoming';
    return 'In Progress';
  };

  const getStatusColor = (status: string) => {
    if (theme === 'dark') {
      switch (status) {
        case 'Completed':
          return 'bg-green-900/50 text-green-300';
        case 'Expired':
          return 'bg-red-900/50 text-red-300';
        case 'Upcoming':
          return 'bg-blue-900/50 text-blue-300';
        default:
          return 'bg-yellow-900/50 text-yellow-300';
      }
    }
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">You don&apos;t have any goals yet</p>
        <Link
          href="/goals/new"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Create your first goal
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const status = getGoalStatus(goal);
        const progress = getProgressPercentage(goal.current, goal.target);
        
        return (
          <div
            key={goal.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{goal.title}</h2>
              <span
                className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}
              >
                {status}
              </span>
            </div>

            {goal.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">{goal.description}</p>
            )}

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current</p>
                <p className="font-medium text-gray-900 dark:text-white">{goal.current}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Target</p>
                <p className="font-medium text-gray-900 dark:text-white">{goal.target}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(goal.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(goal.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 