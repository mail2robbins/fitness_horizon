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

  useEffect(() => {
    if (workouts.length === 0) return;

    const data = {
      labels: workouts.map(workout => workout.date),
      datasets: [
        {
          label: 'Workouts',
          data: workouts.map(workout => workout.count),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [workouts]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Workout Activity (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading activity data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Bar options={options} data={chartData} />
    </div>
  );
} 