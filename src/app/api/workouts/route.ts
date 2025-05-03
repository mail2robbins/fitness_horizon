import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { type, duration, caloriesBurned, notes } = body;

    // Validate required fields
    if (!type || !duration || !caloriesBurned) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    // Get today's date range
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Get yesterday's date range
    const yesterdayStart = startOfDay(subDays(today, 1));
    const yesterdayEnd = endOfDay(subDays(today, 1));

    // Check if user has already worked out today
    const todayWorkouts = await prisma.workout.count({
      where: {
        userId: session.user.id,
        completedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Check if user worked out yesterday
    const yesterdayWorkouts = await prisma.workout.count({
      where: {
        userId: session.user.id,
        completedAt: {
          gte: yesterdayStart,
          lte: yesterdayEnd,
        },
      },
    });

    // If user didn't work out yesterday, reset streak
    let streakDays = profile?.streakDays || 0;
    if (yesterdayWorkouts === 0 && streakDays > 0) {
      streakDays = 0;
    }

    // If this is the first workout today, increment streak
    if (todayWorkouts === 0) {
      streakDays += 1;
    }

    // Update profile with new streak
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { streakDays },
      create: {
        userId: session.user.id,
        streakDays: 1,
      },
    });

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        userId: session.user.id,
        type,
        duration: parseInt(duration),
        caloriesBurned: parseInt(caloriesBurned),
        notes,
        completedAt: new Date(),
      },
    });

    // Revalidate the dashboard and workouts pages
    revalidatePath('/dashboard');
    revalidatePath('/workouts');

    return NextResponse.json(workout);
  } catch (error) {
    //console.error("Error creating workout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    //console.error("Error fetching workouts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 