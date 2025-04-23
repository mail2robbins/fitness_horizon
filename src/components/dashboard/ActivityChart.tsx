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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

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
  const [chartData, setChartData] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (workouts.length === 0) return;

    const data = {
      labels: workouts.map(workout => workout.date),
      datasets: [
        {
          label: 'Workouts',
          data: workouts.map(workout => workout.count),
          backgroundColor: isDark ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.5)',
          borderColor: isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
          borderWidth: 1,
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
          color: isDark ? '#fff' : '#111827',
        },
      },
      title: {
        display: true,
        text: 'Workout Activity (Last 7 Days)',
        color: isDark ? '#fff' : '#111827',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: isDark ? '#9ca3af' : '#4b5563',
        },
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#9ca3af' : '#4b5563',
        },
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading activity data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <Bar options={options} data={chartData} />
    </div>
  );
} 