import type { Workout, Meal, Goal, Profile, User } from "@prisma/client";

export type { Workout, Meal, Goal, Profile };

export interface UserWithProfile extends User {
  profile: Profile | null;
} 