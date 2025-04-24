import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { authOptions } from "@/lib/auth";

export default async function AllWorkoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const workouts = await prisma.workout.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
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
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            All Workouts
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Your complete workout history and progress overview.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Link
            href="/workouts/log"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Log New Workout
          </Link>
        </div>

        {/* Workout Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Workouts</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalWorkouts}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalDuration} min
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories Burned</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalCaloriesBurned}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Calories/Workout</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {averageCaloriesPerWorkout}
            </p>
          </div>
        </div>

        {/* Workout Types Filter */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Workout Types</h2>
          <div className="flex flex-wrap gap-3">
            {workoutTypes.map((type) => (
              <button
                key={type}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200 text-sm font-medium hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-all duration-300"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-8">
          {Object.entries(workoutsByDate).map(([date, dateWorkouts]) => (
            <div key={date} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{date}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dateWorkouts.length} workout{dateWorkouts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dateWorkouts.map((workout) => (
                  <div key={workout.id} className="p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {workout.type} Workout
                        </h3>
                        {workout.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{workout.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {workout.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                          <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
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
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">No workouts logged yet</h3>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Start tracking your fitness journey by logging your first workout.
              </p>
              <div className="mt-6">
                <Link
                  href="/workouts/log"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
                >
                  Log Your First Workout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 