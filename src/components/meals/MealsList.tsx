"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import MealFilters, { MealFilters as MealFiltersType } from "./MealFilters";

interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string | null;
  consumedAt: string;
}

interface MealsListProps {
  initialMeals: Meal[];
}

export default function MealsList({ initialMeals }: MealsListProps) {
  const [filteredMeals, setFilteredMeals] = useState(initialMeals);
  const mealTypes = Array.from(new Set(initialMeals.map(meal => meal.type)));

  const handleFilterChange = (filters: MealFiltersType) => {
    const filtered = initialMeals.filter(meal => {
      const mealDate = new Date(meal.consumedAt);
      const isInDateRange = mealDate >= filters.dateRange.start && mealDate <= filters.dateRange.end;
      const isTypeMatched = filters.types.length === 0 || filters.types.includes(meal.type);
      return isInDateRange && isTypeMatched;
    });

    setFilteredMeals(filtered);
  };

  // Calculate total stats for filtered meals
  const totalMeals = filteredMeals.length;
  const totalCalories = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = filteredMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = filteredMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = filteredMeals.reduce((sum, meal) => sum + meal.fat, 0);

  // Group meals by date
  const mealsByDate = filteredMeals.reduce((groups, meal) => {
    const date = format(new Date(meal.consumedAt), "MMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meal);
    return groups;
  }, {} as Record<string, typeof filteredMeals>);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            All Meals
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Your complete nutrition history and progress overview.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <MealFilters
            mealTypes={mealTypes}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Log New Meal Button */}
        <div className="flex justify-center mb-8">
          <Link
            href="/meals/log"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Log New Meal
          </Link>
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Meals</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalMeals}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalCalories}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Protein</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalProtein}g
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Carbs</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalCarbs}g
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fat</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalFat}g
            </p>
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-8">
          {Object.entries(mealsByDate).map(([date, dateMeals]) => (
            <div key={date} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{date}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dateMeals.length} meal{dateMeals.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dateMeals.map((meal) => (
                  <div key={meal.id} className="p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {meal.name}
                        </h3>
                        <span className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200">
                          {meal.type}
                        </span>
                        {meal.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{meal.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(meal.consumedAt), "h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {meal.calories}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {meal.protein}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbs</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {meal.carbs}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {meal.fat}g
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredMeals.length === 0 && (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">No meals found</h3>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Try adjusting your filters to see more meals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 