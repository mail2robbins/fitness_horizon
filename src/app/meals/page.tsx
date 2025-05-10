export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import MealsWrapper from "@/components/meals/MealsWrapper";
import Link from "next/link";
import { format } from "date-fns";
import TodayMealsTable from '@/components/meals/TodayMealsTable';

export default async function MealsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get tomorrow's date at midnight
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Query only today's meals
  const meals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
      consumedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { consumedAt: "desc" },
  });

  // Calculate today's totals
  const totalMeals = meals.length;
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl pb-2 leading-tight font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Today&apos;s Meals
          </h1>
          <p className="mt-1 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Track your nutrition for {format(today, 'MMMM d, yyyy')}
          </p>
        </div>

        <MealsWrapper>
          <div className="flex justify-center mb-8">
            <Link
              href="/meals/log"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
            >
              Log New Meal
            </Link>
          </div>

          {/* Today's Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Meals</h3>
              <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {totalMeals}
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</h3>
              <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {totalCalories}
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</h3>
              <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {totalProtein}g
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbs</h3>
              <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {totalCarbs}g
              </p>
            </div>
          </div>

          {/* Today's Meals List */}
          <TodayMealsTable meals={meals.map(m => ({
            ...m,
            consumedAt: m.consumedAt instanceof Date ? m.consumedAt.toISOString() : m.consumedAt
          }))} />

          {/* Link to view all meals */}
          <div className="mt-8 text-center">
            <Link
              href="/meals/all"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
            >
              View All Meals
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </MealsWrapper>
      </div>
    </div>
  );
} 