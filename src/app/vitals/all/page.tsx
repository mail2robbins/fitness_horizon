import { prisma } from "@/lib/prisma";
import VitalsList from "@/components/vitals/VitalsList";
import { Vital } from "@/types/vital";
import { Prisma } from "@prisma/client";

export default async function AllVitalsPage() {
  const vitals = await prisma.healthVital.findMany({
    orderBy: {
      recordedAt: "desc",
    },
  });

  const serializedVitals: Vital[] = vitals.map((vital) => ({
    id: vital.id,
    userId: vital.userId,
    type: vital.type,
    value: vital.value,
    value2: vital.value2 ?? undefined,
    unit: vital.unit,
    notes: vital.notes ?? undefined,
    recordedAt: vital.recordedAt.toISOString(),
    createdAt: vital.recordedAt.toISOString(), // Using recordedAt as createdAt since it's not in the schema
    updatedAt: vital.recordedAt.toISOString(), // Using recordedAt as updatedAt since it's not in the schema
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Vitals</h1>
      <VitalsList vitals={serializedVitals} />
    </div>
  );
} 