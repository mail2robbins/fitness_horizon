"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Meal } from "@/types/prisma";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RecentMealsProps {
  meals: Meal[];
}

export default function RecentMeals({ meals }: RecentMealsProps) {
  const router = useRouter();

  // Refresh the component data periodically
  useEffect(() => {
    // Refresh data every minute
    const interval = setInterval(() => {
      router.refresh();
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  if (meals.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6">
          Recent Meals
        </h2>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No meals have been logged yet.</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/meals/log" 
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-300"
            >
              Log a meal
            </Link>
            <Link 
              href="/meals" 
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-300"
            >
              View all meals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Recent Meals
        </h2>
        <Link 
          href="/meals" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
        >
          View all →
        </Link>
      </div>
      <div className="space-y-4">
        {meals.map((meal) => (
          <div 
            key={meal.id} 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{meal.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {format(new Date(meal.consumedAt), 'PPp')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">{meal.calories} kcal</p>
                <div className="text-sm mt-1">
                  <span className="text-emerald-600 dark:text-emerald-400">P: {meal.protein}g</span>
                  <span className="mx-2 text-amber-600 dark:text-amber-400">C: {meal.carbs}g</span>
                  <span className="text-rose-600 dark:text-rose-400">F: {meal.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 