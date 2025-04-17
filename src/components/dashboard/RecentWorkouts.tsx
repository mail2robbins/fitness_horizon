"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Workout } from "@/types/prisma";

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
        <p className="text-gray-600 mb-4">No workouts have been logged yet.</p>
        <div className="flex gap-4">
          <Link 
            href="/workouts/log" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Log a workout
          </Link>
          <Link 
            href="/workouts" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all workouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Workouts</h2>
        <Link 
          href="/workouts" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{workout.type}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(workout.completedAt), 'PPp')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{workout.duration} minutes</p>
                <p className="text-sm text-gray-500">
                  {workout.caloriesBurned} calories burned
                </p>
              </div>
            </div>
            {workout.notes && (
              <p className="mt-2 text-sm text-gray-600">{workout.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 