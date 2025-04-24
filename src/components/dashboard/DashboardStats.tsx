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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white mb-4">
          <BoltIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Workouts</h3>
        <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          {totalWorkouts}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">completed workouts</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4">
          <FireIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calories Burned</h3>
        <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
          {totalCaloriesBurned.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">total calories burned</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white mb-4">
          <ScaleIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calories Consumed</h3>
        <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400">
          {totalCaloriesConsumed.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">total calories consumed</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Streak</h3>
        <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          {streakDays}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">days in a row</p>
      </div>
    </div>
  );
} 