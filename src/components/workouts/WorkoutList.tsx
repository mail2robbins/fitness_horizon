"use client";

import { format } from "date-fns";
import { Workout } from "@prisma/client";
import Link from "next/link";

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
    <div className="grid gap-4">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold capitalize">
                {workout.type}
              </h2>
              <p className="text-gray-500">
                {format(new Date(workout.completedAt), "PPP")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{workout.duration} minutes</p>
              <p className="text-gray-500">{workout.caloriesBurned} calories</p>
            </div>
          </div>

          {workout.notes && (
            <div>
              <h3 className="font-medium mb-2">Notes:</h3>
              <p className="text-gray-600">{workout.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 