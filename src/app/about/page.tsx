import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Fitness Horizon
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Your comprehensive health and fitness companion for tracking workouts, nutrition, and achieving your fitness goals.
          </p>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Workout Tracking</h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                Log your workouts, track your progress, and see your fitness journey unfold with detailed analytics and insights.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Nutrition Tracking</h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                Monitor your daily nutrition, track calories, macronutrients, and get personalized meal recommendations.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Progress Insights</h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                Visualize your progress with charts and analytics, set goals, and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 py-12">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Our Mission</h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
              At Fitness Horizon, we believe that everyone deserves access to tools that help them lead a healthier life. 
              Our mission is to provide a comprehensive platform that makes tracking your health and fitness journey 
              simple, enjoyable, and effective.
            </p>
          </div>
        </div>

        <div className="mt-8 pb-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Get Started Today</h2>
            <div className="mt-8 flex justify-center">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 