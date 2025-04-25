export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import RecentMeals from "@/components/dashboard/RecentMeals";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import ActivityChart from "@/components/dashboard/ActivityChart";
import { format, subDays } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      profile: true,
      workouts: {
        orderBy: { completedAt: "desc" },
        take: 5,
      },
      meals: {
        orderBy: { consumedAt: "desc" },
        take: 5,
      },
      goals: {
        where: { completed: false },
        orderBy: { endDate: "asc" },
        take: 3,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Calculate total workouts and calories
  const totalWorkouts = await prisma.workout.count({
    where: { userId: user.id },
  });

  const totalCaloriesBurned = await prisma.workout.aggregate({
    where: { userId: user.id },
    _sum: { caloriesBurned: true },
  });

  const totalCaloriesConsumed = await prisma.meal.aggregate({
    where: { userId: user.id },
    _sum: { calories: true },
  });

  // Calculate streak
  const streakDays = user.profile?.streakDays || 0;

  // Get workout activity for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, "MMM d");
  }).reverse();

  const workoutsByDay = await Promise.all(
    last7Days.map(async (date) => {
      const count = await prisma.workout.count({
        where: {
          userId: user.id,
          completedAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
          },
        },
      });
      return { date, count };
    })
  );

  // Create stats props
  const stats = {
    totalWorkouts,
    totalCaloriesBurned: totalCaloriesBurned._sum.caloriesBurned || 0,
    totalCaloriesConsumed: totalCaloriesConsumed._sum.calories || 0,
    streak: streakDays,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Welcome back, {user.profile?.name || "User"}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Here&apos;s your fitness journey overview
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <DashboardStats {...stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <ActivityChart workouts={workoutsByDay} />
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <GoalsProgress goals={user.goals} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <RecentWorkouts workouts={user.workouts} />
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <RecentMeals meals={user.meals} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 