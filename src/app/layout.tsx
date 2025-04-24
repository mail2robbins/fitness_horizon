import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth"
import { headers } from 'next/headers'
import AuthProvider from '@/components/AuthProvider'
import { authOptions } from "@/lib/auth"
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fitness Horizon',
  description: 'Track your health and fitness journey',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <AuthProvider session={session}>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
