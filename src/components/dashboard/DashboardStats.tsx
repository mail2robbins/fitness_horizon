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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Total Workouts</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600">{totalWorkouts}</p>
        <p className="mt-1 text-sm text-gray-500">completed workouts</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Calories Burned</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {totalCaloriesBurned.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500">total calories burned</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Calories Consumed</h3>
        <p className="mt-2 text-3xl font-bold text-orange-600">
          {totalCaloriesConsumed.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500">total calories consumed</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Current Streak</h3>
        <p className="mt-2 text-3xl font-bold text-purple-600">{streakDays}</p>
        <p className="mt-1 text-sm text-gray-500">days in a row</p>
      </div>
    </div>
  );
} 