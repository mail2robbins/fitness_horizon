import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import WorkoutForm from "@/components/workouts/WorkoutForm";
import { authOptions } from "@/lib/auth";

export default async function LogWorkoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Log a Workout</h1>
        <WorkoutForm />
      </div>
    </div>
  );
} 