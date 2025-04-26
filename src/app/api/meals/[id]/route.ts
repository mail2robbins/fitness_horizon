import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, type, calories, protein, carbs, fat, notes } = body;

    // Validate required fields
    if (!name || !type || !calories || !protein || !carbs || !fat) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Convert string numbers to actual numbers
    const numericCalories = Number(calories);
    const numericProtein = Number(protein);
    const numericCarbs = Number(carbs);
    const numericFat = Number(fat);

    // Validate numeric values
    if (
      isNaN(numericCalories) ||
      isNaN(numericProtein) ||
      isNaN(numericCarbs) ||
      isNaN(numericFat) ||
      numericCalories < 0 ||
      numericProtein < 0 ||
      numericCarbs < 0 ||
      numericFat < 0
    ) {
      return new NextResponse("Invalid numeric values", { status: 400 });
    }

    // Update the meal in the database
    const updatedMeal = await prisma.meal.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        type,
        calories: numericCalories,
        protein: numericProtein,
        carbs: numericCarbs,
        fat: numericFat,
        notes: notes || null,
      },
    });

    return NextResponse.json(updatedMeal);
  } catch (error) {
    console.error("[MEAL_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 