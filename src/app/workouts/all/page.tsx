import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { authOptions } from "@/lib/auth";

export default async function AllWorkoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const workouts = await prisma.workout.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      completedAt: "desc",
    },
  });

  // Calculate total stats
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
  const averageCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(totalCaloriesBurned / totalWorkouts) : 0;

  // Group workouts by date
  const workoutsByDate = workouts.reduce((groups, workout) => {
    const date = format(new Date(workout.completedAt), "MMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(workout);
    return groups;
  }, {} as Record<string, typeof workouts>);

  // Get unique workout types for filtering
  const workoutTypes = Array.from(new Set(workouts.map(workout => workout.type)));

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Workouts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your complete workout history</p>
        </div>
        <Link
          href="/workouts/log"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
        >
          Log New Workout
        </Link>
      </div>

      {/* Workout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Workouts</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalWorkouts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalDuration} min</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories Burned</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalCaloriesBurned}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Calories/Workout</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{averageCaloriesPerWorkout}</p>
        </div>
      </div>

      {/* Workout Types Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workout Types</h2>
        <div className="flex flex-wrap gap-2">
          {workoutTypes.map((type) => (
            <button
              key={type}
              className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts List */}
      <div className="space-y-8">
        {Object.entries(workoutsByDate).map(([date, dateWorkouts]) => (
          <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{date}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dateWorkouts.length} workout{dateWorkouts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {dateWorkouts.map((workout) => (
                <div key={workout.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {workout.type} Workout
                      </h3>
                      {workout.notes && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{workout.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workout.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                          {workout.caloriesBurned}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(workout.completedAt), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {workouts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No workouts logged yet</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start tracking your fitness journey by logging your first workout.
            </p>
            <div className="mt-6">
              <Link
                href="/workouts/log"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                Log Your First Workout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 