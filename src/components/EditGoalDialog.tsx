import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/date-input";
import { Goal } from "@prisma/client";
import React from "react";

interface EditGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalUpdated: () => void;
}

const goalTypes = [
  { value: 'weight', label: 'Weight Goal' },
  { value: 'workout', label: 'Workout Goal' },
  { value: 'nutrition', label: 'Nutrition Goal' },
  { value: 'steps', label: 'Steps Goal' },
];

export function EditGoalDialog({
  goal,
  open,
  onOpenChange,
  onGoalUpdated,
}: EditGoalDialogProps) {
  const startDateRef = React.useRef<HTMLInputElement>(null);
  const endDateRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description || "");
  const [type, setType] = useState(goal.type);
  const [target, setTarget] = useState(goal.target);
  const [startDate, setStartDate] = useState(
    goal.startDate ? new Date(goal.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    goal.endDate ? new Date(goal.endDate).toISOString().split("T")[0] : ""
  );
  const [completed, setCompleted] = useState(goal.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(goal.title);
    setDescription(goal.description || "");
    setType(goal.type);
    setTarget(goal.target);
    setStartDate(goal.startDate ? new Date(goal.startDate).toISOString().split("T")[0] : "");
    setEndDate(goal.endDate ? new Date(goal.endDate).toISOString().split("T")[0] : "");
    setCompleted(goal.completed);
  }, [goal]);

  const validateDates = (start: string, end: string) => {
    const startDateTime = new Date(start).getTime();
    const endDateTime = new Date(end).getTime();
    return startDateTime <= endDateTime;
  };

  const isUpcomingGoal = () => {
    const now = new Date();
    const startDate = new Date(goal.startDate);
    return now < startDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateDates(startDate, endDate)) {
      setError("Start date must be before or equal to end date");
      return;
    }

    setIsLoading(true);

    try {
      const formattedStartDate = new Date(startDate);
      formattedStartDate.setUTCHours(0, 0, 0, 0);
      
      const formattedEndDate = new Date(endDate);
      formattedEndDate.setUTCHours(23, 59, 59, 999);

      const response = await fetch(`/api/goals/${goal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          target: Number(target),
          startDate: formattedStartDate.toISOString(),
          endDate: formattedEndDate.toISOString(),
          completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      onGoalUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating goal:", error);
      setError("Failed to update goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Edit Goal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
              Goal Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              required
            >
              {goalTypes.map(goalType => (
                <option key={goalType.value} value={goalType.value}>
                  {goalType.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target" className="text-gray-700 dark:text-gray-300">
              Target Value
            </Label>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              required
              min={0}
              step="any"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-700 dark:text-gray-300">
                Start Date
              </Label>
              <DateInput
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                required
                ref={startDateRef}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-700 dark:text-gray-300">
                End Date
              </Label>
              <DateInput
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                required
                ref={endDateRef}
              />
            </div>
          </div>
          {!isUpcomingGoal() && (
            <div className="space-y-2">
              <Label htmlFor="completed" className="text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <select
                id="completed"
                value={completed.toString()}
                onChange={(e) => setCompleted(e.target.value === "true")}
                className="w-full px-3 py-2 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="false">In Progress</option>
                <option value="true">Completed</option>
              </select>
            </div>
          )}
          <DialogFooter className="flex gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 