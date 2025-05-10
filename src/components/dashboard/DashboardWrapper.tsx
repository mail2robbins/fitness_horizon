'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardStats from './DashboardStats';
import RecentWorkouts from './RecentWorkouts';
import RecentMeals from './RecentMeals';
import GoalsProgress from './GoalsProgress';
import ActivityChart from './ActivityChart';

interface UserProfile {
  id: string;
  userId: string;
  name: string | null;
  bio: string | null;
  streakDays: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: string;
  target: number;
  current: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserWorkout {
  id: string;
  userId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
  caloriesBurned: number;
  notes: string | null;
  completedAt: Date;
}

interface UserMeal {
  id: string;
  userId: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string | null;
  consumedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkoutByDay {
  date: string;
  count: number;
}

interface User {
  profile: UserProfile | null;
  goals: UserGoal[];
  workouts: UserWorkout[];
  meals: UserMeal[];
}

interface DashboardWrapperProps {
  user: User;
  totalWorkouts: number;
  totalCalories: number;
  totalCaloriesConsumed: number;
  workoutsByDay: WorkoutByDay[];
  streak: number;
}

export default function DashboardWrapper({ 
  user, 
  totalWorkouts, 
  totalCalories, 
  totalCaloriesConsumed,
  workoutsByDay,
  streak
}: DashboardWrapperProps) {
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
          totalCaloriesConsumed={totalCaloriesConsumed}
          streak={streak}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <ActivityChart workouts={workoutsByDay} />
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