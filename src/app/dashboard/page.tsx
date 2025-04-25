export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { format } from "date-fns";

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

  const totalCalories = await prisma.workout.aggregate({
    where: { userId: user.id },
    _sum: { caloriesBurned: true },
  });

  // Get workouts grouped by day for the last 7 days
  const last7Days = await prisma.workout.groupBy({
    by: ['completedAt'],
    where: {
      userId: user.id,
      completedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    _count: true,
    orderBy: {
      completedAt: 'asc',
    },
  });

  // Format the data for the activity chart
  const workoutsByDay = last7Days.map(day => ({
    date: format(new Date(day.completedAt), 'yyyy-MM-dd'),
    count: day._count,
  }));

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Dashboard
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Welcome back, {user.name || 'User'}! Here&apos;s your fitness overview.
          </p>
        </div>

        <DashboardWrapper
          user={user}
          totalWorkouts={totalWorkouts}
          totalCalories={totalCalories._sum.caloriesBurned || 0}
          workoutsByDay={workoutsByDay}
        />
      </div>
    </div>
  );
} 