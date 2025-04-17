import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import RecentMeals from "@/components/dashboard/RecentMeals";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import ActivityChart from "@/components/dashboard/ActivityChart";
import { format, subDays } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {user.profile?.name || "User"}!
      </h1>

      <div className="space-y-8">
        <DashboardStats
          totalWorkouts={totalWorkouts}
          totalCaloriesBurned={totalCaloriesBurned._sum.caloriesBurned || 0}
          totalCaloriesConsumed={totalCaloriesConsumed._sum.calories || 0}
          streakDays={streakDays}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ActivityChart workouts={workoutsByDay} />
          <GoalsProgress goals={user.goals} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentWorkouts workouts={user.workouts} />
          <RecentMeals meals={user.meals} />
        </div>
      </div>
    </div>
  );
} 