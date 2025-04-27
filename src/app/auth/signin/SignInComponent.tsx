'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";
import type { ClientSafeProvider } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface SignInComponentProps {
  providers: Record<string, ClientSafeProvider>;
}

export default function SignInComponent({ providers }: SignInComponentProps) {
  return (
    <div className="mt-8 space-y-6">
      {Object.values(providers).map((provider: ClientSafeProvider) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-6">
              {provider.name === "Google" && (
                <FcGoogle className="h-6 w-6" />
              )}
              {provider.name === "GitHub" && (
                <FaGithub className="h-6 w-6 text-white dark:text-gray-200" />
              )}
            </span>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
} 