"use client";

import Link from "next/link";
import { FaRegCompass } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20">
      <div className="w-full max-w-md mx-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        <FaRegCompass className="text-indigo-500 dark:text-indigo-400 mb-6" size={56} />
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 