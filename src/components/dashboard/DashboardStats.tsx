"use client";

import { 
  FireIcon, 
  BoltIcon, 
  ScaleIcon, 
  CalendarIcon 
} from "@heroicons/react/24/outline";

interface DashboardStatsProps {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalCaloriesConsumed: number;
  streakDays: number;
}

export default function DashboardStats({
  totalWorkouts,
  totalCaloriesBurned,
  totalCaloriesConsumed,
  streakDays,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Workouts</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{totalWorkouts}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">completed workouts</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calories Burned</h3>
        <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
          {totalCaloriesBurned.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">total calories burned</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calories Consumed</h3>
        <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
          {totalCaloriesConsumed.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">total calories consumed</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Streak</h3>
        <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{streakDays}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">days in a row</p>
      </div>
    </div>
  );
} 