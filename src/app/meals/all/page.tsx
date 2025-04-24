import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import MealsList from "@/components/meals/MealsList";

export default async function AllMealsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const meals = await prisma.meal.findMany({
    where: { userId: session.user.id },
    orderBy: { consumedAt: "desc" },
  });

  // Serialize the dates for client component
  const serializedMeals = meals.map(meal => ({
    ...meal,
    consumedAt: meal.consumedAt.toISOString(),
  }));

  return <MealsList initialMeals={serializedMeals} />;
} 