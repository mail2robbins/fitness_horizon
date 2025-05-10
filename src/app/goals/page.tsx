'use client';

import GoalsWrapper from '@/components/goals/GoalsWrapper';

export default function GoalsPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl pb-2 leading-tight font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Goals
          </h1>
          <p className="mt-1 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Track and manage your fitness goals
          </p>
        </div>

        <GoalsWrapper />
      </div>
    </div>
  );
} 