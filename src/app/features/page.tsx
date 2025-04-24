export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Features that empower your fitness journey
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our platform provides all the tools you need to track, analyze, and
            improve your health and fitness goals.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-6">
                    <feature.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <dt className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </dt>
                  <dd className="mt-3 text-base text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
      </div>
    </main>
  );
}

const features = [
  {
    name: "Workout Tracking",
    description:
      "Log your workouts, track your progress, and get personalized recommendations based on your fitness goals.",
    icon: function WorkoutIcon(props: any) {
      return (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      );
    },
  },
  {
    name: "Nutrition Planning",
    description:
      "Create meal plans, track your nutrition, and get insights into your dietary habits.",
    icon: function NutritionIcon(props: any) {
      return (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8.25c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zM12 8.25c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"
          />
        </svg>
      );
    },
  },
  {
    name: "Progress Analytics",
    description:
      "Visualize your progress with detailed charts and analytics to stay motivated and on track.",
    icon: function AnalyticsIcon(props: any) {
      return (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      );
    },
  },
]; 