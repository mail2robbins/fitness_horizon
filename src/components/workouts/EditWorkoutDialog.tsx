"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditWorkoutDialogProps {
  workout: {
    id: string;
    type: string;
    duration: number;
    caloriesBurned: number;
    notes?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onWorkoutUpdated?: (updatedWorkout: {
    id: string;
    type: string;
    duration: number;
    caloriesBurned: number;
    notes?: string | null;
    completedAt: string;
  }) => void;
}

export default function EditWorkoutDialog({
  workout,
  isOpen,
  onClose,
  onWorkoutUpdated,
}: EditWorkoutDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: workout.type,
    duration: workout.duration.toString(),
    caloriesBurned: workout.caloriesBurned.toString(),
    notes: workout.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update workout");
      }

      const updatedWorkout = await response.json();
      
      // Call the parent component's callback with the updated workout
      if (onWorkoutUpdated) {
        onWorkoutUpdated(updatedWorkout);
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error updating workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Edit Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Workout Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
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
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
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
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="caloriesBurned"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
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
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-white dark:bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-blue-600 text-white hover:from-indigo-700 hover:to-purple-700 dark:hover:bg-blue-700 transition-all duration-200"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 