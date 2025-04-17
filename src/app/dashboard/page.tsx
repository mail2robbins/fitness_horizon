import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import RecentMeals from "@/components/dashboard/RecentMeals";

type WorkoutDate = {
  date: Date;
};

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user's data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined },
    include: {
      workouts: {
        orderBy: { date: "desc" },
        take: 5,
        include: {
          exercises: true,
        },
      },
      meals: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Calculate stats
  const totalWorkouts = await prisma.workout.count({
    where: { userId: user.id },
  });

  const totalCaloriesBurned = await prisma.workout.aggregate({
    where: { userId: user.id },
    _sum: { calories: true },
  });

  const totalCaloriesConsumed = await prisma.meal.aggregate({
    where: { userId: user.id },
    _sum: { calories: true },
  });

  // Calculate streak (consecutive days with workouts)
  const recentWorkouts = await prisma.workout.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: { date: true },
  });

  let streak = 0;
  if (recentWorkouts.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there's a workout today or yesterday to maintain streak
    const hasRecentWorkout = recentWorkouts.some((workout: WorkoutDate) => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === today.getTime() || workoutDate.getTime() === yesterday.getTime();
    });

    if (hasRecentWorkout) {
      streak = 1;
      let currentDate = yesterday;
      for (let i = 1; i < recentWorkouts.length; i++) {
        const workoutDate = new Date(recentWorkouts[i].date);
        workoutDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() - 1);

        if (workoutDate.getTime() === currentDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {user.name || "User"}!</h2>
        <p className="text-gray-600">
          Track your fitness journey and stay motivated with your health goals.
        </p>
      </div>

      <div className="mb-8">
        <DashboardStats
          totalWorkouts={totalWorkouts}
          totalCaloriesBurned={totalCaloriesBurned._sum.calories ?? 0}
          totalCaloriesConsumed={totalCaloriesConsumed._sum.calories ?? 0}
          streak={streak}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <RecentWorkouts workouts={user.workouts} />
        </div>
        <div>
          <RecentMeals meals={user.meals} />
        </div>
      </div>
    </div>
  );
} 