import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInComponent from "./SignInComponent";
import { ClientSafeProvider } from "next-auth/react";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  
  // Redirect if already signed in
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Get providers from auth options directly
  const providers = authOptions.providers.map(provider => ({
    id: provider.id,
    name: provider.name,
    type: provider.type,
    signinUrl: `/api/auth/signin/${provider.id}`,
    callbackUrl: `/api/auth/callback/${provider.id}`,
  }));

  const providersObject: Record<string, ClientSafeProvider> = providers.reduce((acc, provider) => {
    acc[provider.id] = provider;
    return acc;
  }, {} as Record<string, ClientSafeProvider>);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen flex flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Sign in to your account
          </h2>
        </div>
        <SignInComponent providers={providersObject} />
      </div>
    </div>
  );
} 