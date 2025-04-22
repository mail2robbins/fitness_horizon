import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { workoutType, duration, exercises, calories, notes } = body;

    // Validate required fields
    if (!workoutType || !duration || !exercises || !calories) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        workoutType,
        duration: parseInt(duration),
        exercises,
        caloriesBurned: parseInt(calories),
        notes,
      },
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error creating workout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 