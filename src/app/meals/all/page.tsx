import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { authOptions } from "@/lib/auth";

export default async function AllMealsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const meals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      consumedAt: "desc",
    },
  });

  // Calculate total nutrition stats
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  // Group meals by date
  const mealsByDate = meals.reduce((groups, meal) => {
    const date = format(new Date(meal.consumedAt), "MMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meal);
    return groups;
  }, {} as Record<string, typeof meals>);

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Meals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your complete meal history</p>
        </div>
        <Link
          href="/meals/log"
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Log New Meal
        </Link>
      </div>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalCalories}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Protein</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalProtein}g</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Carbs</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalCarbs}g</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fat</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalFat}g</p>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-6">
        {Object.entries(mealsByDate).map(([date, dateMeals]) => (
          <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{date}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dateMeals.length} meal{dateMeals.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {dateMeals.map((meal) => (
                <div key={meal.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {meal.name}
                      </h3>
                      {meal.notes && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{meal.notes}</p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {meal.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {meal.calories}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {meal.protein}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbs</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {meal.carbs}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {meal.fat}g
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {meals.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No meals logged yet</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start tracking your nutrition by logging your first meal.
            </p>
            <div className="mt-6">
              <Link
                href="/meals/log"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                Log Your First Meal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 