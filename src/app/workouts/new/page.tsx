import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import WorkoutForm from "@/components/workouts/WorkoutForm";

export default async function NewWorkoutPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log New Workout</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your workout details and progress.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <WorkoutForm />
          </div>
        </div>
      </div>
    </div>
  );
} 