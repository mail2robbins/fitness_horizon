import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import VitalsList from "@/components/vitals/VitalsList";
import { Vital } from "@/types/vital";

export default async function AllVitalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const vitals = await prisma.healthVital.findMany({
    where: { userId: session.user.id },
    orderBy: { recordedAt: "desc" },
  });

  // Serialize the dates for client component
  const serializedVitals: Vital[] = vitals.map(vital => ({
    id: vital.id,
    userId: vital.userId,
    type: vital.type,
    value: vital.value,
    value2: vital.value2 ?? undefined,
    unit: vital.unit,
    notes: vital.notes ?? undefined,
    recordedAt: vital.recordedAt.toISOString(),
    createdAt: vital.recordedAt.toISOString(), // Using recordedAt as createdAt if not available
    updatedAt: vital.recordedAt.toISOString(), // Using recordedAt as updatedAt if not available
  }));

  return <VitalsList vitals={serializedVitals} />;
} 