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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vitals = await prisma.healthVital.findMany({
      where: {
        userId: session.user.id,
        recordedAt: {
          gte: today,
        },
      },
      orderBy: {
        recordedAt: "desc",
      },
    });

    return NextResponse.json(vitals);
  } catch (error) {
    console.error("[VITALS_TODAY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 