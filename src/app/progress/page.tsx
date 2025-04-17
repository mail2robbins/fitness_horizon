import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Progress Tracking</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your fitness progress and achievements will appear here.</p>
      </div>
    </div>
  );
} 