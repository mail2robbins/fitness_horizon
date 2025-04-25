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
    <div className="space-y-4">
      {goals.map((goal) => (
        <div
          key={goal.id}
          className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600"
        >
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{goal.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{goal.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Target Date: {new Date(goal.endDate).toLocaleDateString()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              goal.completed 
                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
            }`}>
              {goal.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 