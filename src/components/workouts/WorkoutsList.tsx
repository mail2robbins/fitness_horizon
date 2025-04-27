"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import WorkoutFilters, { WorkoutFilters as WorkoutFiltersType } from "./WorkoutFilters";
import EditWorkoutDialog from "./EditWorkoutDialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

interface Workout {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  notes?: string | null;
  completedAt: string;
}

interface WorkoutsListProps {
  initialWorkouts: Workout[];
}

export default function WorkoutsList({ initialWorkouts }: WorkoutsListProps) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [filteredWorkouts, setFilteredWorkouts] = useState(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<WorkoutFiltersType | null>({
    dateRange: { start: startOfDay(new Date()), end: endOfDay(new Date()) },
    types: [],
    period: 'daily',
  });
  const workoutTypes = Array.from(new Set(workouts.map(workout => workout.type)));

  // On mount and when initialWorkouts changes, apply the daily filter
  useEffect(() => {
    setWorkouts(initialWorkouts);
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    const filtered = (initialWorkouts as Workout[]).filter((workout: Workout) => {
      const workoutDate = new Date(workout.completedAt);
      return workoutDate >= start && workoutDate <= end;
    });
    setFilteredWorkouts(filtered);
    setCurrentFilters({
      dateRange: { start, end },
      types: [],
      period: 'daily',
    });
  }, [initialWorkouts]);

  const handleFilterChange = (filters: WorkoutFiltersType) => {
    setCurrentFilters(filters);
    const filtered = workouts.filter(workout => {
      const workoutDate = new Date(workout.completedAt);
      const isInDateRange = workoutDate >= filters.dateRange.start && workoutDate <= filters.dateRange.end;
      const isTypeMatched = filters.types.length === 0 || filters.types.includes(workout.type);
      return isInDateRange && isTypeMatched;
    });

    setFilteredWorkouts(filtered);
  };

  const handleEditClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedWorkout(null);
    setIsEditDialogOpen(false);
  };

  const handleWorkoutUpdated = (updatedWorkout: Workout) => {
    // Update the workouts state with the updated workout
    const updatedWorkouts = workouts.map(workout => 
      workout.id === updatedWorkout.id ? updatedWorkout : workout
    );
    setWorkouts(updatedWorkouts);

    // If there are active filters, reapply them to the updated workouts
    if (currentFilters) {
      const filtered = updatedWorkouts.filter(workout => {
        const workoutDate = new Date(workout.completedAt);
        const isInDateRange = workoutDate >= currentFilters.dateRange.start && workoutDate <= currentFilters.dateRange.end;
        const isTypeMatched = currentFilters.types.length === 0 || currentFilters.types.includes(workout.type);
        return isInDateRange && isTypeMatched;
      });
      setFilteredWorkouts(filtered);
    } else {
      setFilteredWorkouts(updatedWorkouts);
    }
  };

  // Calculate total stats for filtered workouts
  const totalWorkouts = filteredWorkouts.length;
  const totalDuration = filteredWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = filteredWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
  const averageCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(totalCaloriesBurned / totalWorkouts) : 0;

  // Group workouts by date
  const workoutsByDate = filteredWorkouts.reduce((groups, workout) => {
    const date = format(new Date(workout.completedAt), "MMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(workout);
    return groups;
  }, {} as Record<string, typeof filteredWorkouts>);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            All Workouts
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Your complete workout history and progress overview.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <WorkoutFilters
            workoutTypes={workoutTypes}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Log New Workout Button */}
        <div className="flex justify-center mb-8">
          <Link
            href="/workouts/log"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Log New Workout
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Workouts</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalWorkouts}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalDuration} min
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories Burned</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {totalCaloriesBurned}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Calories/Workout</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {averageCaloriesPerWorkout}
            </p>
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-8">
          {Object.entries(workoutsByDate).map(([date, dateWorkouts]) => (
            <div key={date} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{date}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dateWorkouts.length} workout{dateWorkouts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dateWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className={`p-8 transition-all duration-300 relative ${
                      selectedWorkout?.id === workout.id
                        ? "bg-purple-50/90 dark:bg-purple-900/80"
                        : "hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-100/80 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    {selectedWorkout?.id === workout.id && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-fuchsia-100 to-pink-100 dark:from-purple-800 dark:via-fuchsia-800 dark:to-pink-800 opacity-80 dark:opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-fuchsia-200/30 to-pink-200/30 dark:from-purple-600/40 dark:via-fuchsia-600/40 dark:to-pink-600/40 animate-pulse" />
                      </>
                    )}
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-4">
                          <h3 className={`text-lg font-medium transition-colors duration-300 ${
                            selectedWorkout?.id === workout.id
                              ? "text-indigo-700 dark:text-indigo-400"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {workout.type} Workout
                          </h3>
                          <Button
                            variant={selectedWorkout?.id === workout.id ? "default" : "ghost"}
                            size="icon"
                            onClick={() => handleEditClick(workout)}
                            className={`h-8 w-8 transition-all duration-300 ${
                              selectedWorkout?.id === workout.id
                                ? "bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                                : ""
                            }`}
                          >
                            <Pencil className={`h-4 w-4 transition-colors duration-300 ${
                              selectedWorkout?.id === workout.id
                                ? "text-indigo-700 dark:text-indigo-400"
                                : ""
                            }`} />
                          </Button>
                        </div>
                        {workout.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{workout.notes}</p>
                        )}
                      </div>
                      <div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                          <p className={`text-lg font-semibold transition-colors duration-300 ${
                            selectedWorkout?.id === workout.id
                              ? "text-indigo-700 dark:text-indigo-400"
                              : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                          }`}>
                            {workout.duration} min
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                            <p className={`text-lg font-semibold transition-colors duration-300 ${
                              selectedWorkout?.id === workout.id
                                ? "text-indigo-700 dark:text-indigo-400"
                                : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                            }`}>
                              {workout.caloriesBurned}
                            </p>
                          </div>
                          <div className="text-right ml-8">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                            <p className={`text-sm transition-colors duration-300 ${
                              selectedWorkout?.id === workout.id
                                ? "text-indigo-700 dark:text-indigo-400"
                                : "text-gray-900 dark:text-white"
                            }`}>
                              {format(new Date(workout.completedAt), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredWorkouts.length === 0 && (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">No workouts found</h3>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Try adjusting your filters to see more workouts.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedWorkout && (
        <EditWorkoutDialog
          workout={selectedWorkout}
          isOpen={isEditDialogOpen}
          onClose={handleEditDialogClose}
          onWorkoutUpdated={handleWorkoutUpdated}
        />
      )}
    </div>
  );
} 