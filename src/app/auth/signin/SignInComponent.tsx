import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInComponent({ providers }: any) {
  return (
    <div className="mt-8 space-y-6">
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {provider.name === "Google" && (
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
              {provider.name === "GitHub" && (
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
            </span>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
} 