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
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <SignInComponent providers={providersObject} />
      </div>
    </div>
  );
} 