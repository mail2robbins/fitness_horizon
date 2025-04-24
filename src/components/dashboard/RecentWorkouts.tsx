"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Workout } from "@/types/prisma";

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
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

      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {workout.type} Workout
                  </h3>
                  {workout.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{workout.notes}</p>
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {format(new Date(workout.completedAt), "MMM d")}
                </span>
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                <span className="text-indigo-600 dark:text-indigo-400">{workout.duration} min</span>
                <span className="text-emerald-600 dark:text-emerald-400">{workout.caloriesBurned} calories</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">No workouts logged yet</p>
          <Link
            href="/workouts/log"
            className="inline-flex items-center mt-4 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-300"
          >
            Log your first workout
          </Link>
        </div>
      )}
    </div>
  );
} 