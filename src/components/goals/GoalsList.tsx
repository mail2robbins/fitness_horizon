'use client';

import { useState } from 'react';
import { Goal } from '@prisma/client';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { EditGoalDialog } from '@/components/EditGoalDialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GoalsListProps {
  goals: Goal[];
  onGoalsUpdated: (updatedGoals: Goal[]) => void;
}

export default function GoalsList({ goals, onGoalsUpdated }: GoalsListProps) {
  const { theme } = useTheme();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getGoalStatus = (goal: Goal) => {
    const now = new Date();
    const endDate = new Date(goal.endDate);
    const startDate = new Date(goal.startDate);

    if (goal.completed) return 'Completed';
    if (now > endDate) return 'Expired';
    if (now < startDate) return 'Upcoming';
    return 'In Progress';
  };

  const canCompleteGoal = (goal: Goal) => {
    const now = new Date();
    const startDate = new Date(goal.startDate);
    return !goal.completed && now >= startDate;
  };

  const getStatusColor = (status: string) => {
    if (theme === 'dark') {
      switch (status) {
        case 'Completed':
          return 'bg-green-900/50 text-green-300';
        case 'Expired':
          return 'bg-red-900/50 text-red-300';
        case 'Upcoming':
          return 'bg-blue-900/50 text-blue-300';
        default:
          return 'bg-yellow-900/50 text-yellow-300';
      }
    }
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleEditClick = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (goal: Goal) => {
    setDeletingGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGoal) return;

    try {
      const response = await fetch(`/api/goals/${deletingGoal.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      await handleGoalUpdated();
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setDeletingGoal(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleGoalUpdated = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) {
        throw new Error('Failed to fetch updated goals');
      }
      const updatedGoals = await response.json();
      onGoalsUpdated(updatedGoals);
    } catch (error) {
      console.error('Error fetching updated goals:', error);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    setIsUpdating(goalId);
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete goal');
      }

      await handleGoalUpdated();
    } catch (error) {
      console.error('Error completing goal:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">You don&apos;t have any goals yet</p>
        <Link
          href="/goals/new"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Create your first goal
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const status = getGoalStatus(goal);
        return (
          <div
            key={goal.id}
            className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{goal.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{goal.description}</p>
              </div>
              <div className="flex gap-2">
                {canCompleteGoal(goal) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCompleteGoal(goal.id)}
                          disabled={isUpdating === goal.id}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isUpdating === goal.id ? 'Completing...' : 'Mark as Complete'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(goal)}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Goal</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(goal)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Goal</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Target Date: {new Date(goal.endDate).toLocaleDateString()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>
        );
      })}
      
      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onGoalUpdated={handleGoalUpdated}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the goal
              &quot;{deletingGoal?.title}&quot; and remove it from your goals list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 