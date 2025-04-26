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
    const { type, value, value2, unit, notes } = body;

    // Validate required fields
    if (!type || value === undefined || !unit) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate numeric values
    if (isNaN(value) || (value2 !== undefined && isNaN(value2))) {
      return new NextResponse("Invalid numeric values", { status: 400 });
    }

    // Update the vital record
    const updatedVital = await prisma.healthVital.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        type,
        value,
        value2,
        unit,
        notes,
      },
    });

    return NextResponse.json(updatedVital);
  } catch (error) {
    console.error("[VITAL_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the vital record
    await prisma.healthVital.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[VITAL_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 