"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Workout } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatLocalDateTime } from '@/utils/dateUtils';

export default function RecentWorkouts({ workouts }: { workouts: Workout[] }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  if (workouts.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6">
          Recent Workouts
        </h2>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No workouts logged yet.</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/workouts/log" 
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-300"
            >
              Log a workout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Recent Workouts
        </h2>
        <Link
          href="/workouts/all"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                    {workout.type.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {workout.type}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {formatLocalDateTime(workout.completedAt.toString())}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {workout.duration} min
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {workout.caloriesBurned} cal
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 