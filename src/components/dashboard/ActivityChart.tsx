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
  date: Date;
  _count: number;
}

interface ActivityChartProps {
  workoutsByDay: WorkoutByDay[];
}

export default function ActivityChart({ workoutsByDay }: ActivityChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // Format dates for labels
    const labels = last7Days.map((date) => {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });

    // Create data array with workout counts
    const data = last7Days.map((date) => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const workoutForDay = workoutsByDay.find((workout) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= dayStart && workoutDate <= dayEnd;
      });
      
      return workoutForDay ? workoutForDay._count : 0;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Workouts",
          data,
          backgroundColor: "rgba(79, 70, 229, 0.6)",
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [workoutsByDay]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Activity Last 7 Days",
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
      <div className="flex h-80 items-center justify-center rounded-lg bg-white p-6 shadow">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium">Activity Chart</h3>
      <div className="h-80">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
} 