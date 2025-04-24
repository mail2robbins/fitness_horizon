import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import WorkoutsList from "@/components/workouts/WorkoutsList";

export default async function AllWorkoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const workouts = await prisma.workout.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
  });

  // Serialize the dates for client component
  const serializedWorkouts = workouts.map(workout => ({
    ...workout,
    completedAt: workout.completedAt.toISOString(),
  }));

  return <WorkoutsList initialWorkouts={serializedWorkouts} />;
} 