'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardStats from './DashboardStats';
import RecentWorkouts from './RecentWorkouts';
import RecentMeals from './RecentMeals';
import GoalsProgress from './GoalsProgress';
import ActivityChart from './ActivityChart';

interface DashboardWrapperProps {
  user: any;
  totalWorkouts: number;
  totalCalories: number;
}

export default function DashboardWrapper({ user, totalWorkouts, totalCalories }: DashboardWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the charts and components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner title="Dashboard" subtitle="Loading your fitness data..." />;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <DashboardStats
          totalWorkouts={totalWorkouts}
          totalCaloriesBurned={totalCalories}
          totalCaloriesConsumed={0} // TODO: Add actual calories consumed
          streak={user.profile?.streakDays || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <ActivityChart workouts={user.workouts} />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <GoalsProgress goals={user.goals} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <RecentWorkouts workouts={user.workouts} />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <RecentMeals meals={user.meals} />
        </div>
      </div>
    </div>
  );
} 