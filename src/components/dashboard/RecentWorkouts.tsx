"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Workout } from "@/types/prisma";

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Workouts</h2>
        <Link
          href="/workouts/all"
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          View all →
        </Link>
      </div>

      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {workout.type} Workout
                  </h3>
                  {workout.notes && (
                    <p className="text-sm text-gray-500">{workout.notes}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(workout.completedAt), "MMM d")}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>{workout.duration} min</span>
                <span>{workout.caloriesBurned} calories</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No workouts logged yet</p>
          <Link
            href="/workouts/log"
            className="text-indigo-600 hover:text-indigo-900 text-sm mt-2 inline-block"
          >
            Log your first workout
          </Link>
        </div>
      )}
    </div>
  );
} 