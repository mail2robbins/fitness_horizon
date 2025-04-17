declare module "@/components/dashboard/DashboardStats" {
  interface DashboardStatsProps {
    totalWorkouts: number;
    totalCaloriesBurned: number;
    totalCaloriesConsumed: number;
    streak: number;
  }
  export default function DashboardStats(props: DashboardStatsProps): JSX.Element;
}

declare module "@/components/dashboard/RecentWorkouts" {
  import { Workout, Exercise } from "@prisma/client";
  interface WorkoutWithExercises extends Workout {
    exercises: Exercise[];
  }
  interface RecentWorkoutsProps {
    workouts: WorkoutWithExercises[];
  }
  export default function RecentWorkouts(props: RecentWorkoutsProps): JSX.Element;
}

declare module "@/components/dashboard/RecentMeals" {
  import { Meal } from "@prisma/client";
  interface RecentMealsProps {
    meals: Meal[];
  }
  export default function RecentMeals(props: RecentMealsProps): JSX.Element;
} 