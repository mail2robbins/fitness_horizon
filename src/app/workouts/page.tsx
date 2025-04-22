"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [workouts, totalWorkouts] = await Promise.all([
    prisma.workout.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    }),
    prisma.workout.count({
      where: {
        userId: session.user.id,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalWorkouts / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <Link
          href="/workouts/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log New Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No workouts logged yet.</p>
          <Link
            href="/workouts/new"
            className="text-blue-500 hover:text-blue-600"
          >
            Log your first workout
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold capitalize">
                      {workout.workoutType}
                    </h2>
                    <p className="text-gray-500">
                      {format(new Date(workout.createdAt), "PPP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{workout.duration} minutes</p>
                    <p className="text-gray-500">{workout.calories} calories</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Exercises:</h3>
                  <ul className="list-disc list-inside">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index} className="text-gray-600">
                        {exercise}
                      </li>
                    ))}
                  </ul>
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/workouts?page=${pageNum}`}
                  className={`px-4 py-2 rounded ${
                    pageNum === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 