"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface WorkoutFormProps {
  onSubmit?: (workout: any) => void;
}

export default function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    workoutType: "",
    duration: "",
    exercises: "",
    calories: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create workout");
      }

      const workout = await response.json();

      if (onSubmit) {
        onSubmit(workout);
      } else {
        router.push("/workouts");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="workoutType"
          className="block text-sm font-medium text-gray-700"
        >
          Workout Type
        </label>
        <select
          id="workoutType"
          name="workoutType"
          value={formData.workoutType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a type</option>
          <option value="STRENGTH">Strength Training</option>
          <option value="CARDIO">Cardio</option>
          <option value="FLEXIBILITY">Flexibility</option>
          <option value="HIIT">HIIT</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700"
        >
          Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="exercises"
          className="block text-sm font-medium text-gray-700"
        >
          Exercises
        </label>
        <textarea
          id="exercises"
          name="exercises"
          value={formData.exercises}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="List your exercises, sets, reps, and weights..."
        />
      </div>

      <div>
        <label
          htmlFor="calories"
          className="block text-sm font-medium text-gray-700"
        >
          Calories Burned
        </label>
        <input
          type="number"
          id="calories"
          name="calories"
          value={formData.calories}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Any additional notes about your workout..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Workout"}
        </button>
      </div>
    </form>
  );
} 