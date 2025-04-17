"use client";

import { format } from "date-fns";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type MealType = NonNullable<Awaited<ReturnType<typeof prisma.meal.findUnique>>>;

interface RecentMealsProps {
  meals: MealType[];
}

export default function RecentMeals({ meals }: RecentMealsProps) {
  if (meals.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium">Recent Meals</h3>
        <p className="text-gray-500">You haven't logged any meals yet.</p>
        <Link
          href="/meals/new"
          className="mt-4 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Log a Meal
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium">Recent Meals</h3>
      <div className="space-y-4">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="border-b border-gray-200 pb-4 last:border-0"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{meal.name}</h4>
              <span className="text-sm text-gray-500">
                {format(new Date(meal.date), "MMM d, yyyy")}
              </span>
            </div>
            {meal.description && (
              <p className="mt-1 text-sm text-gray-600">{meal.description}</p>
            )}
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Calories</span>
                <p className="text-gray-600">{meal.calories}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Protein</span>
                <p className="text-gray-600">{meal.protein}g</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Carbs</span>
                <p className="text-gray-600">{meal.carbs}g</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/meals"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all meals
        </Link>
      </div>
    </div>
  );
} 