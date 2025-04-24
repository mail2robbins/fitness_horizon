"use client";

import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const navigation = [
    { name: "Features", href: "/features" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Workouts", href: "/workouts" },
    { name: "Meals", href: "/meals" },
    { name: "About", href: "/about" },
  ];

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="h-16 relative">
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-border shadow-lg z-[9999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-bold text-primary">
                  Health & Fitness
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      isActive(item.href)
                        ? "border-primary text-primary dark:text-primary dark:border-primary font-semibold"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground dark:hover:text-gray-300",
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {session ? (
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={session.user?.image || "/default-avatar.png"}
                        alt=""
                        width={32}
                        height={32}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-border focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={classNames(
                              active ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Sign in
                </Link>
              )}
              <Disclosure as="div" className="sm:hidden">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                    <Disclosure.Panel className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-border focus:outline-none">
                      <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as={Link}
                            href={item.href}
                            className={classNames(
                              isActive(item.href)
                                ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                              "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                            )}
                            onClick={handleMenuItemClick}
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                        {session && (
                          <Disclosure.Button
                            as="button"
                            onClick={() => {
                              signOut();
                              handleMenuItemClick();
                            }}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                          >
                            Sign out
                          </Disclosure.Button>
                        )}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 