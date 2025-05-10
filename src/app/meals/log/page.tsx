import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MealForm from "@/components/meals/MealForm";
import { authOptions } from "@/lib/auth";

export default async function LogMealPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl pb-2 leading-tight font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Log Your Meal
          </h1>
          <p className="mt-1 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Track your nutrition and maintain a balanced diet.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <MealForm />
          </div>
        </div>
      </div>
    </div>
  );
} 