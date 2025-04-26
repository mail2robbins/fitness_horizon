import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vitals = await prisma.healthVital.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        recordedAt: "desc",
      },
    });

    return NextResponse.json(vitals);
  } catch (error) {
    console.error("[VITALS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { type, value, value2, unit, notes } = body;

    // Validate required fields
    if (!type || value === undefined || !unit) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate numeric values
    if (isNaN(value) || (value2 !== undefined && isNaN(value2))) {
      return new NextResponse("Invalid numeric values", { status: 400 });
    }

    // Create the vital record
    const vital = await prisma.healthVital.create({
      data: {
        userId: session.user.id,
        type,
        value,
        value2,
        unit,
        notes,
      },
    });

    return NextResponse.json(vital);
  } catch (error) {
    console.error("[VITALS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 