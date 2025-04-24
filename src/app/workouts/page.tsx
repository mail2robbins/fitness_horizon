import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function WorkoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const workouts = await prisma.workout.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Your Workouts
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Track your fitness journey and monitor your progress over time.
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

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          {workouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Calories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {workouts.map((workout) => (
                    <tr key={workout.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {workout.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {workout.duration} minutes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {workout.caloriesBurned} kcal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(workout.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No workouts logged yet. Start your fitness journey by logging your first workout!
              </p>
            </div>
          )}
        </div>

        {workouts.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/workouts/all"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
            >
              View All Workouts →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 