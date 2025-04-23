import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            About HealthFit
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Your comprehensive health and fitness companion for tracking workouts, nutrition, and achieving your fitness goals.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Workout Tracking</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Log your workouts, track your progress, and see your fitness journey unfold with detailed analytics and insights.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nutrition Tracking</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Monitor your daily nutrition, track calories, macronutrients, and get personalized meal recommendations.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Progress Insights</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Visualize your progress with charts and analytics, set goals, and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 text-center max-w-3xl mx-auto">
            At HealthFit, we believe that everyone deserves access to tools that help them lead a healthier life. 
            Our mission is to provide a comprehensive platform that makes tracking your health and fitness journey 
            simple, enjoyable, and effective.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">Get Started Today</h2>
          <div className="mt-8 flex justify-center">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 