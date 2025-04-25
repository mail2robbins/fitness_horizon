import { getProviders } from "next-auth/react";
import SignInComponent from "./SignInComponent";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <SignInComponent providers={providers ?? {}} />
      </div>
    </div>
  );
} 