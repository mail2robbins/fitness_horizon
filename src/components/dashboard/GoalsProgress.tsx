"use client";

import { format } from "date-fns";
import type { Goal } from "@/types/prisma";

interface GoalsProgressProps {
  goals: Goal[];
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
  if (goals.length === 0) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Goals</h3>
        <p className="text-gray-500 dark:text-gray-400">You don't have any active goals yet.</p>
        <a
          href="/goals/new"
          className="mt-4 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Create a Goal
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Goals Progress</h3>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {daysLeft} days left
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {goal.description || `${goal.current} / ${goal.target} ${goal.type}`}
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{goal.current} {goal.type}</span>
                  <span>{goal.target} {goal.type}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Started: {format(new Date(goal.startDate), "MMM d, yyyy")}</span>
                <span>Ends: {format(new Date(goal.endDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <a
          href="/goals"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all goals
        </a>
      </div>
    </div>
  );
} 