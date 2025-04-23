"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Workout } from "@/types/prisma";

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Workouts</h2>
        <Link
          href="/workouts/all"
          className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all →
        </Link>
      </div>

      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {workout.type} Workout
                  </h3>
                  {workout.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{workout.notes}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(workout.completedAt), "MMM d")}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{workout.duration} min</span>
                <span>{workout.caloriesBurned} calories</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">No workouts logged yet</p>
          <Link
            href="/workouts/log"
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm mt-2 inline-block"
          >
            Log your first workout
          </Link>
        </div>
      )}
    </div>
  );
} 