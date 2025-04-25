"use client";

import { format } from "date-fns";
import type { Goal } from "@/types/prisma";

interface GoalsProgressProps {
  goals: Goal[];
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
  if (goals.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6">
          Goals
        </h3>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">You don&apos;t have any active goals yet.</p>
          <a
            href="/goals/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Create a Goal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6">
        Goals Progress
      </h3>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div 
              key={goal.id} 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                <span className="text-sm text-indigo-600 dark:text-indigo-400">
                  {daysLeft} days left
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {goal.description || `${goal.current} / ${goal.target} ${goal.type}`}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>{goal.current} {goal.type}</span>
                  <span>{goal.target} {goal.type}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xs text-gray-600 dark:text-gray-300">
                <span>Started: {format(new Date(goal.startDate), "MMM d, yyyy")}</span>
                <span>Ends: {format(new Date(goal.endDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <a
          href="/goals"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
        >
          View all goals →
        </a>
      </div>
    </div>
  );
} 