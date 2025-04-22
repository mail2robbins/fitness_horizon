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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Meals</h1>
          <p className="text-gray-600 mt-1">Your complete meal history</p>
        </div>
        <Link
          href="/meals/log"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Log New Meal
        </Link>
      </div>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Calories</h3>
          <p className="text-2xl font-bold text-indigo-600">{totalCalories}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Protein</h3>
          <p className="text-2xl font-bold text-indigo-600">{totalProtein}g</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Carbs</h3>
          <p className="text-2xl font-bold text-indigo-600">{totalCarbs}g</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Fat</h3>
          <p className="text-2xl font-bold text-indigo-600">{totalFat}g</p>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-8">
        {Object.entries(mealsByDate).map(([date, dateMeals]) => (
          <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
              <p className="text-sm text-gray-500">
                {dateMeals.length} meal{dateMeals.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {dateMeals.map((meal) => (
                <div key={meal.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {meal.name}
                      </h3>
                      {meal.notes && (
                        <p className="mt-1 text-sm text-gray-500">{meal.notes}</p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {meal.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Calories</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {meal.calories}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Protein</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {meal.protein}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Carbs</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {meal.carbs}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fat</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
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
            <h3 className="text-lg font-medium text-gray-900">No meals logged yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start tracking your nutrition by logging your first meal.
            </p>
            <div className="mt-6">
              <Link
                href="/meals/log"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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