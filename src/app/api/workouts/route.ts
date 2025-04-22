import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error creating workout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
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
    console.error("Error fetching workouts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 