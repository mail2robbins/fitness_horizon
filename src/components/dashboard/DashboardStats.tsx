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
  streak: number;
}

export default function DashboardStats({
  totalWorkouts,
  totalCaloriesBurned,
  totalCaloriesConsumed,
  streak,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "Total Workouts",
      value: totalWorkouts,
      unit: "",
    },
    {
      name: "Calories Burned",
      value: totalCaloriesBurned,
      unit: "kcal",
    },
    {
      name: "Calories Consumed",
      value: totalCaloriesConsumed,
      unit: "kcal",
    },
    {
      name: "Current Streak",
      value: streak,
      unit: "days",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt className="truncate text-sm font-medium text-gray-500">
            {stat.name}
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stat.value}
            <span className="ml-1 text-lg font-medium text-gray-500">
              {stat.unit}
            </span>
          </dd>
        </div>
      ))}
    </div>
  );
} 