import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MealCreateBody {
  name: string;
  type: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json() as MealCreateBody;
    const { name, type, calories, protein, carbs, fat, notes } = body;

    const meal = await prisma.meal.create({
      data: {
        name,
        type,
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fat: parseInt(fat),
        notes,
        consumedAt: new Date(),
        userId: session.user.id,
      },
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        consumedAt: "desc",
      },
    });

    return NextResponse.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 