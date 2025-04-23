import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MealForm from "@/components/meals/MealForm";
import { authOptions } from "@/lib/auth";

export default async function LogMealPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Log a Meal</h1>
        <MealForm />
      </div>
    </div>
  );
} 