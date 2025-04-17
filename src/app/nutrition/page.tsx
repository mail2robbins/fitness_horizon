import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function NutritionPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nutrition Tracking</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your meal plans and nutrition tracking will appear here.</p>
      </div>
    </div>
  );
} 