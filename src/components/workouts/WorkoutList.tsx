"use client";

import { format } from "date-fns";
import { Workout } from "@prisma/client";
import Link from "next/link";
import { formatLocalDateVerbose } from '@/utils/dateUtils';

interface WorkoutListProps {
  workouts: Workout[];
}

export default function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No workouts logged yet.</p>
        <Link
          href="/workouts/log"
          className="text-indigo-600 hover:text-indigo-700"
        >
          Log your first workout
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Link
          key={workout.id}
          href={`/workouts/${workout.id}`}
          className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {workout.type}
                </h2>
                <p className="text-gray-500">
                  {formatLocalDateVerbose(workout.completedAt.toString())}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Duration: {workout.duration} min
                </p>
                <p className="text-sm text-gray-500">
                  Calories: {workout.caloriesBurned}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 