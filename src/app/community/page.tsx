import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function CommunityPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Connect with other fitness enthusiasts and share your journey here.</p>
      </div>
    </div>
  );
} 