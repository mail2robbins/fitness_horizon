import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MealForm from "@/components/meals/MealForm";

export default async function LogMealPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Log a Meal</h1>
        <MealForm />
      </div>
    </div>
  );
} 