"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Meal } from "@/types/prisma";

interface RecentMealsProps {
  meals: Meal[];
}

export default function RecentMeals({ meals }: RecentMealsProps) {
  if (meals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Meals</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No meals have been logged yet.</p>
        <div className="flex gap-4">
          <Link 
            href="/meals/log" 
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Log a meal
          </Link>
          <Link 
            href="/meals" 
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            View all meals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Meals</h2>
        <Link 
          href="/meals" 
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{meal.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(meal.consumedAt), 'PPp')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">{meal.calories} kcal</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span>P: {meal.protein}g</span>
                  <span className="mx-2">C: {meal.carbs}g</span>
                  <span>F: {meal.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 