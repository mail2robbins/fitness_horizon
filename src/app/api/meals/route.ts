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
    const { name, type, calories, protein, carbs, fat, notes, consumedAt } = body;

    // Validate required fields
    if (!name || !type || !calories || !protein || !carbs || !fat) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create meal
    const meal = await prisma.meal.create({
      data: {
        name,
        type,
        calories,
        protein,
        carbs,
        fat,
        notes,
        consumedAt: new Date(consumedAt),
        userId: user.id,
      },
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 