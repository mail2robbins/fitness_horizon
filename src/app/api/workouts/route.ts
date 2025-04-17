import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { type, duration, caloriesBurned, notes, completedAt } = body;

    // Validate required fields
    if (!type || !duration || !caloriesBurned) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        type,
        duration,
        caloriesBurned,
        notes,
        completedAt: new Date(completedAt),
        userId: user.id,
      },
    });

    // Update user's streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkout = await prisma.workout.findFirst({
      where: {
        userId: user.id,
        completedAt: {
          lt: today,
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    if (lastWorkout) {
      const lastWorkoutDate = new Date(lastWorkout.completedAt);
      lastWorkoutDate.setHours(0, 0, 0, 0);

      const daysSinceLastWorkout = Math.floor(
        (today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastWorkout === 1) {
        // Consecutive day, increment streak
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            streakDays: {
              increment: 1,
            },
          },
        });
      } else if (daysSinceLastWorkout > 1) {
        // Streak broken, reset to 1
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            streakDays: 1,
          },
        });
      }
    } else {
      // First workout, set streak to 1
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          streakDays: 1,
        },
      });
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error creating workout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 