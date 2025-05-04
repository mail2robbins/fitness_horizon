"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@/components/ThemeProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WorkoutByDay {
  date: string;
  count: number;
}

interface ActivityChartProps {
  workouts: WorkoutByDay[];
}

export default function ActivityChart({ workouts }: ActivityChartProps) {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);
  const { theme, systemTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

  useEffect(() => {
    if (workouts.length === 0) return;

    const data = {
      labels: workouts.map(workout => workout.date),
      datasets: [
        {
          label: 'Workouts',
          data: workouts.map(workout => workout.count),
          backgroundColor: isDark 
            ? 'rgba(129, 140, 248, 0.5)' 
            : 'rgba(99, 102, 241, 0.5)',
          borderColor: isDark 
            ? 'rgb(129, 140, 248)' 
            : 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };

    setChartData(data);
  }, [workouts, isDark]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#1f2937',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Workout Activity (Last 7 Days)',
        color: isDark ? '#fff' : '#1f2937',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#22223b' : '#fff',
        titleColor: isDark ? '#fff' : '#1f2937',
        bodyColor: isDark ? '#fff' : '#1f2937',
        borderColor: isDark ? '#fff' : '#1f2937',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: isDark ? '#e5e7eb' : '#4b5563',
          font: {
            size: 12,
          },
        },
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#e5e7eb' : '#4b5563',
          font: {
            size: 12,
          },
        },
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">Loading activity data...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6">
        Activity Overview
      </h3>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 min-h-[260px] sm:min-h-[340px] flex items-center">
        <div className="w-full h-[220px] sm:h-[300px]">
          <Bar options={options} data={chartData} height={220} />
        </div>
      </div>
    </div>
  );
} 