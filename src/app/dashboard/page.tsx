export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { format, startOfDay, endOfDay } from "date-fns";

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

  // Calculate total calories consumed from meals
  const totalCaloriesConsumed = await prisma.meal.aggregate({
    where: { userId: user.id },
    _sum: { calories: true },
  });

  // Get the start and end dates for the last 7 days
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  // Get all workouts for the last 7 days
  const workouts = await prisma.workout.findMany({
    where: {
      userId: user.id,
      completedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      completedAt: 'asc',
    },
  });

  // Create a map of all dates in the range with initial count of 0
  const dateMap = new Map<string, number>();
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dateMap.set(format(currentDate, 'yyyy-MM-dd'), 0);
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  // Group workouts by date and count them
  workouts.forEach(workout => {
    const date = format(workout.completedAt, 'yyyy-MM-dd');
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  // Convert the map to the required format
  const workoutsByDay = Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
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
          totalCaloriesConsumed={totalCaloriesConsumed._sum.calories || 0}
          workoutsByDay={workoutsByDay}
        />
      </div>
    </div>
  );
} 