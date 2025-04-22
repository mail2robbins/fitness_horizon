import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import WorkoutList from "@/components/workouts/WorkoutList";

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [workouts, totalWorkouts] = await Promise.all([
    prisma.workout.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        completedAt: "desc",
      },
      skip: offset,
      take: limit,
    }),
    prisma.workout.count({
      where: {
        userId: session.user.id,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalWorkouts / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <Link
          href="/workouts/log"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log New Workout
        </Link>
      </div>

      <WorkoutList workouts={workouts} />

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/workouts?page=${pageNum}`}
              className={`px-4 py-2 rounded-md ${
                pageNum === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 