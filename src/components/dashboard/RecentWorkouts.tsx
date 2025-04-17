"use client";

import { format } from "date-fns";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
};

type WorkoutWithExercises = Awaited<
  ReturnType<typeof prisma.workout.findUnique> & {
    exercises: Exercise[];
  }
>;

interface RecentWorkoutsProps {
  workouts: NonNullable<WorkoutWithExercises>[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  if (workouts.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium">Recent Workouts</h3>
        <p className="text-gray-500">You haven't logged any workouts yet.</p>
        <Link
          href="/workouts/new"
          className="mt-4 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Log a Workout
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium">Recent Workouts</h3>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="border-b border-gray-200 pb-4 last:border-0"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{workout.name}</h4>
              <span className="text-sm text-gray-500">
                {format(new Date(workout.date), "MMM d, yyyy")}
              </span>
            </div>
            {workout.description && (
              <p className="mt-1 text-sm text-gray-600">{workout.description}</p>
            )}
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              {workout.duration && (
                <span>{workout.duration} minutes</span>
              )}
              {workout.calories && (
                <span>{workout.calories} calories</span>
              )}
            </div>
            {workout.exercises.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700">Exercises:</h5>
                <ul className="mt-1 space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise: Exercise) => (
                    <li key={exercise.id} className="text-sm text-gray-600">
                      {exercise.name} - {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight && ` @ ${exercise.weight}kg`}
                    </li>
                  ))}
                  {workout.exercises.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{workout.exercises.length - 3} more exercises
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/workouts"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all workouts
        </Link>
      </div>
    </div>
  );
} 