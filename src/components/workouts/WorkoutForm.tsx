"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkoutForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

      router.push("/workouts");
    } catch (error) {
      console.error("Error creating workout:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/workouts");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Workout Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          <option value="">Select a type</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
          <option value="HIIT">HIIT</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="caloriesBurned" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Calories Burned
        </label>
        <input
          type="number"
          id="caloriesBurned"
          name="caloriesBurned"
          value={formData.caloriesBurned}
          onChange={handleChange}
          required
          min="1"
          className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 shadow-lg"
        >
          {isLoading ? "Saving..." : "Save Workout"}
        </button>
      </div>
    </form>
  );
} 